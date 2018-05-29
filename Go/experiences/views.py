from django.shortcuts import render
from django.http import HttpResponse

def home(request):
	return render(request, 'experiences/home.html')

#----------------------------------------------------------------------------

def base(request):
	""" base template

	@author: Aaron Bargotta
	@date: 5/29/18
	"""
	return render(request, 'experiences/base.html')