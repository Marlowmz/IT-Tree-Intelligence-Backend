import requests
import random
import string
import json
import time
drinks = ["Tea","Coffee","Matcha"]

for x in range(1225):
	payload = {'item':random.choice(drinks),'name':"A"+str(x)}
	headers = {u'content-type': u'application/json'}
	print(payload)
	r= requests.get("http://127.0.0.1:8081/drinks_ready",headers=headers)