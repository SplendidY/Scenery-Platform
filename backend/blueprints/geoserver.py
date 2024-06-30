from flask import Blueprint
from flask import request, jsonify
import json
import requests
from requests.auth import HTTPBasicAuth
import geopandas as gpd
import pandas as pd
import json
from shapely.geometry import LineString
import os

GEOSERVER_URL = 'http://localhost:8080/geoserver'
GEOSERVER_USERNAME = 'admin'
GEOSERVER_PASSWORD = 'geoserver'

geoserver = Blueprint('geoserver', __name__)

def current_workspaces():
    url = f"{GEOSERVER_URL}/rest/workspaces"
    response = requests.get(url, auth=(GEOSERVER_USERNAME, GEOSERVER_PASSWORD))

    if response.status_code == 200:
        json_response = response.json()
        # 提取工作空间名称到列表
        workspace_list = [workspace['name'] for workspace in json_response['workspaces']['workspace']]
        return workspace_list
    else:
        return []

def create_workspace(workspace):
    url = f"{GEOSERVER_URL}/rest/workspaces"
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "workspace": {
            "name": workspace,
        }
    }
    response = requests.post(url, json=data, headers=headers, auth=(GEOSERVER_USERNAME, GEOSERVER_PASSWORD))
    return response

def create_datastore(workspace, datastore, directory):
    url = f"{GEOSERVER_URL}/rest/workspaces/{workspace}/datastores"
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "dataStore": {
            "name": datastore,
            "connectionParameters": {
                "entry": [
                    {"@key":"url","$":directory},
                    {"@key": "namespace","$": workspace}
                ]
            }
        }

    }                  
    response = requests.post(url, json=data, headers=headers, auth=(GEOSERVER_USERNAME, GEOSERVER_PASSWORD))
    return response

def create_shapefile(workspace,datastore,geojson_data):
    coords = geojson_data['features'][0]['geometry']['coordinates']
    line = LineString(coords)
    properties = geojson_data['features'][0]['properties']

    data = {
        'geometry': [line],
        'name': [properties['name']]
    }
    gdf = gpd.GeoDataFrame(data)
    output_dir = f"D:/Shapefiles/{workspace}/{datastore}"
    os.makedirs(output_dir, exist_ok=True)
    shp_file = os.path.join(output_dir, datastore + ".shp")
    gdf.to_file(shp_file, driver='ESRI Shapefile')
    
    return "file://D:/Shapefiles/"+workspace+"/"+datastore


@geoserver.route('/upload-geojson', methods=['POST'])
def upload_geojson():
    data = request.get_json()
    workspace = data.get('workspace')
    datastore = data.get('datastore')
    geojson_data = data.get('geojson_data')

    # 读取现有的工作区
    workspace_list = current_workspaces()
    # 创建工作区
    if workspace not in workspace_list:
        response = create_workspace(workspace)
        if response.status_code not in [200, 201]:
            return jsonify({"error": "failed to create workspace"}),response.status_code
        else:
            print("successfully created workspace!")

    # 创建数据存储
    try:
        directory = create_shapefile(workspace,datastore,geojson_data)
    except:
        print("failed to transfer to shapefile")
    else:
        print("successfully transfered to shapefile")
        response = create_datastore(workspace, datastore, directory)
        print(response.status_code)
        if response.status_code not in [200, 201]:
            return jsonify({"error": "failed to create datastore"}),response.status_code
        else:
            print("successfully created datastore!")
            return jsonify({"message":"success!"}),response.status_code
   


