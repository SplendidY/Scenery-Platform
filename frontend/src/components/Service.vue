<template>
  <!-- 整个div -->
  <div style="height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <div id="5A" ref="chartContainer" style="width: 600px; height: 400px; position: absolute; z-index: 1000; background-color: #ebeef5; display: none; left: 64%; top:50%"></div>
    <!-- 左上角显隐栏 -->
    <div style="position: absolute; top: 20px; left: 20px; z-index: 999;">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">显示</el-radio-button>
        <el-radio-button :value="true">隐藏</el-radio-button>
      </el-radio-group>
    </div>
    <el-menu
      class="el-menu-vertical"
      :collapse="isCollapse"
      style="position: absolute; top: 60px; left: 20px; z-index: 998;"
      @select="handleSelect1"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Edit /></el-icon>
          <span>图表化</span>
        </template>
        <el-menu-item index="1-1" @click="tfecharts(1)">浙江省各地级市3A级以上景区数量总表</el-menu-item>
        <el-menu-item index="1-2" @click="tfecharts(2)">浙江省各地级市3A级以上景区数量分表</el-menu-item>
        <el-menu-item index="1-3"><el-input :prefix-icon="Search" style="position: relative; width: 180px;" placeholder="输入城市名称" v-model="cityname" clearable></el-input>
        <el-button style="position: relative; left: 10px; width: 80px;" type="primary" @click="closeecharts"><el-icon><Close /></el-icon>关闭</el-button>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="2" @click="tfdrawer4">
        <el-icon><Opportunity /></el-icon>
        <template #title>个性化推荐</template>
      </el-menu-item>
      <el-menu-item index="3" @click="tfdrawer2">
        <el-icon><ChatDotSquare /></el-icon>
        <template #title>景区信息</template>
      </el-menu-item>
      <el-menu-item index="4" @click="tfdrawer3">
        <el-icon><Star /></el-icon>
        <template #title>我的收藏</template>
      </el-menu-item>
      <el-menu-item index="5" @click="loadmap">
          <el-icon><CameraFilled /></el-icon>
          <template #title>路线存储</template>
        </el-menu-item>
    </el-menu>
    <!-- 整体 -->
    <el-container style="flex: 1; display: flex; flex-direction: column;">
      <!-- Ceisum球 -->
      <el-main style="flex: 1; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
          <Cesium />
        </div>
      </el-main>
      <!-- 底部栏 -->
      <el-footer style="padding: 0; width: 100%;">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#fff"
          @select="SwitchLayer"
          style="width: 100%; margin: 0; border: none;height: 60px;"
        >
          <div class="flex-grow" />
          <el-sub-menu index="1">
            <template #title>&nbsp;&nbsp;&nbsp;&nbsp;<el-icon><Switch /></el-icon>图层选择&nbsp;&nbsp;&nbsp;&nbsp;</template>
            <el-sub-menu index="1-1">
              <template #title>OpenStreetMap</template>
              <el-menu-item index="1-1-1" @click="SwitchLayer('1-1-1')">默认openstreetmap底图</el-menu-item>
              <el-menu-item index="1-1-2" @click="SwitchLayer('1-1-2')">黑夜</el-menu-item>
              <el-menu-item index="1-1-3" @click="SwitchLayer('1-1-3')">白天</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="1-2">高德地图</el-menu-item>
            <el-menu-item index="1-3">天地图</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- 滚动栏 -->
            <el-scrollbar v-if="filteredLocations.length && isFocused" style="height: 300px; width:300px; position: absolute; bottom: 50px; background-color: #545c64; color: white;">
              <ul>
                <li v-for="location in filteredLocations" :key="location.NAME" @click="selectLocation(location)" style="padding: 8px; cursor: pointer;">
                  {{ location.NAME }}
                </li>
              </ul>
            </el-scrollbar>
            <el-input v-model="scenery" :prefix-icon="Search" @input="filterLocations" @focus="isFocused = true" @blur="handleBlur" placeholder='输入目的地景区名称'></el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="getjw"><el-icon><Position /></el-icon>导航</el-button>
          </el-menu-item>
        </el-menu>
        <!-- 用户头像 -->
        <div style="position: absolute;right: 3%;bottom: 1.5%;">
            <el-button class="avatar-button" @click="drawer = true">
              <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            </el-button>
            <el-button type="primary" @click="dialogVisible = !dialogVisible" style="height: 30px; font-size: 16px;"><el-icon style="position: relative; right: 10px;"><SwitchButton /></el-icon>退出</el-button>
        </div>
      </el-footer>
    </el-container>
    <!-- 退出按钮 -->
    <el-dialog v-model="dialogVisible" title="Sure ?" width="500">
      <span>确认退出 ?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">不,我再想想</el-button>
          <router-link to="/login">
            <el-button type="primary" style="margin-left: 10px;" @click="dialogVisible = false;deletejw()">
              确认
            </el-button>
          </router-link>
        </div>
      </template>
    </el-dialog>
    <!-- 侧边栏 -->
    <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="11%">
      <div style="display: flex;align-items: center;">
        <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <div> &nbsp;&nbsp;&nbsp; {{ username }} </div>
      </div>
      <div style="display: flex;align-items: center;padding: 15px;">
        <!--修改密码-->
        <el-button type="primary" plain @click="dialogVisible1=true">修改密码</el-button>
        <el-dialog title="修改密码" v-model="dialogVisible1" width="30%" :center="true">
          <el-form :model="form" label-width="auto" style="max-width: 500px">
            <el-form-item label="旧密码">
              <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="form.newPassword" placeholder="请输入新密码" type="password" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="form.confirmNewPassword" placeholder="请确认密码" type="password" />
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </el-drawer>  
    <el-drawer 
    v-model="drawer2" 
    style="overflow: auto;"
    :before-close="handleClose"
    >
      <template #header>
        <el-input v-model="scenery" 
          placeholder="请输入感兴趣的地点"  
          :prefix-icon="Search">
        </el-input>
        <el-button style="margin-left: 10px;" type="primary" ><el-icon><Position /></el-icon>导航</el-button>
      </template>
      <template #default>
        <div class="spot-photo">
          <div style="text-align: center;">
            <img src="../assets/西湖.jpg" style="max-width: 100%;" alt="Scenic Spot Image" />
          </div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
              <h3>景区名称</h3>
              <p>{{ name }}</p>
          </div>
          <el-button class="star" type="warning" :icon="Star" circle @click="addFavorite(name)" style="align-self: center"></el-button>          
        </div>
      <div>
        <h4>景区介绍</h4>
        <p>
        <!-- Description of the scenic spot -->
         {{ introduction }}
        </p>
      </div>
      <div>
        <h4>景区位置</h4>
        <p>{{ city }}</p>
      </div>
      <div>
        <h4>景区开放时间</h4>
        <p>
        周一至周日: 9:00 AM - 6:00 PM
        </p>
      </div>
      <div>
        <h4>
          平均得分
        </h4>
        <el-rate
        v-model="averagescore"
        :texts="['糟糕', '令人失望', '一般', '不错', '完美']"
        show-text
        disabled
        score-template="{value} points"
        />
        <h4>
          评论区
        </h4>
        <p>{{ remarks1 }}</p>
        <p>{{ remarks2 }}</p>
        <p>{{ remarks3 }}</p>
      </div> 
      <h4>
        你的评分
      </h4>
      <div>
        <el-rate
        v-model="userscore"
        :texts="['糟糕', '令人失望', '一般', '不错', '完美']"
        show-text
        />
        <h4>
          你的评论
        </h4>
          <el-input
            v-model="userrmk"
            maxlength="30"
            style="width: 240px; margin: 20px 0"
            placeholder="请输入评论"
            show-word-limit
            type="text"
          />
          <el-button  type="primary" style="position: relative; left:10px;">
            Upload<el-icon class="el-icon--right" @click="submitComment"><Upload/></el-icon>
          </el-button>
      </div>    
      </template>
    </el-drawer>
     <!--collection-->
  <el-drawer 
    v-model="drawer3" 
    title="我的收藏" 
    style="overflow: auto;"
    :before-close="handleClose"
    @open="fetchFavorites"
  >
    <el-scrollbar height="400px">
      <template v-if="favor.length > 0">
        <div v-for="(favorite, index) in favor" :key="index" class="scrollbar-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ebeef5;">
          <p style="margin: 0; cursor: pointer;" @click="routetospot(favorite)">{{ favorite }}</p>
          <el-button type="primary" :icon="Close" @click="removeFavorite(index)" style="display: flex; align-items: center; justify-content: center;">取消收藏</el-button>
        </div>
      </template>
      <template v-else>
        <div class="empty-favorites">暂无收藏地点</div>
      </template>
    </el-scrollbar>
  </el-drawer>
  <el-drawer
    v-model="drawer5"
    title="个性化推荐"
    :before-close="handleClose"
    width="300px">
    <template v-if="closestSpots.length > 0">
      <div v-for="(spot, index) in closestSpots" :key="index" class="drawer5-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ebeef5;">
        <p style="margin: 0; cursor: pointer;" @click="routetospot(spot)">{{ spot }}</p>
      </div>
    </template>
    <template v-else>
      <div class="empty-favorites">暂无推荐地点</div>
    </template>
  </el-drawer>
  </div>
</template>

<script setup>
import { ref,computed,onMounted } from 'vue'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locaFle/en.mjs'
import Cesium from './Cesium.vue'
import { SwitchLayer } from '../jses/ditu'
import { useStore } from 'vuex';
import { route } from '../jses/route';
import axios from 'axios';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas';
import { Edit,ChatDotSquare,EditPen,Search,Upload,Star,Opportunity,Close,Position,SwitchButton,Switch,CameraFilled } from '@element-plus/icons-vue';

const store = useStore();
const drawer = ref(false);
const drawer2 = ref(false);
const drawer3 = ref(false);
const drawer4 = ref(false);
const drawer5 = ref(false);
const username = computed(() => store.state.username);
const password = computed(() => store.state.password);
const isCollapse = ref(false);
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const userinfo = ref(false);
const locations = ref([]);
const jsonUrl = new URL('../resources/data2.json', import.meta.url).href;
const filteredLocations = ref([]);
const isFocused = ref(false);
const userscore = ref(0);
const averagescore = ref(0);
const userrmk = ref();
const name = ref();
const introduction = ref();
const city = ref();
const scenery = ref();
const remarks1 = ref([])
const remarks2 = ref([])
const remarks3 = ref([])
const favor = ref([]); 
const closestSpots = ref([]);
const chartContainer = ref(null);
const chartVisible = ref(false);
const cityname = ref()
const theroute = ref();

const cityData = {
  '杭州市': { '5A': 3, '4A': 20, '3A': 71 },
  '宁波市': { '5A': 1, '4A': 18, '3A': 59 },
  '温州市': { '5A': 1, '4A': 16, '3A': 55 },
  '台州市': { '5A': 2, '4A': 18, '3A': 70 },
  '丽水市': { '5A': 1, '4A': 10, '3A': 54 },
  '金华市': { '5A': 1, '4A': 21, '3A': 64 },
  '湖州市': { '5A': 1, '4A': 27, '3A': 61 },
  '嘉兴市': { '5A': 1, '4A': 9, '3A': 51 },
  '绍兴市': { '5A': 1, '4A': 14, '3A': 43 },
  '舟山市': { '5A': 1, '4A': 6, '3A': 17 },
  '衢州市': { '5A': 2, '4A': 14, '3A': 53 }
};
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmnewPassword: ''
});
const handleSubmit = async () => {
  if (form.value.newPassword !== form.value.confirmNewPassword) {
    ElMessage.error('新密码和确认密码不匹配，请重新输入');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5001/change_password', {
      user_name: store.state.username,
      old_password: form.value.oldPassword,
      new_password: form.value.newPassword,
      confirm_new_password: form.value.confirmNewPassword
    });

    const result = response.data;
    if (response.status === 200) {
      ElMessage.success('密码修改成功');
      dialogVisible1.value = false;
      form.value.oldPassword = '';
      form.value.newPassword = '';
      form.value.confirmNewPassword = '';
    } else {
      ElMessage.error(`错误: ${result.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('旧密码错误');
  }
};
const tfdrawer2 = () => {
  try{
    if( name.value != null) {
      drawer2.value = true;
    }
  }catch(error){
    ElMessage.error('请输入景区名称');
  }
}
const tfdrawer3 = () => {
  if(name != null) {
    drawer3.value = true;
  }
}
const tfdrawer4 = () => {
  try{
    const searchName = name.value.trim();
  if (searchName) {
    search_closest_spots(searchName).then(() => {
      drawer5.value = true;
    }).catch(error => {
      console.error('Error fetching closest spots:', error);
    });
  } else {
    console.warn("Name is null or empty.");
  }}
  catch(error){
    ElMessage.error('请输入景区名称')
  }
};

const fetchFavorites = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/user/get_favorites', {
      params: { username: username.value }
    });
    if (response.status === 200) {
      favor.value = response.data.favorites;
    } else {
;    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
};

const addFavorite = async (spotName) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/user/add_favorite', {
      username: store.state.username,
      spotname: spotName,
    });
    if (response.status === 200) {
      favor.value.push(spotName);
      console.log(favor.value); 
      console.log(response);
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

const removeFavorite = async (index) => {
  try {
    const spotName = favor.value[index];
    const response = await axios.post('http://127.0.0.1:5000/user/remove_favorite', {
      username: store.state.username,
      spotname: spotName,
    });
    if (response.status === 200) {
      favor.value.splice(index, 1);
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

//获取数据
const fetchData = async () => {
  try {
    const response = await axios.get(jsonUrl, { responseType: 'arraybuffer' });
    const decoder = new TextDecoder('gb2312');
    const text = decoder.decode(response.data); 
    locations.value = JSON.parse(text);
    // console.log(locations.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
//模糊查找
const filterLocations = () => {
  const query = scenery.value.toLowerCase();
  filteredLocations.value = locations.value.filter(location => location.NAME.toLowerCase().includes(query));
};
//选择栏目
const selectLocation = (location) => {
  scenery.value = location.NAME;
  filteredLocations.value = [];
  isFocused.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

//获取选中项目的经纬度以及各种信息
const getjw = () => {
  var panel = document.getElementById("service");
  const item = locations.value.find(d => d.NAME === scenery.value);
  if (item) {
    if (panel.style.display === "none") {
      panel.style.display = "block";
    }
    const coords = item.geometry.match(/POINT \((\d+\.\d+) (\d+\.\d+)\)/);
    if (coords) {
      const endj = parseFloat(coords[1]);
      const endw = parseFloat(coords[2]);
      store.commit('setendj', endj);
      store.commit('setendw', endw);
      route();
    } else {
      ElMessage.error('景区名称错误');
    }
    ElMessage.success('导航成功')
    introduction.value = item.INTRODUCTION || '暂无信息';
    name.value = item.NAME || '暂无信息';
    city.value = item.CITY || '暂无信息';
    averagescore.value = item.SCORE || '4'
    remarks1.value = item.COMMENT[0] || '暂无信息';
    remarks2.value = item.COMMENT[1] || '暂无信息';
    remarks3.value = item.COMMENT[2] || '暂无信息';
    // county.value = item.COUNTY || '暂无信息';
  } 
  else {
    ElMessage.error('景区名称错误');
  }
};

const submitComment = async () => {
  try {
    // 找到相应的位置
    const item = locations.value.find(d => d.NAME === scenery.value);
    if (item) {
      // 将新的评论插入到第一个位置
      item.COMMENT.unshift(userrmk.value);

      // 发送更新后的数据到后端
      const response = await axios.post('http://127.0.0.1:5000/recommend/update_location', locations.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message === 'Updated successfully') {
        console.log('评论已更新');
        remarks1.value = item.COMMENT[0] || '暂无信息';
        remarks2.value = item.COMMENT[1] || '暂无信息';
        remarks3.value = item.COMMENT[2] || '暂无信息';
      } else {
        console.error('更新评论时出错:', response.data.error);
      }
    } else {
      console.error('景区未找到');
    }
  } catch (error) {
    console.error('更新评论时出错:', error);
  }
};

const search_closest_spots = async (searchName) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/recommend/search_closest_spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spotName: searchName }) 
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    closestSpots.value = data.closest_spots;
    console.log('Closest spots:', closestSpots.value);  // 检查是否正确获取数据
  } catch (error) {
    console.error('Failed to fetch spots:', error);
  }
};

const deletejw = () => {
  store.commit('clearUser');
}

const tfecharts = (n) => {
  if ((n == 2)&&(cityname.value == undefined)) {
    ElMessage.error({message:`请输入想查询的城市名称`,showClose:true});
    console.log(cityname.value);
  }
  else if ((n == 1)&&(chartVisible.value == false)) {
    chartVisible.value = !chartVisible.value;
    if (chartVisible.value) {
      chartContainer.value.style.display = 'block'; 
      initialChart(n);
    } else {
      chartContainer.value.style.display = 'none';
    }
  }
  else if ((n == 1)&&(chartVisible.value == true)) {
    console.log(chartVisible.value)
    if (chartVisible.value) {
      chartContainer.value.style.display = 'block'; 
      initialChart(n);
    } else {
      chartContainer.value.style.display = 'none';
    }
  }
  else if ((n == 2)&&(chartVisible.value == true)) {
    if (chartVisible.value) {
      chartContainer.value.style.display = 'block'; 
      initialChart(n);
    } else {
      chartContainer.value.style.display = 'none';
    }
  }
  else if ((n == 2)&&(chartVisible.value == false)&&(cityname.value != undefined)) {
    chartVisible.value = !chartVisible.value;
    if (chartVisible.value) {
      chartContainer.value.style.display = 'block'; 
      initialChart(n);
    } else {
      chartContainer.value.style.display = 'none';
    }
  }
};

const initialChart = (n) => {
  if(cityname)
  if (chartContainer.value._myChart) {
    chartContainer.value._myChart.dispose();
  }

  chartContainer.value._myChart = echarts.init(chartContainer.value);
  ElMessage.success('图表绘制成功')
  if (n == 1) {
    const option = {
      title: {
        text: '浙江省各地级市3A+级景区数量总表',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        name: '景区数量',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 110, name: '杭州市' },
          { value: 78, name: '宁波市' },
          { value: 72, name: '温州市' },
          { value: 90, name: '台州市' },
          { value: 65, name: '丽水市' },
          { value: 86, name: '金华市' },
          { value: 89, name: '湖州市' },
          { value: 61, name: '嘉兴市' },
          { value: 58, name: '绍兴市' },
          { value: 24, name: '舟山市' },
          { value: 68, name: '衢州市' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    chartContainer.value._myChart.setOption(option);
  } else if (n == 2) {
    const city = cityname.value;
    if (cityData[city]) {
      const data = cityData[city];
      const option = {
        title: {
          text: `${city}3A+级景区数量表`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [{
          name: '景区数量',
          type: 'pie',
          radius: '50%',
          data: [
            { value: data['5A'], name: '5A' },
            { value: data['4A'], name: '4A' },
            { value: data['3A'], name: '3A' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      chartContainer.value._myChart.setOption(option);
    } else {
      ;
    }
  }
};

const closeecharts = () =>{
  chartContainer.value.style.display = 'none';
}

const routetospot = (spot) => {
  const item = locations.value.find(d => d.NAME === spot);
  if (item) {
    const coords = item.geometry.match(/POINT \((\d+\.\d+) (\d+\.\d+)\)/);
    if (coords) {
      const endj = parseFloat(coords[1]);
      const endw = parseFloat(coords[2]);
      store.commit('setendj', endj);
      store.commit('setendw', endw);
      route();
    } else {
      console.error('Invalid geometry format');
    }
    introduction.value = item.INTRODUCTION || '暂无信息';
    name.value = item.NAME || '暂无信息';
    city.value = item.CITY || '暂无信息';
    averagescore.value = item.SCORE || '4'
    remarks1.value = item.COMMENT[0] || '暂无信息';
    remarks2.value = item.COMMENT[1] || '暂无信息';
    remarks3.value = item.COMMENT[2] || '暂无信息';
    scenery.value = item.NAME;
  } 
  else {
    console.error('Name not found');
  }
  drawer3.value = false;
  drawer5.value = false;
}
const loadmap = () => {
  const cesiumContainer = document.getElementById('cesiumContainer');
  if (cesiumContainer) {
    html2canvas(cesiumContainer).then(canvas => {
      // 创建一个链接元素
      let link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'cesium_screenshot.png';
      // 触发下载
      link.click();
    });
  } else {
    console.error('未找到 cesiumContainer 元素');
  }
}
//直接挂载 节省查询时间
onMounted(() =>{
  fetchData();
  fetchFavorites();
});
// const language = ref('zh-cn')
// const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
// const toggle = () => {
//   language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
// // }
// const handleClose = (done) => {
//   ElMessageBox.confirm('Are you sure to close this dialog?')
//     .then(() => {
//       done();
//     })
//     .catch(() => {
//       // catch error
//     });
// };

</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 300px;
}
.flex-grow {
  flex-grow: 0;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.el-footer {
  margin: 0;
  padding: 0;
}

.avatar-button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
}

.drawer5-item {
  transition: color 0.3s, background-color 0.3s;
}

.drawer5-item:hover {
  background-color:skyblue; /* 更改为你想要的悬浮背景颜色 */
}

</style>