from django.urls import path, include
from rest_framework import routers

from account import views

logout_router = routers.DefaultRouter()
logout_router.register(r"", views.LogoutView, "logout")

urlpatterns = [
    path("logout/", include(logout_router.urls)),
]
