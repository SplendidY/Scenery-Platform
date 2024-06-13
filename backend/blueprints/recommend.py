from flask import Blueprint
from flask import request, jsonify
from flask_cors import CORS
import os
import json
import heapq

recommend = Blueprint('recommend', __name__)

json_file_path = '../frontend/src/resources/data2.json'

# 景点推荐功能
# 函数：计算曼哈顿距离
def manhattan_distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)

# 函数：找到与制定景点曼哈顿距离最小的三个景点
def find_closest_spots(name, json_file_path):
    # 使用 GB2312 编码打开 JSON 文件
    with open(json_file_path, 'r', encoding='gb2312') as file:
        data = json.load(file)  # 加载JSON数据

    # 寻找符合搜索名称的景点
    target_spot = None
    for spot in data:
        if spot['NAME'] == name:
            target_spot = spot
            break

    if not target_spot:
        return None, "指定的景点名称不存在"

    target_lon = target_spot['LON']
    target_lat = target_spot['LAT']

    distances = []
    for spot in data:
        if spot['NAME'] != name:
            lon = spot['LON']
            lat = spot['LAT']
            distance = manhattan_distance(target_lon, target_lat, lon, lat)
            distances.append((distance, spot['NAME']))

    # 使用最大堆来存储最近的三个景点
    max_heap = []
    for spot in data:
        if spot['NAME'] != name:
            lon = spot['LON']
            lat = spot['LAT']
            distance = manhattan_distance(target_lon, target_lat, lon, lat)
            # 维护一个大小为3的最大堆
            if len(max_heap) < 3:
                heapq.heappush(max_heap, (-distance, spot['NAME']))  # 用负距离来构造最大堆
            else:
                heapq.heappushpop(max_heap, (-distance, spot['NAME']))

    # 从最大堆中提取最近的三个景点
    closest_spots = sorted((-heap[0], heap[1]) for heap in max_heap)

    return [spot[1] for spot in closest_spots], None

@recommend.route('/search_closest_spots', methods=['POST'])
def search_closest_spots():
    data = request.get_json()
    spot_name = data.get('spotName') 

    if not spot_name:
        return jsonify({'error': 'No spot name provided'}), 400

    closest_names, error = find_closest_spots(spot_name, json_file_path)
    if error:
        return jsonify({'error': error}), 404
    else:
        return jsonify({'closest_spots': closest_names}), 200
    
@recommend.route('/update_location', methods=['POST'])
def update_location():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        import os
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True)

        with open(json_file_path, 'w', encoding='gb2312') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)

        return jsonify({'message': 'Updated successfully'})
    except Exception as e:
        print(f'Error updating location: {str(e)}')
        return jsonify({'error': str(e)}), 500