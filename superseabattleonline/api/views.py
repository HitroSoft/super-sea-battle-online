from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import json
from app_tables import MyTable

class Retraslator(APIView):
    renderer_classes = (JSONRenderer, )

    def post(self, request, *args, **kw):
        try:
            user_id = int(kw['pk'])
            user = MyTable().get_item(user_id)
            return Response(user, status=200)
        except Exception as e:
            print(e)
            return Response("user fetch failed. Exception : %s" % e.message, status=400)

class MyUserWithParam(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, *args, **kw):
        try:
            user_id = int(kw['pk'])
            user = MyTable().get_item(user_id)
            return Response(user, status=200)
        except Exception as e:
            print(e)
            return Response("user fetch failed. Exception : %s" % e.message, status=400)


class MyUserWithoutParam(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, *args, **kw):
        try:
            user = MyTable().get_items_list()
            return Response(user, status=200)
        except Exception as e:
            print(e)
            return Response("user fetch failed. Exception : %s" % e.message, status=400)

    def post(self, request, *args, **kw):
        try:
            try:
                body_as_object = json.loads(request.body)
            except Exception as e:
                raise Exception("Bad JSON body : " + str(e))

            insert_result = MyTable().put_item(body_as_object)
            if insert_result is None:
                raise Exception("User insert successful but cannot get company back")
            return Response(insert_result)
        except Exception as e:
            return Response(e, status=400)
