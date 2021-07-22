from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("solve", views.solve, name="solve"),
    path("clear", views.clear, name="clear")
]