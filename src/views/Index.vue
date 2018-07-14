<template>
  <el-container>

    <el-header>
      <!-- 标题 -->
      <el-row type="flex" justify="center"><h2 class="title">{{title}}</h2></el-row>
    </el-header>
    
    <el-main>
      <!-- 注册、登陆切换按钮组 -->
      <el-row type="flex" justify="center">
        <el-button-group>
          <router-link to="./reg"><el-button type="" >注册</el-button></router-link>
          <router-link to="./login"><el-button type="" >登陆</el-button></router-link>
        </el-button-group>
      </el-row>
      
      <!-- 注册、登陆表单router-view -->
      <el-row type="flex" justify="center">
        <transition name="toggle" mode="out-in">
          <router-view class="form"></router-view>
        </transition>
      </el-row>
    
    </el-main>

    <!-- footer -->
    <Footer></Footer>

  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
// @ is an alias to /src
import Footer from '@/components/Footer.vue';

export default Vue.extend({
  name: "home",
  components:{
    Footer
  },
  data() {
    return {
      title: 'Multiplayer Online Chatroom'
    };
  },
  methods: {}
});
</script>

<style lang="scss" scoped>
.el-container {

  .el-header {
    .el-row {
      margin-top: 14px;

      h2.title{
        color: #555;
      }
    }
  }

  .el-main {
    min-height: 100%;
    padding-bottom: 100px;

    .el-row {
      .form {
        width: 400px;
        height: 200px;
        // padding-top: 100px;
        margin-top: 100px;
      }
    }
  }
}

// 过渡
.toggle-enter-active,.toggle-leave-active {
  transition: opacity 250ms;
}
.toggle-enter,.toggle-leave-to {
  opacity: 0;
}
</style>
