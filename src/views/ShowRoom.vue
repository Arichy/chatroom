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
              <span>请选择房间(共{{roomNum}}个)<i class="el-icon-arrow-right"></i></span>
              <el-button @click="createRoom" type="success" class="create-room-btn">创建房间</el-button>
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

            <el-row type="flex" justify="center" class="page-row">
              <el-pagination
              ref="pagination"
              layout="prev, pager,next,total"
              :page-size="pageSize"
              :total="roomNum"
              @current-change="changePage">
              </el-pagination>
            </el-row>
            
        </el-main>

        <Footer></Footer>
    </el-container>
</template>

<script>
import Vue from "vue";
import NavMenu from "@/components/NavMenu.vue";
import Footer from "@/components/Footer.vue";

import { vroomname as validate } from "@/assets/util/validate.js";

let singleRowNum = 4; // 每一行的房间数
export default Vue.extend({
  data() {
    return {
      title: "房间列表",
      change: false, // 当前是否为更改昵称状态，控制输入框和确定按钮的显示
      nickname: "Error",
      newNickname: "",
      nowPage: 1, // 当前页号
      pageSize: 16, // 每一页展示的最大房间数
      roomArr: [],
      roomNum: 0 //房间总数，通过ws实时更新
    };
  },

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
    async enterRoom(roomId) {
      try {
        const res = await this.$http.post("/api/enterRoom", { roomId });
        // 服务器允许进入房间
        if (res.data.success) {
          // 跳转到聊天室界面
          this.$router.push("room");
        }
        console.log(res);
      } catch (err) {
        this.$alert("进入房间失败，请稍后再试", "网络错误");
      }
    },

    // 创建房间
    async createRoom() {
      try {
        const { value: roomname } = await this.$prompt(
          "请输入房间名称",
          "系统提示",
          {
            inputValidator: validate
          }
        );

        try {
          const res = await this.$http.post("/api/createRoom", { roomname });
          // 创建成功
          if (res.data.success) {
            // 返回创建的roomId
            this.enterRoom(res.data.data.roomId);
          } else {
            // 创建失败
            this.$alert(res.data.msg, "系统提示");
          }
        } catch (err) {
          // 网络错误
          console.log(err);
          this.$alert("网络错误", "系统提示");
        }
      } catch (err) {
        // 取消输入，不用管
      }
    },

    // 分页获取房间
    async changePage(nowPage) {
      this.nowPage = nowPage;
      const page = nowPage;
      const pageSize = this.pageSize;
      try {
        const res = await this.$http.get("/api/getRoom", {
          params: { page, pageSize }
        });
        console.log(res.data);
        this.roomArr = res.data.data.roomArr;
      } catch (err) {
        this.$alert("网路错误", "系统提示");
      }
    },

    // 初始化用户信息
    userinit() {
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
    },

    // 修改elementUI的默认样式
    change_elementUI_default_style() {
      // 修改elementUI的关于分页记录总数量的默认提示
      this.$nextTick(() => {
        let totalSpan = this.$refs.pagination.$children.find(
          c => c.$el.className == "el-pagination__total"
        ).$el;

        totalSpan.innerText = totalSpan.innerText.replace("条", "个房间");
      });
    },
    // 初始化房间信息
    async roominit() {
      // 获得第一页的房间数据
      this.changePage(this.nowPage);
      // 获得房间总数
      try {
        const res = await this.$http.get("/api/getRoom/getNum");

        this.roomNum = res.data.data.roomNum;
      } catch (err) {
        this.$alert("网路错误", "系统提示");
      }
    }
  },

  mounted() {
    this.userinit();
    this.roominit();
    this.change_elementUI_default_style();
  },

  watch: {
    nickname: function(newValue) {
      sessionStorage.setItem("nickname", newValue);
    }
  },

  sockets: {
    connect() {
      console.log("connnected");
    },

    // 更新房间列表
    update_roomArr(roomArr) {
      // this.roomArr = roomArr;
      this.roominit();
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

    .el-row {
      .create-room-btn {
        float: right;
        margin-right: 30px;
      }
    }

    .room-list-wrapper {
      min-height: 600px;
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

    .page-row {
      // margin-top: 30px;
    }
  }
}
</style>
