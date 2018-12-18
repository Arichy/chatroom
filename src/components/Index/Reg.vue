<template>
    <el-form ref="form" :model="regForm">
        <div class="wrapper">
            <el-form-item label="用户名" label-width="70px">
                <el-input v-model="regForm.username" placeholder="不超过10位，数字、字母或汉字"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="70px">
                <el-input v-model="regForm.password" type="password" placeholder="不超过10位，数字或字母"></el-input>
            </el-form-item>

            <el-alert :title="msg" v-show="showMsg" :closable="false" :type="type" class="text-center"></el-alert>
        </div>
        

        <el-form-item class="text-center">
            <el-button type="primary" @click="reg">立即注册</el-button>
        </el-form-item>
        
    </el-form>
</template>

<script>
import Vue from "vue";
import { vuser_pass as validate } from "@/assets/util/validate.js";

export default Vue.extend({
  data() {
    return {
      regForm: {
        username: "",
        password: ""
      },
      msg: "",
      showMsg: false,
      type: "error"
    };
  },

  methods: {
    async reg() {
      const { username, password } = this.regForm;

      const { msg, type } = validate(username, password);
      this.showMsg = true;
      // 未通过检测
      if (type == "error") {
        this.msg = msg;
        this.type = type;

        return false;
      }

      try {
        const res = await this.$http.post("/api/reg", { username, password });

        if (res.data.success) {
          this.type = "info";
          this.msg = "注册成功，请去登陆";
        } else {
          this.type = "error";
          this.msg = `注册失败:${res.data.msg}`;
        }
      } catch (err) {
        this.type = "error";
        this.msg = "网络错误，请稍后再试";
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.el-form {
  .wrapper {
    height: 170px;
    .el-form-item {
      .el-input {
        min-width: 200px;
      }
    }
    .el-alert {
      width: 300px;
      margin-left: 20%;
      text-align: center;
    }
  }
}
</style>
