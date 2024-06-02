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
            <el-input v-model="test" 
            placeholder="请输入感兴趣的地点" 
            :prefix-icon="Search">
            </el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="drawer2=true">Check</el-button>
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
            <el-button class="avatar-button" @click="drawer = true">
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
    </el-drawer>  
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
        <p>{{ test }}</p>
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
} from '@element-plus/icons-vue'
import { ref,computed} from 'vue'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
import Cesium from './Cesium.vue'
import { SwitchLayer } from '../jses/ditu'
import { useStore } from 'vuex';
const store = useStore();
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
