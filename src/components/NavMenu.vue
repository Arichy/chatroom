<template>
    <div class="my-nav">
        <!-- logo部分 -->
        <span>
            <h2 style="display:inline;margin-left:30px;">Chatroom</h2>
        </span>
        
        <!-- 用户名和退出按钮 -->
        <ul>
            <li>
                <span>Welcome, {{username}}</span>
            </li>
            <li>
                <el-button @click="logout" type="danger" size="mini">退出登陆</el-button>
            </li>
        </ul>
            
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoginVue from "@/components/Index/Login.vue";
export default Vue.extend({
  data() {
    return {
      activeIndex: "1",
      username: sessionStorage.getItem("username")
    };
  },
  //   props: ["username"],
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    async logout() {
      try {
        await this.$confirm("你确定要退出?", "退出确认", {
          confirmButtonClass: "el-button--danger"
        });

        try {
          const res = await this.$http.get("/api/logout");
          // 成功退出登录
          if (res.data.success) {
            // 清除sessionStorage
            sessionStorage.clear();
            // 跳转到登录页面
            this.$router.push("login");
          } else {
          }
        } catch (err) {
          // 网络错误
          this.$alert("退出失败，请稍后再试", "退出失败");
        }
      } catch (err) {}
    }
  }
});
</script>

<style lang="scss" scoped>
.my-nav {
  $navHeight: 50px;

  width: 100%;
  min-width:520px;
  height: $navHeight;
  border-radius: 5px;
  line-height: $navHeight;

  color: #fff;
  background-color: #334;

  // 用户名和退出按钮所在列表右浮动靠右
  > ul {
    float: right;
    > li {
      // 列表项左浮动横排
      float: left;
      padding-right: 10px;
    }
  }

  > ul::after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
