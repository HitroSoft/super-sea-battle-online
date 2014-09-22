from django.conf.urls import patterns, include, url
from api.views import Retraslator,Imitator

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #url(r'^services/(?P<pk>\w+)$', Retraslator.as_view()),
    url(r'^services/(?P<pk>\w+)$', Imitator.as_view()),
)