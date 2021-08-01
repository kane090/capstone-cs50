from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("average_times/<int:num>", views.average_times, name="average_times"),
    path("solve", views.solve, name="solve"),
    path("save_pb/<str:type>", views.save_pb, name="save_pb"),
    path("clear", views.clear, name="clear"),
    path("pbs", views.pbs, name="pbs")
]