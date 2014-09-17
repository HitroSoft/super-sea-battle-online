from django.conf.urls import patterns, include, url
from api.views import Retraslator

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^services/(?P<pk>\w+)$', Retraslator.as_view()),
)