from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import json
import requests
from django.http import HttpResponse

class Retraslator(APIView):
    renderer_classes = (JSONRenderer, )

    def post(self, request, *args, **kw):
        try:
            user_id = kw['pk']
            print ("=========================")
            print ("UserId="+user_id)
            print ("Request:")
            body_as_object = json.loads(request.body)
            print(body_as_object)
            response = requests.post(url="http://en.battleship-game.org/services/"+ user_id, headers={'Accept': 'application/json'}, data=request.body)
            print ("Response:")
            print (response.content)
            return HttpResponse(content=response.content,
                            content_type='application/json',
                            status=response.status_code)
            #return Response(responce.content,  status=200)
        except Exception as e:
            print(e)
            return Response("user fetch failed. Exception : %s" % e.message, status=400)

