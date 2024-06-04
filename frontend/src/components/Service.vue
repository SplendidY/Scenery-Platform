<template>
  <div style="height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
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
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
    <el-container style="flex: 1; display: flex; flex-direction: column;">
      <el-main style="flex: 1; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
          <Cesium />
        </div>
      </el-main>
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
         <el-menu-item index="1">&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;
            <el-input v-model="searchText" 
            placeholder="请输入感兴趣的地点" 
            :prefix-icon="Search">
            </el-input>
            <!-- Updated the click event to also add search history -->
            <el-button style="margin-left: 10px;" type="primary" @click="addSearchHistory, drawer2 = true">Check</el-button>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>&nbsp;&nbsp;&nbsp;&nbsp;Layer Select&nbsp;&nbsp;&nbsp;&nbsp;</template>
            <el-menu-item index="2-1">OpenStreetMap</el-menu-item>
            <el-menu-item index="2-2">Gaode Map (default)</el-menu-item>
            <el-menu-item index="2-3">Tian Map</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>layer4</template>
              <el-menu-item index="2-4-1">Layer4-1</el-menu-item>
              <el-menu-item index="2-4-2">Layer4-2</el-menu-item>
              <el-menu-item index="2-4-3">Layer4-3</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3">&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;</el-menu-item>
        </el-menu>
        <div style="position: absolute;right: 3%;bottom: 1.5%;">
            <el-button class="avatar-button" @click="drawer1 = true">
              <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            </el-button>
            <el-button type="primary" @click="dialogVisible = !dialogVisible" style="height: 30px; font-size: 16px;">log out</el-button>
        </div>
      </el-footer>
    </el-container>
    <el-dialog v-model="dialogVisible" title="Sure ?" width="500">
      <span>Sure to log out ?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">No</el-button>
          <router-link to="/login">
            <el-button type="primary" style="margin-left: 10px;" @click="dialogVisible = false">
              Sure
            </el-button>
          </router-link>
        </div>
        
      </template>
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
      <el-descriptions-item label="Username">{{ username }}</el-descriptions-item>
      <el-descriptions-item label="Password">{{ password }}</el-descriptions-item>
      <el-descriptions-item label="Place" :span="2">Hangzhou</el-descriptions-item>
      <!-- <el-descriptions-item label="Remarks">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item> -->
    </el-descriptions>
    <el-drawer v-model="drawer1" title="I am the title" :with-header="false" size="11%">
      <div style="display: flex;align-items: center;">
        <el-avatar :size="36" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
        <div> &nbsp;&nbsp;&nbsp; {{ username }} </div>
      </div>
      <div>
          <!--menu to user -->
          <el-menu
            box-shadow="none"
            active-text-color="#003366"
            background-color="#ffffff"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#708090"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
          >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>                           
              <span>个人信息</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><icon-menu /></el-icon>
              <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="3" @click="fetchSearchHistory">
              <el-icon><document /></el-icon>
                <span>历史记录</span>
              </el-menu-item>
              <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span>设置</span>
              </el-menu-item>
          </el-menu>
        </div>
  </el-drawer>
  <!-- Presentation history -->
  <el-card style="max-width: 300px" v-if="showLeftDiv" class="right-top-div">
    <template #header>历史搜索记录
      <el-button type="primary" :icon="CloseBold" class="close" @click="hidecard"/>
    </template>
    <el-scrollbar height="225px">
      <p v-for="(item, index) in searchHistory.value" :key="index" class="scrollbar-demo-item">{{ item }}</p>
    </el-scrollbar>
    <template #footer >
      <el-button type="primary" style="height: 30px">清空所有记录</el-button>
    </template>
  </el-card>
  
    <el-drawer 
    v-model="drawer2" 
    title="I am the title" 
    :with-header="false"
    style="overflow: auto;"
    >
      <div class="spot-photo">
        <div style="text-align: center;">
          <img src="../assets/2.jpg" style="max-width: 100%;" alt="Scenic Spot Image" />
        </div>
      </div>
      <div>
        <h3>Scenic Spot Name</h3>
        <p>{{ searchText }}</p>
      </div>
      <div>
        <p>
        <!-- Description of the scenic spot -->
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod convallis faucibus. Sed lacinia, nunc auctor dignissim tempor, lorem enim cursus ante, non suscipit velit orci sit amet metus.
        </p>
      </div>
      <div>
        <h4>Location</h4>
        <p>
        Hangzhou, China
        </p>
      </div>
      <div>
        <h4>Opening Hours</h4>
        <p>
        Monday to Sunday: 9:00 AM - 6:00 PM
        </p>
      </div>
      <div>
        <h4>Remarks</h4>
        <p>
        AG: good place, never come again.
        </p>
      </div> 
      <h4>
        Your rate
      </h4>
      <div>
        <el-rate
        v-model="value"
        :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
        show-text
        />
        <h4>
          Your Remarks
          <el-input
            v-model="userrmk"
            maxlength="30"
            style="width: 240px; margin: 20px 0"
            placeholder="Please input"
            show-word-limit
            type="text"
          />
          <el-button type="success" :icon="Check" circle />
        </h4>
      </div>    
    </el-drawer>
  </div>
</template>


<script lang="ts" setup>
import {
  Calendar,
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  CloseBold,
} from '@element-plus/icons-vue'
import { ref,computed} from 'vue'
import Cesium from './Cesium.vue'
import { SwitchLayer } from '../jses/ditu'
import { useStore } from 'vuex';
import axios from 'axios';  // Ensure axios is installed or import it in your project
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const searchText = ref('');  // Used for binding to the search input
const searchHistory = ref([]);  // To store and display the search history
const store = useStore();
const drawer = ref(false) // 是ysq添加的，因为前面的有一处@click=drawer有bug
const drawer1 = ref(false)
const drawer2 = ref(false)
const username = computed(() => store.state.username);
const password = computed(() => store.state.password);
const isCollapse = ref(true)
const test = ref()
const dialogVisible = ref(false)
const userinfo = ref(false);
const value = ref();
const userrmk = ref('')
const size = 'edium';
const router = useRouter();
const showLeftDiv = ref(false);

const hidecard = () => {
  showLeftDiv.value = false;
};


//Click Events in the right-hand menu
const handleSelect = (index) => {
  if (index === '2') {
    router.push('/user');
  } else if (index === '3') {
    showLeftDiv.value = true;
    drawer1.value=false;
  }
};

// method to handle menu item selection
const handleSelect1 = (key: string, keyPath: Array<string>) => {
  console.log('Selected menu item:', key, keyPath);
};

// method to add search history
const addSearchHistory = async () => {
  if (searchText.value.trim() !== '') {
    console.log("Sending POST request with:", store.state.userId, searchText.value);
    try {
      const response = await fetch('http://localhost:5001/add_search_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: store.state.userId,
          search_text: searchText.value
        })
      });
      store.commit('addSearchHistory', searchText.value);
      const data = await response.json();
      console.log("Response received:", data);
      if (response.ok) {
        console.log('Search history added successfully:', data.message);
        fetchSearchHistory();  // 重新获取搜索历史以更新列表
      } else {
        console.error('Failed to add search history:', data.message);
        ElMessage.error({message: `Failed to add search history: ${data.message}`, showClose: true});
      }
    } catch (error) {
      console.error('Error adding search history:', error);
      ElMessage.error({message: 'Network errors or server unresponsiveness', showClose: true});
    }
  }
};

// method to fetch search history
const fetchSearchHistory = async () => {
  try {
    const response = await fetch(`http://localhost:5001/api/search_history?user_id=${store.state.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      searchHistory.value = data;  // Assuming API returns an array of history
      console.log(searchHistory.value);
    } else {
      console.error('Failed to fetch search history:', data.message);
      ElMessage.error({message: `Failed to fetch search history: ${data.message}`, showClose: true});
    }
  } catch (error) {
    console.error('Error fetching search history:', error);
    ElMessage.error({message: 'Network errors or server unresponsiveness', showClose: true});
  }
};



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

.right-top-div {
  position: absolute;
  top: 150px;
  right: 10px;
  width: 300px; 
  height: 400px; 
  background-color: white; 
  border: 1px solid #ddd;
  border-radius: 5px;
}
.close{
  float: right;
  height: 20px;
  width: 10px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
