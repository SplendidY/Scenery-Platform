<template>
    <div class="home">
        <el-container>
            <el-header>
                <h3 class="title">浙江省智慧文旅平台</h3>
                <el-dropdown >
                    <span class="el-dropdown-link">
                    admin
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                    </span>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="navigateToService">主页面</el-dropdown-item>
                        <el-dropdown-item>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-container>
              <el-aside width="200px">
                <el-menu
                  active-text-color="#ffd04b"
                  background-color="#545c64"
                  class="el-menu-vertical-demo"
                  default-active="2"
                  text-color="#fff"
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
                      <el-menu-item index="3" >
                      <el-icon><document /></el-icon>
                       <span>历史记录</span>
                      </el-menu-item>
                      <el-menu-item index="4">
                      <el-icon><setting /></el-icon>
                      <span>设置</span>
                      </el-menu-item>
                  </el-menu>
                </el-aside>
                <el-main>
                  <div v-if="state.selectedMenu === '1'" class="menu-content">
                    <h2>个人信息</h2>
                  </div>
                  <div v-if="state.selectedMenu === '2'" class="menu-content">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(card, index) in cards" :key="index">
                        <el-card style="max-width: 480px">
                          <template #header>
                            {{ card.title }}
                            <el-button class="star" type="warning" :icon="Star" circle @click="removeCard(index)"/>
                          </template>
                          <img :src="card.imgSrc" style="width: 100%" />
                        </el-card>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-if="state.selectedMenu === '3'" class="menu-content">
                      <h2>历史记录</h2>
                      <el-button class="btn1"type="primary" :icon="CloseBold" @click="clearHistory">清空历史记录</el-button>
                    <el-scrollbar height="100%">
                      <p v-for="(item, index) in searchHistory" :key="item" class="scrollbar-demo-item">{{ item }}</p>
                    </el-scrollbar>
                    <history/>
                  </div>
                  <div v-if="state.selectedMenu === '4'" class="menu-content">
                    <h2>设置</h2>
                  </div>
                </el-main>
            </el-container>
        </el-container>
    </div>



</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ref } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore();
const searchHistory = computed(() => store.state.searchHistory);

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  CloseBold,
  Star
} from '@element-plus/icons-vue'

const state = reactive({
  selectedMenu: '2'
})

const cards = reactive([
  { title: 'place1', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place2', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place3', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place4', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place5', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place6', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' },
  { title: 'place7', imgSrc: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' }
])

function removeCard(index) {
  cards.splice(index, 1)
}

function handleSelect(index) {
  state.selectedMenu = index;
}
const handleOpen = (key: string,keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
function navigateToService() {
  router.push('/service')
}

</script>

<style scoped>
.home{
    height: 100%;
    :deep(.el-header){
        display: flex;
        justify-content: space-between; /* Ensures space between title and dropdown */
        align-items: center;
        height: 70px;
        background-color: #4291e0;
        padding: 0 20px;
    }
    :deep(.el-aside){
        height: calc(100vh - 70px);
        background-color: #545c64;
        &::-webkit-scrollbar{
            width:0px;
        }
    }
}
.title{
    color:white;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-row {
  margin-bottom: 20px; 
}
.is-active {
  color: yellow;
}
.star,.btn1{
  float: right;
}
.menu-content{
  max-height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>