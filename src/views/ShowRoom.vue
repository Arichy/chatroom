<template>
    <el-container>
        <!-- 头像 -->
        <!-- <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1716138102,2935014289&fm=27&gp=0.jpg" alt=""> -->
        
        <el-header>
          <nav-menu></nav-menu>
        </el-header>

        <el-main>
            <el-row>
              <div class="showName">
                <ul>

                  <li>
                      <span>你的昵称为:</span>
                  </li>

                  <li>
                      <!-- 展示昵称 -->
                      <div v-if="!change">
                        {{nickname}}
                        &nbsp;&nbsp;<el-button @click="change=true" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                      </div>

                      <!-- 修改昵称 -->
                      <div v-else>
                        <ul>
                          <li>
                            <el-input maxlength="5" v-model="newNickname"></el-input>
                          </li>
                          <li>
                            &nbsp;&nbsp;
                            <el-button @click="changeNickName" type="primary" icon="el-icon-check" circle size="mini"></el-button>
                            <el-button @click="change=false;newNickname=nickname" type="danger" icon="el-icon-close" circle size="mini"></el-button>
                          </li>
                        </ul>
                      </div>
                  </li>

                </ul>
              </div>
            </el-row>
            
            <el-row style="margin-top:10px;">
              <span>请选择房间<i class="el-icon-arrow-right"></i></span>
              <hr class="hr-cloud" style="margin-top:30px;">
            </el-row>

            <div class="room-list-wrapper">
            <el-row :gutter="50" class="room-list">
              <el-col :span="6" v-for="room of roomArr" class="room-box-wrapper">
                <div class="room-box">
                  <div class="show-room-name text-center">{{room.name}}</div>
                  <div class="text-center" style="height:60px;">
                    <el-button @click="enterRoom(room)" class="enterBtn" type="primary" round plain>Enter</el-button>
                  </div>
                  <el-row :gutter="0" style="position:absolute;bottom:0;width:100%;height:20px;">
                    <el-col :span="15">
                      <div class="show-room-id">
                        房间号:{{room.id}}
                      </div>
                    </el-col>
                    <el-col :span="9" class="text-right">
                      <div class="show-room-peopleNum">
                        人数:{{room.peopleNum}}
                      </div>
                    </el-col>
                  </el-row>
                  
                </div>
              </el-col>
            </el-row>
            </div>
            
        </el-main>

        <Footer></Footer>
    </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import NavMenu from "@/components/NavMenu.vue";
import Footer from "@/components/Footer.vue";

let singleRowNum = 4; // 每一行的房间数
export default Vue.extend({
  data() {
    return {
      title: "房间列表",
      change: false,
      nickname: "Error",
      newNickname: "",

      roomArr: [
        {
          id: "130130",
          name: "测试用聊天室1",
          peopleNum: 12
        },
        {
          id: "130131",
          name: "测试用聊天室2",
          peopleNum: 4
        },
        {
          id: "130132",
          name: "测试用聊天室3",
          peopleNum: 1
        },
        {
          id: "130133",
          name: "测试用聊天室4",
          peopleNum: 13
        },
        {
          id: "130134",
          name: "测试用聊天室5",
          peopleNum: 7
        }
      ]
    };
  },
  computed: {},

  components: {
    NavMenu,
    Footer
  },
  methods: {
    // 更改昵称
    changeNickName() {
      this.nickname != this.newNickname && (this.nickname = this.newNickname); // 不相等的时候才改
      this.change = false;
    },

    // 进入房间
    async enterRoom(room) {
      try {
        const res = await this.$http.post("/api/enterRoom", { room });
        // 服务器允许进入房间
        if (res.data.success) {
          // 跳转到聊天室界面
          this.$router.push("room");
        }
        console.log(res);
      } catch (err) {
        this.$alert("进入房间失败，请稍后再试", "网络错误");
      }
    }
  },

  mounted() {
    // 获取用户名
    let username = sessionStorage.getItem("username");
    this.username = username;
    // 获取昵称
    let nickname = sessionStorage.getItem("nickname");

    // 还未设置昵称，应该是刚刚登陆进来
    if (!nickname) {
      this.nickname = username;
      this.newNickname = username;

      sessionStorage.setItem("nickname", username);
    } else {
      // 已经设置了昵称，应该是刷新了页面
      this.nickname = nickname;
      this.newNickname = nickname;
    }

    Array.from({ length: 10 }).forEach((item, index) =>
      this.roomArr.push({ id: index, name: index, peopleNum: index })
    );
  },

  watch: {
    nickname: function(newValue) {
      sessionStorage.setItem("nickname", newValue);
    }
  }
});
</script>

<style lang="scss" scoped>
.el-container {
  // 设置页面圆角元素的默认弧度
  $borderRadius: 5px;

  color: #909399;

  .el-header {
    // margin-top: 15px;
  }

  .el-main {
    // background-color:yellow;
    padding-bottom: 100px;

    .showName {
      font-size: 20px;
      line-height: 40px;
      height: 50px;

      ul {
        li {
          float: left;

          .el-button,
          .el-input {
            position: relative;
            bottom: 3px;
          }
        }
        li:not(:fist-child) {
          padding: 0px 5px;
        }
        // 设置输入框宽度
        li:nth-child(2) {
          ul li:nth-child(1) {
            width: 100px;
          }
        }
      }
      // 清除浮动
      ul::after {
        content: "";
        display: block;
        clear: both;
      }
    }

    .room-list-wrapper {
      width: 70%;
      margin: auto;
      // margin-top:20px;

      .room-list {
        .room-box-wrapper {
          margin-top: 40px;
          min-width: 200px;

          .room-box {
            min-width: 150px;
            height: 100px;
            border: 1px solid rgba(64, 158, 255, 0.5);
            border-radius: $borderRadius;
            position: relative;
            overflow: hidden;

            .enterBtn {
              height: 40px;
              margin-top: 10px;
            }

            .show-room-name {
              background-color: rgba(64, 158, 255, 0.9);
              color: white;
            }
            .show-room-id,
            .show-room-peopleNum {
              font-size: 10px;
              color: rgba(64, 158, 255, 0.8);
            }
            .show-room-peopleNum {
              float: right;
              margin-right: 5px;
            }
            .show-room-id {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
