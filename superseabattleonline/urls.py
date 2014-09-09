from django.conf.urls import patterns, include, url
from api.views import MyUserWithParam, MyUserWithoutParam

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^users/(?P<pk>\d+)/?$', MyUserWithParam.as_view()),
    url(r'^users/?$', MyUserWithoutParam.as_view()),
)