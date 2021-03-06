# Generated by Django 3.2.5 on 2021-07-25 10:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('timer', '0003_alter_solve_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='solve',
            name='date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='solve',
            name='scramble',
            field=models.CharField(default='None', max_length=40),
            preserve_default=False,
        ),
    ]
