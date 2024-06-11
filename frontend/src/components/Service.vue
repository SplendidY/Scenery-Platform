<template>
  <!-- 整个div -->
  <div style="height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <!-- 左上角显隐栏 -->
    <div style="position: absolute; top: 20px; left: 20px; z-index: 999;">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">expand</el-radio-button>
        <el-radio-button :value="true">collapse</el-radio-button>
      </el-radio-group>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      :collapse="isCollapse"
      style="position: absolute; top: 60px; left: 20px; z-index: 998;"
      @select="handleSelect1"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Edit /></el-icon>
          <span>Navigator One</span>
        </template>
      </el-sub-menu>
      <el-menu-item index="2" @click="tfdrawer4">
        <el-icon><Opportunity /></el-icon>
        <template #title>个性化推荐</template>
      </el-menu-item>
      <el-menu-item index="3" @click="tfdrawer2">
        <el-icon><ChatDotSquare /></el-icon>
        <template #title>景点信息</template>
      </el-menu-item>
      <el-menu-item index="4" @click="toggleDrawPolygon">
        <el-icon><EditPen /></el-icon>
        <template #title>旅游指数综合打分</template>
      </el-menu-item>
      <el-menu-item index="5" @click="tfdrawer3">
        <el-icon><Star /></el-icon>
        <template #title>我的收藏</template>
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
            <template #title>&nbsp;&nbsp;&nbsp;&nbsp;Layer Select&nbsp;&nbsp;&nbsp;&nbsp;</template>
            <el-sub-menu index="1-1">
              <template #title>OpenStreetMap</template>
              <el-menu-item index="1-1-1" @click="SwitchLayer('1-1-1')">tile.openstreetmap(default)</el-menu-item>
              <el-menu-item index="1-1-2" @click="SwitchLayer('1-1-2')">dark_all</el-menu-item>
              <el-menu-item index="1-1-3" @click="SwitchLayer('1-1-3')">light_all</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="1-2">Gaode Map</el-menu-item>
            <el-menu-item index="1-3">Tian Map</el-menu-item>
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
            <el-input v-model="scenery" :prefix-icon="Search" @input="filterLocations" @focus="isFocused = true" @blur="handleBlur" placeholder='输入目的地景点名称'></el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="getjw">导航</el-button>
          </el-menu-item>
        </el-menu>
        <!-- 用户头像 -->
        <div style="position: absolute;right: 3%;bottom: 1.5%;">
            <el-button class="avatar-button" @click="drawer = true">
              <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            </el-button>
            <el-button type="primary" @click="dialogVisible = !dialogVisible" style="height: 30px; font-size: 16px;">log out</el-button>
        </div>
      </el-footer>
    </el-container>
    <!-- 退出按钮 -->
    <el-dialog v-model="dialogVisible" title="Sure ?" width="500">
      <span>Sure to log out ?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">No</el-button>
          <router-link to="/login">
            <el-button type="primary" style="margin-left: 10px;" @click="dialogVisible = false;deletejw()">
              Sure
            </el-button>
          </router-link>
        </div>
      </template>
    <!-- 信息栏 -->
    </el-dialog>
    <el-descriptions
      v-show="userinfo"
      title="Vertical list with border"
      direction="vertical"
      :column="4"
      :size="size"
      style="position: absolute;right:1%;bottom: 20%;width: 25%;background-color: aliceblue;z-index: 10; border: 1px solid #ebeef5; border-radius: 4px; padding: 20px;"
      border
    >
      <el-descriptions-item label="Username">{{ store.state.username }}</el-descriptions-item>
      <el-descriptions-item label="Password">{{ store.state.password }}</el-descriptions-item>
      <el-descriptions-item label="Place" :span="2">Hangzhou</el-descriptions-item>
    </el-descriptions>
    <!-- 侧边栏 -->
    <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="11%">
      <div style="display: flex;align-items: center;">
        <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <div> &nbsp;&nbsp;&nbsp; {{ username }} </div>
      </div>
    </el-drawer>  
    <el-drawer 
    v-model="drawer2" 
    title="I am the title" 
    style="overflow: auto;"
    :before-close="handleClose"
    >
      <template #header>
        <el-input v-model="scenery" 
          placeholder="请输入感兴趣的地点"  
          :prefix-icon="Search">
        </el-input>
        <el-button style="margin-left: 10px;" type="primary" >Check</el-button>
      </template>
      <template #default>
        <div class="spot-photo">
          <div style="text-align: center;">
            <img src="../assets/2.jpg" style="max-width: 100%;" alt="Scenic Spot Image" />
          </div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
              <h3>Scenic Spot Name</h3>
              <p>{{ name }}</p>
          </div>
          <el-button class="star" type="warning" :icon="Star" circle @click="addFavorite(name)" style="align-self: center"></el-button>          
        </div>
      <div>
        <h4>Introduction</h4>
        <p>
        <!-- Description of the scenic spot -->
         {{ introduction }}
        </p>
      </div>
      <div>
        <h4>Location</h4>
        <p>{{ city }}</p>
      </div>
      <div>
        <h4>Opening Hours</h4>
        <p>
        Monday to Sunday: 9:00 AM - 6:00 PM
        </p>
      </div>
      <div>
        <h4>
          Average Rate
        </h4>
        <el-rate
        v-model="averagescore"
        :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
        show-text
        disabled
        score-template="{value} points"
        />
        <h4>
          Remarks
        </h4>
        <p>{{ remarks1 }}</p>
        <p>{{ remarks2 }}</p>
        <p>{{ remarks3 }}</p>
      </div> 
      <h4>
        Your Rate
      </h4>
      <div>
        <el-rate
        v-model="userscore"
        :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
        show-text
        />
        <h4>
          Your Remark
        </h4>
          <el-input
            v-model="userrmk"
            maxlength="30"
            style="width: 240px; margin: 20px 0"
            placeholder="Please input"
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
          <p style="margin: 0;">{{ favorite }}</p>
          <el-button type="primary" :icon="Close" @click="removeFavorite(index)" style="display: flex; align-items: center; justify-content: center;">取消收藏</el-button>
        </div>
      </template>
      <template v-else>
        <div class="empty-favorites">暂无收藏地点</div>
      </template>
    </el-scrollbar>
  </el-drawer>
    <el-drawer 
    v-model="drawer4" 
    title="个性化推荐" 
    style="overflow: auto;"
    :before-close="handleClose"
    >
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
import { Edit,ChatDotSquare,EditPen,Loading,Search,Upload,Star,Opportunity,CloseBold,Close } from '@element-plus/icons-vue';

const store = useStore();
const drawer = ref(false);
const drawer2 = ref(false);
const drawer3 = ref(false);
const drawer4 = ref(false);
const username = computed(() => store.state.username);
const password = computed(() => store.state.password);
const isCollapse = ref(false);
const scenery = ref();
const dialogVisible = ref(false)
const userinfo = ref(false);
const locations = ref([]);
const jsonUrl = new URL('../resources/data2.json', import.meta.url).href;
const filteredLocations = ref([]);
const isFocused = ref(false);
const userscore = ref(0);
const averagescore = ref(0);
const userrmk = ref('');
const name = ref();
const introduction = ref();
// const county = ref();
const city = ref();
const remarks1 = ref([])
const remarks2 = ref([])
const remarks3 = ref([])
const favor = ref([]); 

const tfdrawer2 = () => {
  if( name.value != null) {
    drawer2.value = true;
  }
}
const tfdrawer3 = () => {
  if(name != null) {
    drawer3.value = true;
  }
}
const tfdrawer4 = () => {
  if(name != null) {
    drawer4.value = true;
  }
}

const fetchFavorites = async () => {
  try {
    const response = await axios.get('http://localhost:5001/get_favorites', {
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
    const response = await axios.post('http://localhost:5001/add_favorite', {
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
    const response = await axios.post('http://localhost:5001/remove_favorite', {
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
  const item = locations.value.find(d => d.NAME === scenery.value);
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
    // county.value = item.COUNTY || '暂无信息';
  } 
  else {
    console.error('Name not found');
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
      const response = await axios.post('http://localhost:5001/update-location', locations.value, {
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
      console.error('景点未找到');
    }
  } catch (error) {
    console.error('更新评论时出错:', error);
  }
};

const deletejw =() => {
  store.commit('clearUser');
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
  width: 200px;
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
</style>