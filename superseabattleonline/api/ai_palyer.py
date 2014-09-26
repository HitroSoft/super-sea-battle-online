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

    def generate_my_random_battlefield(self):
        my_ships = list()
        for x in range(0, 5, 1):
            my_ship = list()
            my_ship.append({'x':random.randint(0,9), 'y':random.randint(0,9)})
            my_ships.append(my_ship)
        return my_ships

    def generate_own_battlefield(self):
        self.ai_battlefield = [[{u'y': 0, u'x': 8}, {u'y': 1, u'x': 8}, {u'y': 2, u'x': 8}, {u'y': 3, u'x': 8}], [{u'y': 3, u'x': 3}, {u'y': 3, u'x': 4}, {u'y': 3, u'x': 5}], [{u'y': 6, u'x': 7}, {u'y': 7, u'x': 7}, {u'y': 8, u'x': 7}], [{u'y': 4, u'x': 1}, {u'y': 5, u'x': 1}], [{u'y': 0, u'x': 4}, {u'y': 0, u'x': 5}], [{u'y': 8, u'x': 3}, {u'y': 9, u'x': 3}], [{u'y': 5, u'x': 3}], [{u'y': 8, u'x': 1}], [{u'y': 8, u'x': 9}], [{u'y': 8, u'x': 5}]]
        # self.ai_battlefield = self.generate_my_random_battlefield()
        return

    def point_cell_as_processed(self,x,y):
        if x<0 or x>9 or y<0 or y>9 or self.enemy_field[x][y]!=ships_states['INITIALIZED']:
            return
        self.enemy_field[x][y] = ships_states['PROCESSED']
        return

    def point_wounded_cell(self,x,y):
        x1 = x -1
        x2 = x+1
        y1 = y -1
        y2 = y +1
        self.enemy_field[x][y]=ships_states['WOUNDED']
        self.point_cell_as_processed(x1,y1)
        self.point_cell_as_processed(x1,y2)
        self.point_cell_as_processed(x2,y1)
        self.point_cell_as_processed(x2,y2)
        return

    def point_killed_cell(self,x,y): # mark cell as killed. all initialized cells around killed cell set as processed
        if x<0 or x> 9 or y<0 or y>9:
            return
        self.enemy_field[x][y]=ships_states['KILLED']
        for x1 in range(x-1,x+2,1):
            for y1 in range(y-1,y+2,1):
                self.point_cell_as_processed(x1,y1)
        return

    def mark_cell_as_killed_and_transform_wounded_to_killed(self,x,y):
        # self.enemy_field[x][y] = ships_states['KILLED']
        self.point_killed_cell(x,y)
        for x1 in range(x,10,1):
            if self.enemy_field[x1][y] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            # self.enemy_field[x1][y] = ships_states['KILLED']
            self.point_killed_cell(x1,y)
        for x1 in range(x,-1,-1):
            if self.enemy_field[x1][y] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            # self.enemy_field[x1][y] = ships_states['KILLED']
            self.point_killed_cell(x1,y)
        for y1 in range(y,10,1):
            if self.enemy_field[x][y1] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            # self.enemy_field[x][y1] = ships_states['KILLED']
            self.point_killed_cell(x,y1)
        for y1 in range(y,-1,-1):
            if self.enemy_field[x][y1] not in [ships_states['WOUNDED'],ships_states['KILLED']]:
                break
            # self.enemy_field[x][y1] = ships_states['KILLED']
            self.point_killed_cell(x,y1)
        return

    def mark_all_cells_near_killed_as_processed(self):
        for x in range(0,10,1):
            for y in range (0,10,1):
                if self.enemy_field[x][y]==ships_states['KILLED']:
                    self.point_killed_cell(x,y)


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
                        self.mark_cell_as_killed_and_transform_wounded_to_killed(succ_self_shoot['x'],succ_self_shoot['y'])
                    if succ_self_shoot['state']==ships_states['WOUNDED']:
                        self.point_wounded_cell(succ_self_shoot['x'],succ_self_shoot['y'])

        self.mark_all_cells_near_killed_as_processed()
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

