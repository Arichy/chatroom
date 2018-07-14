<template>
    <el-form ref="form" :model="loginForm">
        <el-form-item label="用户名" label-width="70px">
            <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px">
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
        username: "Arichy",
        password: "xixixi"
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await this.$http.post(`/api/login`, {
          username: this.loginForm.username,
          password: this.loginForm.password
        });
        console.log("loginres", res);

        // 登陆成功
        if (res.data.success) {
          // 存储用户名
          sessionStorage.setItem("username", this.loginForm.username);
          // 跳转至showroom页面
          this.$router.push("showroom");
        } else {
          this.$alert("用户名或密码错误", "登录失败");
        }
      } catch (err) {
        this.$alert("登录失败，请稍后再试", "登录失败");
      }
    }
  },

  mounted() {
    // 弹出"请登录"的提示
    if (this.$route.query.tip === true) {
      this.$alert("请先登录", "登录提示");
    }
  }
});
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    .el-input {
      min-width: 200px;
    }
  }
}
</style>
