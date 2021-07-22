from django.db import models

# Create your models here.

class Solve(models.Model):
    time = models.IntegerField()

    def __str__(self):
        return f"{self.time / 100:.2f}"
