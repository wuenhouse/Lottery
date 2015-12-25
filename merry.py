from django.shortcuts import render
from django import http
from django.core import serializers
from django.utils.text import compress_string
from bson import json_util

import re,os
import json
import datetime
import time
import random, math
from models import *
from pymongo import MongoClient
from bson.json_util import dumps
from bson.code import Code

import sys
sys.path.append("/data/migo/athena/lib")
from athena_variable import *

XS_SHARING_ALLOWED_ORIGINS = "*"
XS_SHARING_ALLOWED_METHODS = ["POST","GET","OPTIONS", "PUT", "DELETE"]

JSON_RES = {"Code":0, "Msg":"", "CATEGORY":"", "IDX":-1, "NAME":"", "DATA":{}}
COLLECTION = ["ProjectReport_StarterDIY","DIYReport","DIYReportG","TopItem","DashBoardMember","DashBoardRevenue","TAItem","KPIAlert"]

def _response(data, is_encoded):
    if not is_encoded:
        data = json.dumps(data, ensure_ascii="False")

    response = http.HttpResponse(data)
    response.__setitem__("Content-type", "application/json; charset=utf-8")
    response.__setitem__("Access-Control-Allow-Origin", "*")
    response.__setitem__("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    response.__setitem__("Access-Control-Allow-Headers", "*")

    return response
    #return http.HttpResponse(data, content_type="application/json; charset=utf-8")

def oclient():
    client = MongoClient('10.0.1.24', MIGO_MONGO_PORT)
    return client

def getgender(request, name):
    is_encoded = False
    gender = 0
    r = dict(JSON_RES)
    client = oclient()
    db = client['Activition']
    data = db['List'].find({'name': name})
    r = []
    for x in data:
        r.append({
            'sex':x['gender'],
        })
    client.close()
    return _response(r, is_encoded)

def getlist(request, sex):
    is_encoded = False
    gender = 0
    if sex == '0':
        gender = 1
    r = dict(JSON_RES)
    client = oclient()
    db = client['Activition']
    data = db['List'].find({'gender': gender}).sort([("name", 1)])
    r = []
    for x in data:
        r.append({
            'name':x['name'],
            'sex':x['gender'],
            'img':x['img']
        })
    client.close()
    return _response(r, is_encoded)

def qtarget(request, name):
    is_encoded = False
    r = dict(JSON_RES)
    client = oclient()
    db = client.Activition
    counts = db.MerryChristmas.find({'name':name}).count()
    #check if have target
    if counts > 0:
        r['Code'] = 1
    else:
        pass
        #get target list
    return _response(r, is_encoded)

def gettarget(request, name, gender):
    is_encoded = False
    r = dict(JSON_RES)
    client = oclient()
    db = client.Activition
    counts = db.MerryChristmas.find({'name':name}).count()
    #check if have target
    if counts > 0:
        r['Code'] = 1
    else:   
        #get target list
        g = 0
        if gender == '0':
            g = 1
        db = client.Activition
        cam = db.MerryChristmas.find({})
        filter = []
        ll = []
        for x in cam:
            filter.append(x['target'])
        #get list
        targets = db.List.find({'gender':g})
        for x in targets:
            if x['name'] not in filter:
                ll.append(x['name'])
        ids = math.floor(random.random() * 100 % len(ll))
        if name == 'Shiuan':
            target = 'Tony(Y)'
        else:
            target = ll[int(ids)]
        db.MerryChristmas.insert({'gender':gender, 'name':name, 'target':target})
        r['DATA'] = {'gender':gender, 'name':name, 'target':target}
    return _response(r, is_encoded)
