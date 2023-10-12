from django.urls import path
from diagram import views

urlpatterns = [
    path("diagram/", views.list_diagrams),
    path("diagram/<int:id>/", views.get_diagram),
]
