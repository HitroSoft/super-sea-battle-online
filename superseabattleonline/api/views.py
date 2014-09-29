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
from ai_palyer import AIplayer
from common_data import ships_states, game_list

def get_value_from_config(name):
    try:
        config = ConfigParser.RawConfigParser()
        filename = os.path.join(BASE_DIR, "data/bot_dictionary.conf")
        config.read(filename)
        return config.get(name,"message")
    except Exception as e:
        print (e)
        return None


lock = threading.Lock()


class Game(object):

    def __init__(self):
        self.game_name = ''.join(random.choice(string.ascii_letters) for _ in range(12))
        self.battlefield_first_player = None
        self.battlefield_second_player = None
        self.first_player_id = None
        self.first_player_response_id = None
        self.first_player_response_received_id = None
        self.first_player_to_message_queue = None
        self.second_player_id = None
        self.second_player_response_id = None
        self.second_player_response_received_id = None
        self.second_player_to_message_queue = None
        self.game_state = "empty-game"
        self.ai_allowed = True
        self.is_game_active = True

    def add_first_player(self, data):
        self.first_player_id = ''.join(random.choice(string.ascii_letters) for _ in range(12))
        self.first_player_response_id = 0
        self.first_player_response_received_id = 0
        self.battlefield_first_player = data['ships']
        for ship in self.battlefield_first_player:
            for cell in ship:
                cell['STATE'] = ships_states['INITIALIZED']
        self.first_player_to_message_queue = []
        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":"waiting-for-rival","id":self.first_player_response_id,"start":int(time.time())})

        self.game_state = "waiting-for-rival"
        return


    def attach_ai_player(self):
        self.ai_player = AIplayer()
        self.ai_player.join_game(self)
        self.battlefield_second_player = list(self.ai_player.ai_battlefield)
        for ship in self.battlefield_second_player:
            for cell in ship:
                cell['STATE'] = ships_states['INITIALIZED']
        self.second_player_to_message_queue = []
        self.second_player_response_id = 0
        self.second_player_response_received_id = 0
        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":"game-started-move-on","id":self.first_player_response_id,"start":int(time.time())})
        self.second_player_response_id += 1
        self.second_player_to_message_queue.append({"name":"game-started-move-off","id":self.second_player_response_id,"start":int(time.time())})
        self.game_state = "game-started-first-players-move"

        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":"chat-message","id":self.first_player_response_id,"start":int(time.time()),"payload":{"message":get_value_from_config("Greetings"),"owner":"qwe","date":int(time.time())}})
        return

    def start_game(self, data):
        self.game_name = ''.join(random.choice(string.ascii_letters) for _ in range(12))
        self.battlefield_first_player = data['ships']
        for ship in self.battlefield_first_player:
            for cell in ship:
                cell['STATE'] = ships_states['INITIALIZED']
        self.first_player_response_id = 0
        self.first_player_response_received_id = 0
        self.game_state = "waiting-for-rival"
        self.first_player_to_message_queue = []

        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":"waiting-for-rival","id":self.first_player_response_id,"start":int(time.time())})

        return

    def get_unreceived_events_for_first_player(self):
        events_to_send = []
        for i in range(self.first_player_response_received_id, self.first_player_response_id, 1):
            events_to_send.append(self.first_player_to_message_queue[i])
        return events_to_send


    def check_are_all_ships_killed(self, user_num):
        first_player_ships_killed = True
        for ship in self.battlefield_first_player:
            for cell in ship:
                if cell['STATE']not in [ships_states['KILLED'],ships_states['WOUNDED']]:
                    first_player_ships_killed = False
                    break
        second_player_ships_killed = True
        for ship in self.battlefield_second_player:
            for cell in ship:
                if cell['STATE']not in [ships_states['KILLED'],ships_states['WOUNDED']]:
                    second_player_ships_killed = False
                    break
        if first_player_ships_killed==True:
            return 2
        if second_player_ships_killed==True:
            return 1
        return 0

    def make_player_shoot(self,user_num,x,y):
        if user_num==1:
            target_battlefield = self.battlefield_second_player
        else:
            target_battlefield = self.battlefield_first_player
        result = ships_states['MISSED']

        for ship in target_battlefield:
            for cell in ship:
                if x == cell['x'] and y ==cell['y']:
                    cell['STATE']=ships_states['WOUNDED']
                    ship_killed=True
                    for cell2 in ship:
                        if cell2['STATE'] != ships_states['WOUNDED'] and cell2['STATE'] != ships_states['KILLED']:
                            ship_killed=False
                    if ship_killed:
                        for cell2 in ship:
                            cell2['STATE'] = ships_states['KILLED']
                        result = ships_states['KILLED']
                    else:
                        result = ships_states['WOUNDED']
        killer = self.check_are_all_ships_killed(1)
        if killer!=0:
            if killer==1:
                first_user_action = 'game-over-win'
                second_user_action = 'game-over-lose'
                self.game_state = "first-player-win"
            elif killer==2:
                second_user_action = 'game-over-win'
                first_user_action = 'game-over-lose'
                self.game_state = "second-player-win"
        else:
            if result in [ships_states['WOUNDED'], ships_states['KILLED']]:
                if user_num==1:
                    self.game_state = "first-player-move"
                    first_user_action = "move-on"
                    second_user_action = "move-off"
                else:
                    self.game_state = "second-player-move"
                    first_user_action = "move-off"
                    second_user_action = "move-on"
            else:
                if user_num==1:
                    self.game_state = "second-player-move"
                    first_user_action = "move-off"
                    second_user_action = "move-on"
                else:
                    self.game_state = "first-player-move"
                    first_user_action = "move-on"
                    second_user_action = "move-off"
        if user_num==1:
            self.first_player_response_id += 1
            self.first_player_to_message_queue.append({"name":first_user_action,"id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":result}}})
            self.second_player_response_id += 1
            self.second_player_to_message_queue.append({"name":second_user_action,"id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":result}}})
        else:
            self.first_player_response_id += 1
            self.first_player_to_message_queue.append({"name":first_user_action,"id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":result}}})
            self.second_player_response_id += 1
            self.second_player_to_message_queue.append({"name":second_user_action,"id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":result}}})
        return

    def leave_game(self,user_id): # todo make this functionality
        self.is_game_active = False



def find_game_by_name(user_id):
    for game in game_list:
        if game.first_player_id == user_id or game.second_player_id == user_id:
            return game
    return None

def create_game(user_id, json_data):
    game = Game()
    game.add_first_player(json_data)
    game_list.append(game)
    user_id = game.first_player_id
    events = game.get_unreceived_events_for_first_player()
    lock.release()
    return HttpResponse(content=json.dumps({"id":user_id, "events":events}),
                content_type='application/json',
                status=200)

def waiting_for_event(user_id, json_data):
    game = find_game_by_name(user_id)
    if game is None:
        raise Exception("Game not found - no create event was detected")
    if game.game_state=="waiting-for-rival" and game.ai_allowed:
        game.attach_ai_player()
    if 'reid' in json_data:
        game.first_player_response_received_id = json_data['reid']
    events = game.get_unreceived_events_for_first_player()
    if events.__len__()==0 and game.game_state=="second-player-move" and random.randint(0,3) == 0 and game.ai_allowed:
        x,y = game.ai_player.make_shoot()
        game.make_player_shoot(user_num=2,x=x, y=y)
        events = game.get_unreceived_events_for_first_player()
    lock.release()
    if events.__len__()==0:
        time.sleep(0.5)
        return HttpResponse(content=json.dumps({"id":user_id, "events":events}),
                content_type='application/json',
                status=504)
    else:
        return HttpResponse(content=json.dumps({"id":user_id, "events":events}),
                content_type='application/json',
                status=200)
def register_shoot(user_id, json_data):
    game = find_game_by_name(user_id)
    if game is None:
        raise Exception("Game not found - no create event was detected")
    if game.game_state != "game-started-first-players-move" and  game.game_state != "first-player-move":
        print "Error in game - game turn error!"
        return HttpResponse(content="Error in game",
                content_type='application/json',
                status=501)
    x = json_data['shoot']['x']
    y = json_data['shoot']['y']
    game.make_player_shoot(user_num=1,x=x, y=y)
    events = game.get_unreceived_events_for_first_player()
    lock.release()
    return HttpResponse(content=json.dumps({"id":user_id, "events":events}),
                content_type='application/json',
                status=200)


class Imitator(APIView):
    renderer_classes = (JSONRenderer, )

    def post(self, request, *args, **kw):
        try:
            lock.acquire()
            start_time = time.time()
            try:
                user_id = kw['pk']
                zz = request.body
                json_data = json.loads(request.body)
                if json_data['command']=="leave":
                    return create_game(user_id=user_id, json_data=json_data)
                if json_data['command']=="create":
                    return create_game(user_id=user_id, json_data=json_data)
                if json_data['command']=="waiting-for-event":
                    return waiting_for_event(user_id=user_id,json_data=json_data)
                if json_data['command']=="register-shoot":
                    return register_shoot(user_id=user_id, json_data=json_data)

                lock.release()
                print "Unknown command " + str(json_data)
                return HttpResponse(content=None,
                                content_type='application/json',
                                status=504)

            except requests.Timeout as timeout:
                print("Request failed by timeout")
                print("Request took " + str(time.time() - start_time) + " seconds")
                lock.release()
                return HttpResponse(content=None,
                                content_type='application/json',
                                status=504)
            except Exception as e:
                print("Request failed: " + str(e))
                print("Request took " + str(time.time() - start_time) + " seconds")
                lock.release()
                return HttpResponse("user fetch failed. Exception : %s" % e, status=502)
            except:
                print("Request failed")
                print("Request took " + str(time.time() - start_time) + " seconds")
                lock.release()
                return HttpResponse("user fetch failed", status=502)
        except:
            print("WTF????")
        finally:
            if lock.locked():
                print("locked")

