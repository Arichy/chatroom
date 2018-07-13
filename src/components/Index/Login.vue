<template>
    <el-form ref="form" :model="loginForm">
        <el-form-item label="用户名" label-width="20%">
            <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="20%">
            <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="text-center">
            <el-button type="primary" @click="handleLogin">立即登陆</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  data() {
    return {
      loginForm: {
        username: "nm",
        password: "nmsle"
      }
    };
  },
  methods: {
    async handleLogin() {
      alert("登陆");
      const res = await axios.post(`/api/login`, {
        usename: this.loginForm.username,
        password: this.loginForm.password
      });
      console.log(res);

      this.$router.push("showroom");
    }
  }
});
</script>
<template>
    <el-form ref="form" :model="loginForm">
        <el-form-item label="用户名" label-width="20%">
            <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="20%">
            <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="text-center">
            <el-button type="primary" @click="handleLogin">立即登陆</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      loginForm: {
        username: "nm",
        password: "nmsle"
      }
    };
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post(`/api/login`, {
        username: this.loginForm.username,
        password: this.loginForm.password
      });
      console.log('loginres',res);

      if(res.data.success){
        this.$router.push("showroom");
      } else {
        this.$alert('用户名或密码错误','登录失败');
      }
      
    }
  },

  mounted(){
    // 弹出"请登录"的提示
    if(this.$route.query.tip===true){
      this.$alert('请先登录','登录提示');
    }
  }
});
</script>
