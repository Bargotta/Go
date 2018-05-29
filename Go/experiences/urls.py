from django.conf.urls import url

from . import views, services

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^empty/', views.base, name='empty'),
]