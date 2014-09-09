from decimal import *
import ConfigParser

import boto
import time
import boto.dynamodb2
from boto.dynamodb2.layer1 import DynamoDBConnection
from boto.dynamodb2.table import Table, ResultSet
from boto.dynamodb.types import Dynamizer
from boto.exception import JSONResponseError
import os
from superseabattleonline.settings import BASE_DIR
#from labelservice.label_service_api_config.settings import AWS_REGION_NAME

import logging


log = logging.getLogger(__name__)


def get_value_from_config(name):
    try:
        config = ConfigParser.RawConfigParser()
        filename = os.path.join(BASE_DIR, "data/credentials.ini")
        config.read(filename)
        return config.get('AWS_Credentials', name)
    except Exception as e:
        log.error(e)
        return None


class DinamoDbTable(object):
    table = None
    tableName = None
    key = dict()
    connection = None

    def get_connection(self):
        if self.__class__.connection is not None:
            return self.__class__.connection
        props_aws_access_key_id = get_value_from_config('aws_access_key_id')
        props_aws_secret_access_key = get_value_from_config('aws_secret_access_key')
        props_use_local_db = get_value_from_config('use_local_db')
        props_local_db_ip = get_value_from_config('local_db_ip')
        props_local_db_port = get_value_from_config('local_db_port')
        # if credentials were not provided - app should use IAMrole to work with DB - no params needed
        if props_aws_access_key_id is None or props_aws_secret_access_key is None:
            conn = boto.dynamodb2.connect_to_region()
        #if credentials provided and props_use_local_db == False (or not exists)
        elif not props_use_local_db:
            conn = boto.dynamodb2.connect_to_region(aws_access_key_id=props_aws_access_key_id,
                                                    aws_secret_access_key=props_aws_secret_access_key)
        #if credentials provided and props_use_local_db == True
        elif props_use_local_db:
            preconn = boto.dynamodb2.RegionInfo(endpoint=props_local_db_ip, name="hello",
                                                connection_cls=boto.dynamodb2.layer1.DynamoDBConnection)
            conn = preconn.connect(aws_access_key_id=props_aws_access_key_id,
                                   aws_secret_access_key=props_aws_secret_access_key, port=int(props_local_db_port), is_secure=False)
        else:
            raise Exception("Cannot create DB connection")
        self.__class__.connection = conn
        return conn

    #this method receives table state. If table not exists - returns None. If unknown error - raises Exception
    def get_table_state(self):
        try:
            table_description = self.get_connection().describe_table(self.__class__.tableName)
            return table_description['Table']['TableStatus']
        except JSONResponseError as e:
            if e.error_code == 'InvalidSignatureException':
                raise Exception("Service Internal Authentication error")
            if e.error_code == 'ResourceNotFoundException':  #  normal case - table not found
                return None
            raise Exception("Unhandled exception " + e.error_code)
        except Exception as e:
            return None

    def get_table_internal(self, name):
        tbl = Table(table_name=name, connection=self.get_connection())
        try:
            tbl.describe()
        except:
            tbl = None
        return tbl

    def get_table(self):
        if self.__class__.table is None:
            self.__class__.table = self.get_table_internal(self.__class__.tableName)
            if self.__class__.table is None:
                raise Exception("Table %s not exists" % self.__class__.tableName)
            if self.get_table_state() != 'ACTIVE':
                raise Exception("Table %s exists, but not active" % self.__class__.tableName)
            # log.debug("GetTable %s" % self.__class__.tableName)
        return self.__class__.table


    def create_table(self):
        return None

    def get_items_list(self):
        items_result_set = self.get_table().scan()
        result_dictionary = list()
        for item in items_result_set:
            result_dictionary.append(self.to_native(self.normalize_to_dict(item)))
        return result_dictionary

    @staticmethod
    def normalize_to_dict(obj):
        if obj is None:
            return obj
        resp = dict()
        for keyz in obj.keys():
            resp[keyz] = obj[keyz]
            if isinstance(resp[keyz], Decimal):
                resp[keyz] = int(resp[keyz])
            elif isinstance(resp[keyz], str):
                resp[keyz] = unicode(resp[keyz])

        return resp


    def to_native(self, data):
        return data

    def get_pk_name(self):
        pk_field_name = None
        for key in self.__class__.key.keys():
            if ('pk' in self.__class__.key[key]) and self.__class__.key[key]['pk']:
                pk_field_name = key
        if pk_field_name is None:
            raise Exception("pk field absent in model %s" % self.__class__)
        return pk_field_name

    def get_item_internal(self, pk):
        table = self.get_table()
        pk_field_name = self.get_pk_name()
        pk_selector = dict()
        pk_selector[str(pk_field_name)] = pk
        try:
            fetched_item = table.get_item(**pk_selector)
            if (fetched_item.keys().__len__() == 0):
                fetched_item = None
        except:
            fetched_item = None
        return fetched_item

    def update_item(self, data):
        start_time = time.time()
        item = self.get_table().new_item()
        for keys in data.keys():
            item[keys] = data[keys]
        pk_attr_value = Dynamizer().encode(data[self.get_pk_name()])
        pk_attr = {'Exists': True, 'Value': pk_attr_value}
        self.get_connection().put_item(self.tableName, item.prepare_full(),
                                       expected={self.get_pk_name(): pk_attr})
        log.info("Runtime:%s", time.time() - start_time)
        return self.get_item(data[self.get_pk_name()])

    def delete_item(self, pk):
        start_time = time.time()
        if self.get_item(pk) is None:
            return False
        table = self.get_table()
        pk_field_name = self.get_pk_name()
        pk_selector = dict()
        pk_selector[str(pk_field_name)] = pk
        result = table.delete_item(**pk_selector)
        log.info("Runtime:%s", time.time() - start_time)
        return result

    def put_item_internal(self, data):
        insert_result = self.get_table().put_item(data=data)
        if insert_result:
            return self.get_item(data[self.get_pk_name()])
        else:
            return None

    def put_item(self, data):
        data = self.normalize_to_dict(data)
        self.validate(data=data, check_pk=True)
        insert_result = self.put_item_internal(data=data)
        if insert_result:
            return self.get_item(data[self.get_pk_name()])
        else:
            return None

    def validate(self, data, check_pk=False):
        #here we check for keys which must exist
        for key in self.__class__.key.keys():
            if self.__class__.key[key]['mandatory'] and (not (key in data) or ((key in data) and data[key] is None)):
                raise Exception("Mandatory field is missing : %s" % key)
            if check_pk and ('pk' in self.__class__.key[key]) and self.__class__.key[key]['pk'] and not (key in data):
                #check for pk.If pk not found on request - go home
                raise Exception("Primary key is missing : %s" % key)
            if (key in data) and (data[key] is not None) and not \
                    (isinstance(data[key], self.__class__.key[key]['type'])):
                print (
                    "Key cast error %s %s %s %s" % (key, data[key], self.__class__.key[key]['type'], type(data[key]) ))
                raise Exception("Cast error in key: %s " % key)
        for key in data.keys():
            if key not in self.__class__.key.keys():
                raise Exception("Unknown key found %s" % key)
        return True

    def get_item(self, pk):
        item = self.get_item_internal(pk)
        item_as_dictionary = self.normalize_to_dict(item)
        if item_as_dictionary is None:
            raise Exception("item %s not found" % pk)
        return self.to_native(item_as_dictionary)



