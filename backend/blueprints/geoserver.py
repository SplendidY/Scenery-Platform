from flask import Blueprint
from flask import request, jsonify
import requests
from requests.auth import HTTPBasicAuth

geoserver = Blueprint('geoserver', __name__)

