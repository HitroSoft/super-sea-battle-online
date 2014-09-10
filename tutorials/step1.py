__author__ = 'yrafalsky'

# python is very flexible language. Var can be assigned to one type and after that reassigned to another type. From the beginning it confuses you, but later you get used to it.

# set boolean value
some_variable = True
print(some_variable)
some_variable = False
print(some_variable)

# set string value
some_variable = "HelloWorld"
print(some_variable)
#strings can be unicode. It is not seen when you print data on screen but very important when you sent data over HTTP or save/load on HDD etc.
some_variable = u"HelloWorld"
print(some_variable)

# set list value. Note - list can contain ANY types together
some_variable = list()
some_variable.append("value1")
some_variable.append("value2")
some_variable.append(3)
some_variable.append(True)
print(some_variable)

# set list value by another transcription - result will be the same object list
some_variable = ["value1", "value2", 3, True]
print(some_variable)

# get list size (values amount)
print(some_variable.__len__())

# remove first occurrence of this value from list
some_variable.remove("value2")
print(some_variable)
#this command will remove value at zero index
some_variable.pop(0)
print(some_variable)
# to get value from list by index you can use var[index]
print (some_variable[0])
# to add variable in list's tail - just use append method
some_variable.append("value_appended_in tail")
print (some_variable)
# to add variable in specific position in list - use insert method
some_variable.insert(1, "value_inserted_at_1_index")
print (some_variable)
# you can get sublist of list just using [start_index_inclusive, end_index_exclusive]. Pay attention that end-index is exclusive - if you set[0:1] - mean get list with indexes from 0 including 0 to 1 excluding 1 - will return list with only 1 value from originallist[0]
print (some_variable[0:1])
# this command will return list which is same as original (original list have values from (0 to originallist.__len__()-1); specifying  list[0:originallist.__len__()] you will receive whole list
print (some_variable[0:some_variable.__len__()])

# if you want variable to be null - you must set it to None. So 'None' is the same thing as 'null' in Java
some_variable=None
print(some_variable)


# if statements pretty same as in other languages. Comparison starts with 'if' and always ends with ':'. Actually ':' is kind of opening brackets in Java/C. Also when you opening 'brackets' in python you must shift lines inside 'brackets body' with Tab. When you want to 'close brackets' - unshift Tab at next line
if some_variable == None:
    print ("some_variable is None !")
else:
    print ("some_variable is NOT None !")

