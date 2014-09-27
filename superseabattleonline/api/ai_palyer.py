__author__ = 'yrafalsky'
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import json
import requests
from django.http import HttpResponse
import time
import threading
from random import randrange
import random
import string
import json
import ConfigParser
from superseabattleonline.settings import BASE_DIR
import os
from common_data import ships_states

class AIplayer(object):

    def generate_enemy_field(self):
        self.enemy_field = dict()
        for x in range(0, 10, 1):
            self.enemy_field[x] = dict()
            for y in range(0, 10, 1):
                self.enemy_field[x][y] = ships_states['INITIALIZED']

    def join_game(self, game):
        self.my_game = game
        self.generate_own_battlefield()
        self.generate_enemy_field()
        return

    def is_ship_fit_to_battlefield(self,x,y,size,orientation, field):
        if orientation=='vertical':
            if y+size-1 >9:
                return False
            for y1 in range(y,y+size,1):
                if field[x][y1]!=ships_states['INITIALIZED']:
                    return False
            return True
        else:
            if x+size-1 >9:
                return False
            for x1 in range(x,x+size,1):
                if field[x1][y]!=ships_states['INITIALIZED']:
                    return False
            return True

    def mark_cells_for_ship_as_killed(self,x,y,size,orientation, field):
        if orientation=='vertical':
            if y+size-1 >9:
                return False
            for y1 in range(y,y+size,1):
                if field[x][y1]!=ships_states['INITIALIZED']:
                    return False
            return True
        else:
            if x+size-1 >9:
                return False
            for x1 in range(x,x+size,1):
                if field[x1][y]!=ships_states['INITIALIZED']:
                    return False
            return True


    def generate_ship(self,x,y,size,orientation):
        result_list = []
        if orientation=='vertical':
            if y+size-1 >9:
                raise Exception("Wrong ship generation")
            for y1 in range(y,y+size,1):
                result_list.append({"x":x,"y":y1})
            return result_list
        else:
            if x+size-1 >9:
                raise Exception("Wrong ship generation")
            for x1 in range(x,x+size,1):
                result_list.append({"x":x1,"y":y})
            return result_list

    def generate_my_random_battlefield(self):
        my_field = dict()
        for x in range(0, 10, 1):
            my_field[x] = dict()
            for y in range(0, 10, 1):
                my_field[x][y] = ships_states['INITIALIZED']
        ships_to_create = [4,3,3,2,2,2,1,1,1,1]
        ships_result = []
        for size in ships_to_create:
            while True:
                x = random.randint(0,9)
                y = random.randint(0,9)
                if random.randint(0,1)==0:
                    orient = 'vertical'
                else:
                    orient = 'horizontal'
                if self.is_ship_fit_to_battlefield(x,y,size,orient,my_field):
                    random_ship = self.generate_ship(x,y,size,orient)
                    ships_result.append(random_ship)
                    for cells in random_ship:
                        my_field[cells['x']][cells['y']] = ships_states['KILLED']
                    self.mark_all_cells_near_killed_as_processed(my_field)
                    break
        return ships_result



        #     my_ship = list()
        #     my_ship.append({'x':random.randint(0,9), 'y':random.randint(0,9)})
        #     my_ships.append(my_ship)
        # return my_ships

    def generate_own_battlefield(self):
        # self.ai_battlefield = [[{u'y': 0, u'x': 8}, {u'y': 1, u'x': 8}, {u'y': 2, u'x': 8}, {u'y': 3, u'x': 8}], [{u'y': 3, u'x': 3}, {u'y': 3, u'x': 4}, {u'y': 3, u'x': 5}], [{u'y': 6, u'x': 7}, {u'y': 7, u'x': 7}, {u'y': 8, u'x': 7}], [{u'y': 4, u'x': 1}, {u'y': 5, u'x': 1}], [{u'y': 0, u'x': 4}, {u'y': 0, u'x': 5}], [{u'y': 8, u'x': 3}, {u'y': 9, u'x': 3}], [{u'y': 5, u'x': 3}], [{u'y': 8, u'x': 1}], [{u'y': 8, u'x': 9}], [{u'y': 8, u'x': 5}]]
        self.ai_battlefield = self.generate_my_random_battlefield()
        return

    def point_cell_as_processed(self,x,y,field):
        if x<0 or x>9 or y<0 or y>9 or field[x][y]!=ships_states['INITIALIZED']:
            return
        # self.enemy_field[x][y] = ships_states['PROCESSED']
        field[x][y] = ships_states['PROCESSED']
        return

    def point_wounded_cell(self,x,y,field):
        x1 = x -1
        x2 = x+1
        y1 = y -1
        y2 = y +1
        field[x][y]=ships_states['WOUNDED']
        self.point_cell_as_processed(x1,y1,field)
        self.point_cell_as_processed(x1,y2,field)
        self.point_cell_as_processed(x2,y1,field)
        self.point_cell_as_processed(x2,y2,field)
        return

    def point_killed_cell(self,x,y,field): # mark cell as killed. all initialized cells around killed cell set as processed
        if x<0 or x> 9 or y<0 or y>9:
            return
        field[x][y]=ships_states['KILLED']
        for x1 in range(x-1,x+2,1):
            for y1 in range(y-1,y+2,1):
                self.point_cell_as_processed(x1,y1,field)
        return

    def mark_cell_as_killed_and_transform_wounded_to_killed(self,x,y, field):
        self.point_killed_cell(x,y,field)
        for x1 in range(x,10,1):
            if field[x1][y] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            self.point_killed_cell(x1,y,field)
        for x1 in range(x,-1,-1):
            if field[x1][y] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            self.point_killed_cell(x1,y,field)
        for y1 in range(y,10,1):
            if field[x][y1] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            self.point_killed_cell(x,y1,field)
        for y1 in range(y,-1,-1):
            if field[x][y1] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            self.point_killed_cell(x,y1,field)
        return

    def mark_all_cells_near_killed_as_processed(self, field):
        for x in range(0,10,1):
            for y in range (0,10,1):
                if field[x][y]==ships_states['KILLED']:
                    self.point_killed_cell(x,y,field)


    def make_shoot(self):
        # checking all previous messages to refill battlefield
        for event in self.my_game.second_player_to_message_queue:
            if "payload" in event:
                payload = event['payload']
                if 'register-self-shoot' in payload:
                    self_shoot = payload['register-self-shoot']
                    if self_shoot['state']==ships_states['MISSED']:
                        self.enemy_field[self_shoot['x']][self_shoot['y']]=ships_states['MISSED']

        if self.my_game.second_player_response_id>0:
            last_event = self.my_game.second_player_to_message_queue[self.my_game.second_player_response_id-1]
            if "payload" in last_event:
                payload = last_event['payload']
                if 'register-self-shoot' in payload:
                    succ_self_shoot = payload['register-self-shoot']
                    if succ_self_shoot['state']==ships_states['KILLED']:
                        self.mark_cell_as_killed_and_transform_wounded_to_killed(succ_self_shoot['x'],succ_self_shoot['y'], self.enemy_field)
                    if succ_self_shoot['state']==ships_states['WOUNDED']:
                        self.point_wounded_cell(succ_self_shoot['x'],succ_self_shoot['y'],self.enemy_field)

        self.mark_all_cells_near_killed_as_processed(self.enemy_field)
        for x in range(0,10,1):
            for y in range(0,10,1):
                if self.enemy_field[x][y]==ships_states['WOUNDED']: # we have wonded cell which is not killed yet - try to kill this ship
                    if x>0 and self.enemy_field[x-1][y]==ships_states['INITIALIZED']:
                        return x-1,y
                    if x<9 and self.enemy_field[x+1][y]==ships_states['INITIALIZED']:
                        return x+1,y
                    if y>0 and self.enemy_field[x][y-1]==ships_states['INITIALIZED']:
                        return x,y-1
                    if y<9 and self.enemy_field[x][y+1]==ships_states['INITIALIZED']:
                        return x,y+1
        # otherwise fire at random position
        counter = 0
        while True:
            counter+=1
            x = random.randint(0,9)
            y = random.randint(0,9)
            if self.enemy_field[x][y]==ships_states['INITIALIZED']: # make shoot
                print 'counter=' + str(counter)
                return x,y

        return

