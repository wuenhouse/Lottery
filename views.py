from django.shortcuts import render
from django import http
from django.core import serializers
from django.utils.text import compress_string

import re
import json
import cgi

# Create your views here.
def merry(request, sex):
    #name = {'name': name1}
    return render(request, "MerryChristmas.html", {"gender":sex})
