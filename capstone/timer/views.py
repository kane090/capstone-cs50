import json
from django.http.response import JsonResponse

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from math import floor
from .models import Solve, Database

# Create your views here.

def index(request):
    ao5 = Solve.objects.all().order_by('id').reverse()[:5]
    ao12 = Solve.objects.all().order_by('id').reverse()[:12]
    if len(ao5) == 5:
        average_5 = proper_time(average_times(request, 5))
        if len(ao12) == 12:
            average_12 = proper_time(average_times(request, 12))
        else:
            average_12 = None
    else:
        average_5 = None
        average_12 = None
    return render(request, "timer/index.html", {
        "times": Solve.objects.all().order_by('id').reverse(),
        "ao5": Solve.objects.all().order_by('id').reverse()[:5],
        "ao12": Solve.objects.all().order_by('id').reverse()[:12],
        "average_5": average_5,
        "average_12": average_12,
        "solve_number": len(Solve.objects.all()) + 1
    })

@csrf_exempt
def solve(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        solve_to_add = Solve(time=data["time"], scramble=data["scramble"])
        solve_to_add.save()
        database = Database.objects.first()
        if not database:
            database = Database(single=solve_to_add)
        if data["time"] < database.single.time:
            database.single = solve_to_add
        database.save()
        return HttpResponse(status=204)

@csrf_exempt
def clear(request):
    Solve.objects.all().delete()
    return HttpResponse(status=204)

@csrf_exempt
def averages(request, num):
    solves = Solve.objects.all().order_by('id').reverse()[:num]
    return JsonResponse([solve.serialize() for solve in solves], safe=False)

@csrf_exempt
def average_times(request, num):
    solves = Solve.objects.all().order_by('id').reverse()[:num]
    if len(solves) < num:
        return JsonResponse(None, safe=False)
    list_solves = [solve.time for solve in solves]
    list_solves.remove(max(list_solves))
    list_solves.remove(min(list_solves))
    average = floor(sum(list_solves) / len(list_solves))
    database = Database.objects.first()
    if num == 5:
        if database.ao5 and database.ao5_proper:
            if average < database.ao5:
                database.ao5 = average
                database.ao5_proper = proper_time(average)
                database.save()
        else:
            database.ao5 = average
            database.ao5_proper = proper_time(average)
            database.save()
    if num == 12:
        if database.ao12 and database.ao12_proper:
            if average < database.ao12:
                database.ao12 = average
                database.ao12_proper = proper_time(average)
                database.save()
        else:
            database.ao12 = average
            database.ao12_proper = proper_time(average)
            database.save()
    if request.method == "POST":
        return JsonResponse({'average': average})
    else:
        return average

def pbs(request):
    database = Database.objects.first()
    return render(request, "timer/pbs.html", {
        "database": database
    })

def proper_time(time):
    colon = ""
    centiseconds = str(time % 100)
    seconds = str(floor((time / 100) % 60))
    minutes = str(floor((time / 6000) % 60))
    if float(centiseconds) < 10:
        centiseconds = "0" + centiseconds
    if float(minutes) > 0:
        colon = ":"
        if float(seconds) < 10:
            seconds = "0" + seconds
        return minutes + colon + seconds + "." + centiseconds
    return seconds + "." + centiseconds