from math import floor

from django.db import models

# Create your models here.

class Solve(models.Model):
    time = models.IntegerField()
    scramble = models.CharField(max_length=40)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        colon = ""
        centiseconds = str(self.time % 100)
        seconds = str(floor((self.time / 100) % 60))
        minutes = str(floor((self.time / 6000) % 60))
        if int(centiseconds) < 10:
            centiseconds = "0" + centiseconds
        if int(minutes) > 0:
            colon = ":"
            if int(seconds) < 10:
                seconds = "0" + seconds
            return minutes + colon + seconds + "." + centiseconds
        return seconds + "." + centiseconds

class Database(models.Model):
    single = models.IntegerField()
    single_proper = models.CharField(max_length=20, null=True)
    ao5 = models.IntegerField(null=True)
    ao5_proper = models.CharField(max_length=20, null=True)
    ao12 = models.IntegerField(null=True)
    ao12_proper = models.CharField(max_length=20, null=True)

    def __str__(self):
        return f"{self.single_proper}|{self.ao5_proper}|{self.ao12_proper}"