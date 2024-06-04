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
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <template #title>景点信息介绍</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>旅游指数综合打分</template>
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
          <el-menu-item index="1">&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;</el-menu-item>
          <el-sub-menu index="2">
            <template #title>&nbsp;&nbsp;&nbsp;&nbsp;Layer Select&nbsp;&nbsp;&nbsp;&nbsp;</template>
            <el-menu-item index="2-1">OpenStreetMap</el-menu-item>
            <el-menu-item index="2-2">Gaode Map (default)</el-menu-item>
            <el-menu-item index="2-3">Tian Map</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- 滚动栏 -->
            <el-scrollbar v-if="filteredLocations.length && isFocused" style="height: 300px; width:300px; position: absolute; bottom: 50px; background-color: #545c64; color: white;">
              <ul>
                <li v-for="location in filteredLocations" :key="location.NAME" @click="selectLocation(location)" style="padding: 8px; cursor: pointer;">
                  {{ location.NAME }}
                </li>
              </ul>
            </el-scrollbar>
            <el-input v-model="test" @input="filterLocations" @focus="isFocused = true" @blur="handleBlur"></el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="getjw">Check</el-button>
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
      <el-descriptions-item label="Password">{{ this.$store.state.password }}</el-descriptions-item>
      <el-descriptions-item label="Place" :span="2">Hangzhou</el-descriptions-item>
    </el-descriptions>
    <!-- 侧边栏 -->
    <el-drawer v-model="drawer" title="I am the title" :with-header="false" size="11%">
      <div style="display: flex;align-items: center;">
        <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <div> &nbsp;&nbsp;&nbsp; {{ username }} </div>
      </div>
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

const store = useStore();
const drawer = ref(false)
const username = computed(() => store.state.username);
const password = computed(() => store.state.password);
const isCollapse = ref(true)
const test = ref()
const dialogVisible = ref(false)
const userinfo = ref(false);
const locations = ref([]);
const jsonUrl = new URL('../resources/data.json', import.meta.url).href;
const filteredLocations = ref([]);
const isFocused = ref(false);
//获取数据
const fetchData = async () => {
  try {
    const response = await axios.get(jsonUrl, { responseType: 'arraybuffer' });
    const decoder = new TextDecoder('gb2312');
    const text = decoder.decode(response.data); 
    locations.value = JSON.parse(text);
    console.log(locations.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const filterLocations = () => {
  const query = test.value.toLowerCase();
  filteredLocations.value = locations.value.filter(location => location.NAME.toLowerCase().includes(query));
};

const selectLocation = (location) => {
  test.value = location.NAME;
  filteredLocations.value = [];
  isFocused.value = false;
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

//获取选中项目的经纬度
const getjw = () => {
  const item = locations.value.find(d => d.NAME === test.value);
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
  } else {
    console.error('Name not found');
  }
};

const deletejw =() => {
  store.commit('clearUser');
}
//直接挂载 节省查询时间
onMounted(fetchData);
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
</style>