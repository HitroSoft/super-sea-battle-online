__author__ = 'yrafalsky'
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
import time
import requests
import threading
lock = threading.Lock()

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