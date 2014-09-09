__author__ = 'yrafalsky'
from superseabattleonline.api.app_tables import MyTable
from time import gmtime, strftime,sleep
MyTable().create_table()

while True:
    if MyTable().get_table_state()=='ACTIVE':
        break
    sleep(5)
    print("waiting...")
print( 'Done creating tables at %s'% strftime("%Y-%m-%dT%H:%M:%SZ", gmtime()))
