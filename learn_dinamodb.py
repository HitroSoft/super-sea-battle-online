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
from boto.dynamodb2.table import Table, HashKey
from boto.dynamodb2.types import NUMBER, STRING

from superseabattleonline.settings import BASE_DIR


def get_value_from_config(name):
    try:
        config = ConfigParser.RawConfigParser()
        filename = os.path.join(BASE_DIR, "data/credentials.ini")
        config.read(filename)
        return config.get('AWS_Credentials', name)
    except Exception as e:
        return None

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

table = Table.create(table_name="hello",
                             schema=[HashKey("id", data_type=NUMBER)],
                             throughput={'read': 200, 'write': 10},
                             connection=conn)

time.sleep(5)

data = dict()
data['id'] = 1
data['name'] = 'myname'
insert_result = table.put_item(data=data)

pk_selector = dict()
pk_selector['id'] = 1

fetched_item = table.get_item(**pk_selector)
resp = dict()
for keyz in fetched_item.keys():
    resp[keyz] = fetched_item[keyz]
    if isinstance(resp[keyz], Decimal):
        resp[keyz] = int(resp[keyz])
    elif isinstance(resp[keyz], str):
        resp[keyz] = unicode(resp[keyz])


print resp



