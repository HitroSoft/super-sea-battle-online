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


lock = threading.Lock()
ships_states = {'INITIALIZED': -3, 'PROCESSED': -2, 'MISSED': -1, 'WOUNDED': 0, 'KILLED': 1}

class Retraslator(APIView):
    renderer_classes = (JSONRenderer, )

    def post(self, request, *args, **kw):
        start_time = time.time()
        try:
            user_id = kw['pk']
            print ("=========================")
            print ("UserId="+user_id)
            print ("Request:")
            body_as_object = json.loads(request.body)
            print(body_as_object)
            response = requests.post(url="http://en.battleship-game.org/services/"+ user_id, headers={'Accept': 'application/json'}, data=request.body, timeout=1)
            print ("Response:")
            print (response.content)
            print("Request took " + str(time.time() - start_time) + " seconds")
            lock.release()
            return HttpResponse(content=response.content,
                            content_type='application/json',
                            status=response.status_code)
            #return Response(responce.content,  status=200)
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

game_list = []

class AIplayer(object):

    def generate_enemy_field(self):
        self.enemy_field = dict()
        for i in range(0, 10, 1):
            self.enemy_field[i] = dict()
            for i1 in range(0, 10, 1):
                self.enemy_field[i][i1] = ships_states['INITIALIZED']


    def join_game(self, game_name):
        self.my_game = game_name
        self.generate_own_battlefield()
        self.generate_enemy_field()
        return

    def generate_own_battlefield(self):
        self.ai_battlefield = [[{u'y': 0, u'x': 8}, {u'y': 1, u'x': 8}, {u'y': 2, u'x': 8}, {u'y': 3, u'x': 8}], [{u'y': 3, u'x': 3}, {u'y': 3, u'x': 4}, {u'y': 3, u'x': 5}], [{u'y': 6, u'x': 7}, {u'y': 7, u'x': 7}, {u'y': 8, u'x': 7}], [{u'y': 4, u'x': 1}, {u'y': 5, u'x': 1}], [{u'y': 0, u'x': 4}, {u'y': 0, u'x': 5}], [{u'y': 8, u'x': 3}, {u'y': 9, u'x': 3}], [{u'y': 5, u'x': 3}], [{u'y': 8, u'x': 1}], [{u'y': 8, u'x': 9}], [{u'y': 8, u'x': 5}]]
        return

    def make_shoot(self):
        while True:
            x = random.randint(0,9)
            y = random.randint(0,9)
            if (self.enemy_field[x][y]==ships_states['INITIALIZED']): # make shoot
                self.enemy_field[x][y] = ships_states['MISSED']
                return x,y
        return
                # self.first_player_response_id += 1
                # self.first_player_to_message_queue.append({"name":"move-on","id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":result}}})
                # self.second_player_response_id += 1
                # self.second_player_to_message_queue.append({"name":"move-off","id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":result}}})





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
        self.ai_player.join_game(self.game_name)
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
        # self.first_player_response_received_id = self.first_player_response_id
        return events_to_send

    def ai_player_shoot(self):
        x,y = self.ai_player.make_shoot()
        result = ships_states['MISSED']
        if result in [ships_states['WOUNDED'], ships_states['KILLED']]:
            self.game_state = "second-player-move"
            first_user_action = "move-off"
            second_user_action = "move-on"
        else:
            self.game_state = "first-player-move"
            first_user_action = "move-on"
            second_user_action = "move-off"
        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":first_user_action,"id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":result}}})
        self.second_player_response_id += 1
        self.second_player_to_message_queue.append({"name":second_user_action,"id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":result}}})
        # if result in [ships_states['WOUNDED'], ships_states['KILLED']]:
        #     self.game_state = "first-player-move"
        # else:
        #     self.game_state = "second-player-move"
        return



    def first_player_shoot(self, data):
        shoot = data['shoot']
        x = shoot['x']
        y = shoot['y']
        result = ships_states['MISSED']
        for ship in self.battlefield_second_player:
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

                    # self.first_player_response_id += 1
                    # self.first_player_to_message_queue.append({"name":"move-on","id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":ships_states['WOUNDED']}}})
                    # self.second_player_response_id += 1
                    # self.second_player_to_message_queue.append({"name":"move-off","id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":ships_states['WOUNDED']}}})
                    # self.game_state = "first-player-move"
                    # return
        if result in [ships_states['WOUNDED'], ships_states['KILLED']]:
            self.game_state = "first-player-move"
            first_user_action = "move-on"
            second_user_action = "move-off"
        else:
            self.game_state = "second-player-move"
            first_user_action = "move-off"
            second_user_action = "move-on"
        self.first_player_response_id += 1
        self.first_player_to_message_queue.append({"name":first_user_action,"id":self.first_player_response_id,"start":int(time.time()), "payload":{"register-self-shoot":{"y":y,"x":x,"state":result}}})
        self.second_player_response_id += 1
        self.second_player_to_message_queue.append({"name":second_user_action,"id":self.second_player_response_id,"start":int(time.time()), "payload":{"register-rival-shoot":{"y":y,"x":x,"state":result}}})
        # if result in [ships_states['WOUNDED'], ships_states['KILLED']]:
        #     self.game_state = "first-player-move"
        # else:
        #     self.game_state = "second-player-move"
        return

    def make_player_shoot(self,user_num,x,y):
        # shoot = data['shoot']
        # x = shoot['x']
        # y = shoot['y']
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


def find_game_by_name(user_id):
    for game in game_list:
        if game.first_player_id == user_id or game.second_player_id == user_id:
            return game
    return None

def create_game(user_id, json_data):
    # game = find_game_by_name(user_id)
    game = Game()
    game.add_first_player(json_data)
    game_list.append(game)
    user_id = game.first_player_id
    # if game is None:
    #     game = Game()
    #     game_list.append(game)
    #     game.start_game(json_data)
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
        # game.ai_player_shoot()
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
    # game.first_player_shoot(data=json_data)
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
                # print ("=========================")
                # print ("UserId="+user_id)
                # print ("Request:")
                zz = request.body
                json_data = json.loads(request.body)
                # print(json_data)
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

