# Generated by Django 3.2.5 on 2021-07-29 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timer', '0007_remove_database_mo3'),
    ]

    operations = [
        migrations.AddField(
            model_name='database',
            name='ao12_proper',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='database',
            name='ao5_proper',
            field=models.CharField(max_length=20, null=True),
        ),
    ]