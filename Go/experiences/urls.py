from django.conf.urls import url

from . import views, services

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^empty/', views.base, name='empty'),
]