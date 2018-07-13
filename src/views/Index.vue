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
    <el-footer>
      <div class="text-center">
        <span class="foot">Made By Arichy of Wuhan University in Republic of Sichuan</span><br>
        <span class="foot">Copyright &copy;2018</span>
      </div>
    </el-footer>

  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
// @ is an alias to /src

export default Vue.extend({
  name: "home",
  data() {
    return {
      title: "多人在线聊天室"
    };
  },
  methods: {}
});
</script>

<style lang="scss" scoped>
.el-container {

  .el-header {
    .el-row {
      // background-color: yellow;
      margin-top: 14px;

      h2.title{
        // background-color: red;
        color: #555;
      }
    }
  }

  .el-main {
    // background-color: green;
    min-height: 100%;
    padding-bottom: 100px;

    .el-row {
      .form {
        // background-color: red;
        width: 400px;
        height: 200px;
        padding: 100px;
      }
    }
  }

  .el-footer {
    // color: purple;
    // background-color: red;
    position: absolute;
    bottom: 0;
    width: 100%;
    // margin-top: -100px;

    .foot {
      color: #aaa;
      font-size: 15px;
    }
    .foot:last-child{
      font-size: 13px;
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
