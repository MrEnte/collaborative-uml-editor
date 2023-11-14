from django.urls import path, include
from rest_framework import routers

from diagram import views

diagram_router = routers.DefaultRouter()
diagram_router.register(r"", views.DiagrammViewSet, "diagram")

urlpatterns = [
    path("diagram/", include(diagram_router.urls)),
]
