from django.conf.urls import patterns, include, url
from . import views
from . import merry

urlpatterns = [
    url(r'^main$', views.main, name='main'),
    url(r'^merry/(.*)/$', views.merry, name='new'),
    url(r'^sex/merry/(.*)/$', merry.getlist, name='list'),
    url(r'^sex/q/(.*)/$', merry.getgender, name='gender'),
    url(r'^sex/check/(.*)/$', merry.qtarget, name='check'),
    url(r'^sex/target/(.*)/(.*)/$', merry.gettarget, name='target'),
]
