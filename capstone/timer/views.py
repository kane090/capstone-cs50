import json

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Solve

# Create your views here.

def index(request):
    return render(request, "timer/index.html", {
        "times": Solve.objects.all().order_by('id').reverse()
    })

@csrf_exempt
def solve(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        solve_to_add = Solve(time=data["time"])
        solve_to_add.save()
        return HttpResponse(status=204)

@csrf_exempt
def clear(request):
    Solve.objects.all().delete()
    return HttpResponse(status=204)