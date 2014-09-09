__author__ = 'yrafalsky'

from dinamo_db_base import DinamoDbTable
from boto.dynamodb2.table import Table, HashKey
from boto.dynamodb2.types import NUMBER, STRING

class MyTable(DinamoDbTable):
    tableName = "test_table"
    key = dict()
    key[u'user_id'] = {'type': int, 'mandatory': False, 'pk': True}
    key[u'user_name'] = {'type': unicode, 'mandatory': True}

    def create_table(self):
        print "Creating table %s" % self.__class__.tableName
        table = Table.create(table_name=self.__class__.tableName,
                             schema=[HashKey(self.get_pk_name(), data_type=NUMBER)],
                             throughput={'read': 200, 'write': 10},
                             connection=self.get_connection())
        return table

  