from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the experiences index.")

def base(request):
	return render(request, 'experiences/base.html')