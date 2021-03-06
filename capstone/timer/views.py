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
        average_5 = proper_time(average_times(request, 5)) # Calculating current ao5
        if len(ao12) == 12:
            average_12 = proper_time(average_times(request, 12)) # Calculating current ao12
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
        solve_to_add = Solve(time=data["time"], scramble=data["scramble"]) # Adding current solve
        solve_to_add.save()
        solve_to_info = Solve.objects.get(time=data["time"], scramble=data["scramble"])
        database = Database.objects.first()
        if not database:
            database = Database(single=data["time"], single_proper=proper_time(data["time"])) # Creating database if one does not exist
        if data["time"] < database.single: # Checking if current time solved is the fastest time
            database.single = data["time"]
            database.single_proper = proper_time(data["time"])
            database.save()
            return JsonResponse({'message': "Congratulations! You just got a new PB single :)", 'id': "single", 'solve_info': solve_to_info.id})
        database.save()
        return JsonResponse({'message': None, 'solve_info': solve_to_info.id})

@csrf_exempt
def clear(request):
    Solve.objects.all().delete()
    return HttpResponse(status=204)

@csrf_exempt
def average_times(request, num):
    solves = Solve.objects.all().order_by('id').reverse()[:num]
    if len(solves) < num: # If there aren't enough solves for an ao5 or ao12
        return JsonResponse(None, safe=False)
    list_solves = [solve.time for solve in solves]
    list_solves.remove(max(list_solves)) # Removing slowest solve
    list_solves.remove(min(list_solves)) # Removing fastest solve
    average = floor(sum(list_solves) / len(list_solves))
    database = Database.objects.first()
    if num == 5:
        if database.ao5 and database.ao5_proper: # Checking if ao5 value is in the database
            if average < database.ao5: # Chceking if the latest ao5 is a PB
                database.ao5 = average
                database.ao5_proper = proper_time(average)
                database.save()
                message = "Congratulations! You just got a new PB ao5 :)"
                return JsonResponse({'average': average, 'message': message, 'id': "ao5"})
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
                message = "Congratulations! You just got a new PB ao12 :)"
                return JsonResponse({'average': average, 'message': message, 'id': "ao12"})
        else:
            database.ao12 = average
            database.ao12_proper = proper_time(average)
            database.save()
    if request.method == "POST":
        return JsonResponse({'average': average})
    if request.method == "GET":
        return average

def pbs(request):
    database = Database.objects.first()
    return render(request, "timer/pbs.html", {
        "database": database
    })

@csrf_exempt
def save_pb(request, type):
    if request.method == "PUT":
        data = json.loads(request.body)
        time = floor(float(data["time"]) * 100) # Converting from seconds to centiseconds
        database = Database.objects.first()
        if type == "single":
            database.single = round(time)
            database.single_proper = proper_time(time)
        elif type == "ao5":
            database.ao5 = round(time)
            database.ao5_proper = proper_time(time)
        elif type == "ao12":
            database.ao12 = round(time)
            database.ao12_proper = proper_time(time)
        database.save()
        return JsonResponse({"proper_time": proper_time(time)})

@csrf_exempt
def solve_info(request, id):
    solve_to_info = Solve.objects.get(pk=int(id)) # Getting solve based on id
    return JsonResponse({'time': solve_to_info.time, 'scramble': solve_to_info.scramble, 'date': solve_to_info.date})

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