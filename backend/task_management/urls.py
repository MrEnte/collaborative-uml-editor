from django.urls import include, path
from rest_framework_nested import routers

from task_management import views

group_router = routers.SimpleRouter()
group_router.register(r"group", views.GroupViewSet, "group")

task_router = routers.NestedSimpleRouter(group_router, r"group", lookup="group")
task_router.register(r"task", views.TaskViewSet, basename="task")


urlpatterns = [
    path(r"", include(group_router.urls)),
    path("", include(task_router.urls)),
]
