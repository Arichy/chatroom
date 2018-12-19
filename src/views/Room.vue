<template>
    <el-container>
        <el-header>
            <nav-menu></nav-menu>
            <div class="text-center show-nickname">你的昵称为:{{user.nickname}}</div>
        </el-header>
      
        <el-main>
            <div class="wrapper" style="margin:auto;background:skyblue">
                <!-- 房间信息区 -->
                <div class="title">
                    <div class="exit-btn-wrapper">
                        <el-button type="danger" @click="exitHandler" size="mini">退出房间</el-button>
                    </div>
                    
                    <ul>
                        <li class="show-room-id">{{room.roomId}}</li>
                        <li class="show-room-name">{{room.roomName}}</li>
                    </ul>
                </div>

                <!-- 除了房间信息区以外区域的wrapper -->
                <ul class="exclude-title-wrapper">
                    <!-- 聊天内容区和文字输入区 -->
                    <li>
                        <!-- 聊天内容区 -->
                        <div class="content"
                        @mousewheel="wheelHandler"
                        @DOMMouseScroll="wheelHandler"
                        @keydown.up.down="wheelHandler"
                        tabindex="-1"
                        style="outline:none"
                        ref="content">
                            <ul class="content-ul" >
                                <li v-for="chatContent of chatContentArr" :key="chatContent.id">
                                    <div :class="{'self-content':chatContent.user_id==user.id}">
                                        <div class="chat-content-info">
                                            <span>{{chatContent.name}} {{chatContent.time.toLocaleTimeString('it-IT')}}</span>
                                        </div>
                                        
                                        <!-- 聊天气泡的那个小勾 -->
                                        <canvas 
                                        ref="canvas" 
                                        :data-render="false" 
                                        :data-self="chatContent.user_id===user.id"> 
                                        </canvas>

                                        <span 
                                        class="chat-content-content" 
                                        ref="chatContentContent" 
                                        :data-self="chatContent.user_id===user.id" 
                                        >
                                            <span><pre>{{chatContent.msg}}</pre></span>
                                        </span>
                                       
                                    </div>

                                    <div v-if="chatContent.user_id===user.id" class="clear"></div>
                                </li>
                                
                            </ul>
                        </div>
                        <!-- 文字输入区 -->
                        <div class="input">
                            <el-input
                            type="textarea"
                            v-model="user.msg"
                            @keypress.enter.prevent.native="send"
                            @keydown.ctrl.enter.native="changeLine"
                            resize="none" 
                            class="my-textarea"
                            ref="textarea"></el-input>
                           
                        </div>
                    </li>

                    <!-- 聊天成员标题区和聊天成员列表区 -->
                    <li>
                        <!-- 聊天成员标题区 -->
                        <div class="member-title">
                            <div class="text-center">聊天成员({{peopleNum}})</div>
                        </div>

                        <!-- 聊天成员列表区 -->
                        <scroll-lock
                        class="member-list"
                        >
                            <ul>
                                <li class="member-item" v-for="member of this.memberArr" :key="member.id">
                                    {{member.nickname}}
                                </li>
                            </ul>
                        </scroll-lock>

                    </li>
                </ul>
            </div>
        </el-main>

        <Footer></Footer>
    </el-container>
</template>

<script>
import Vue from "vue";
import NavMenu from "@/components/NavMenu.vue";
import Footer from "@/components/Footer.vue";
import MyTextarea from "@/my-ui/MyTextarea.vue";

import Motion from "@/assets/util/Motion.js";

// 子元素滚动，父元素不滚动的组件
import VueScrollLock from "vue-scroll-lock";

import User from "@/assets/interface/User";
import Msg from "@/assets/interface/Msg";
import { userInfo } from "os";
import { clearTimeout } from "timers";

Vue.use(VueScrollLock);

let self = null;

let timer1, timer2;

// 一些自定义样式
let css = {
  backgroundColor: {
    // content整体背景颜色
    contentBackgroundColor: "#ebeef5",
    // 别人的对话框背景颜色
    otherContentBackgroundColor: "#d1f1fd",
    // 自己的对话框背景颜色
    selfContentBackgroundColor: "#f0f0f0"
  },
  canvas: {
    sideLength: 9,
    heightScale: 1.5
  }
};

// 画出聊天框旁边的类似对勾一样的图形
let drawCheckMark = (() => {
  console.log("init");
  const { sideLength, heightScale } = css.canvas;

  const {
    contentBackgroundColor,
    otherContentBackgroundColor,
    selfContentBackgroundColor
  } = css.backgroundColor;

  return function(canvas) {
    canvas.width = sideLength;
    canvas.height = sideLength * heightScale;

    const ctx = canvas.getContext("2d");
    ctx.scale(1, heightScale);

    // 镜像翻转
    if (canvas.dataset.self) {
      let scale = -1;
      let distance = (canvas.width - canvas.width * scale) / 2;
      ctx.translate(distance, 0);
      ctx.scale(-1, 1);
    }

    ctx.beginPath();
    ctx.arc(sideLength, 0, sideLength, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = canvas.dataset.self
      ? selfContentBackgroundColor
      : otherContentBackgroundColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
      sideLength,
      -3 / 4 * sideLength,
      5 / 4 * sideLength,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fillStyle = contentBackgroundColor;
    ctx.fill();

    // 镜像翻转复原
    if (canvas.dataset.self) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // 完成绘制，canvas的data-render设为true
    canvas.dataset.render = true;
  };
})();

// 渲染聊天气泡背景颜色
let drawChatContentContent = node =>
  (node.style["background-color"] = node.dataset.self
    ? css.backgroundColor.selfContentBackgroundColor
    : css.backgroundColor.otherContentBackgroundColor);
export default Vue.extend({
  components: {
    NavMenu,
    Footer,
    MyTextarea
  },

  data() {
    return {
      room: {
        roomId: 130,
        roomName: "聊天室"
      },
      chatContentArr: [], // 聊天消息数组
      memberArr: [], // 此房间里的成员数组
      user: {
        id: 1, // 当前用户id
        nickname: "", // 当前用户昵称
        msg: "" // 当前用户输入的消息
      }
    };
  },
  computed: {
    // 房间人数
    peopleNum: function() {
      return this.memberArr.length;
    }
  },
  methods: {
    // 生成一个msg_id
    genId(time) {
      // id组成为 用户id+2位年+2位月+2位日+2位时+2位分+2位秒+3位毫秒
      // id组成为 用户id+timestamp
      return `${this.user.id}${time.getTime()}`;
    },
    // 发送消息
    async send() {
      if (this.user.msg.length == 0) {
        return false;
      }
      // ---temp---
      let i = 0;
      let now = new Date();
      this.chatContentArr.push({
        id: this.genId(now), //
        user_id: this.user.id, // 发这条msg的用户的id
        name: this.user.nickname, // 发这条msg的用户的昵称
        msg: this.user.msg, //消息内容
        time: now //发消息的时间
      });
      // ---temp---

      this.user.msg = "";

      // 绘制新增的canvas
      this.$nextTick(() => {
        this.$refs.canvas
          .filter(canvas => !canvas.dataset.render) //过滤出未绘制的canvas
          .forEach(canvas => {
            // 绘制canvas
            drawCheckMark(canvas);
            // 给一起new出来的聊天气泡染色
            let newChatContentContentDOM = canvas.nextSibling;
            drawChatContentContent(newChatContentContentDOM);
          });

        // 滑动到最底部
        this.scrollToBottom();
      });

      return false;
    },

    // ctrl+enter换行
    changeLine(e) {
      e = e || event;
      e.returnValue = false;

      this.msg += "\n";
    },

    // 退出房间
    exitHandler() {
      // alert(14);
      // await "ajax";
      // 页面跳转到showroom
      this.$router.push("showroom");
      // this.memberArr.shift();
    },

    // 发送ajax告诉服务器该用户离开了该房间
    async exitAjax() {
      try {
        return await this.$http.post("/api/exitRoom");
      } catch (err) {
        // 网络错误
        throw err;
      }
    },

    // 当鼠标移入content内部时，禁止窗口滚动
    wheelHandler(e) {
      e = e || event;

      let content = this.$refs.content;

      const scrollTop = content.scrollTop,
        scrollHeight = content.scrollHeight,
        height = content.clientHeight;
      // console.log(scrollTop, scrollHeight, height);

      // 当出现滚动条时才禁止body滚动
      if (scrollHeight <= height) {
        return;
      }

      let edgeJudge = false; //判断是否到达边界
      let direction = "down";

      // 根据鼠标滑动or键盘上下键来判断edgeJudge的条件

      switch (e.type) {
        case "mousewheel":
          let delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0);
          direction = delta < 0 ? "up" : "down";
          edgeJudge =
            (delta > 0 && scrollTop <= delta) ||
            (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta);
          break;

        case "keydown":
          direction = e.keyCode == 38 ? "up" : "down";
          edgeJudge =
            (e.keyCode == 38 && scrollTop <= 3) ||
            (e.keyCode == 40 && scrollHeight - height - scrollTop <= 3);
          break;
      }

      if (edgeJudge) {
        // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
        e.type == "mousewheel" &&
          (content.scrollTop = direction == "down" ? 0 : scrollHeight);
        // 向上滚 || 向下滚
        e.preventDefault();
        e.returnValue = false;

        return false;
      }
    },

    // content滑到最下面
    scrollToBottom() {
      let content = this.$refs.content;
      let ul = content.querySelector(".content-ul");
      let lastChatContentContent = this.$refs.chatContentContent.getLast();

      let DOM_attrName = [
        [content, "height"],
        [ul, "height"],
        [lastChatContentContent, "padding-bottom"],
        [ul, "padding-bottom"]
      ];

      const [
        contentHeight,
        ulHeight,
        lastChatContentContentPaddingBottom,
        ulPaddingBottom
      ] = DOM_attrName.map(map => parseInt(Motion.getStyle(map[0], map[1])));

      let scrollDistance =
        ulHeight -
        contentHeight +
        lastChatContentContentPaddingBottom +
        ulPaddingBottom;
      console.log(scrollDistance);

      content.scrollTo(0, scrollDistance);
    },

    // 初始化本用户信息
    initUserInfo() {
      this.user.id = 1; //this.sessionStorage.getItem('id');
      this.user.nickname = sessionStorage.getItem("nickname");
      this.user.msg = "";
    },

    // 初始化本房间的聊天成员数组
    initMemberArr() {
      this.memberArr.push({
        id: this.user.id,
        nickname: this.user.nickname,
        username: this.user.username || "Arichy"
      });

      // ajax
    },

    // 渲染content
    renderContent() {
      // 使用nextTick，等vue渲染完成后操作DOM

      // 设置content整体背景颜色
      this.$nextTick(() => {
        this.$refs.content.style["background-color"] =
          css.backgroundColor.contentBackgroundColor;
      });

      // 自定义textarea样式
      this.$nextTick(() => {
        let textarea = this.$refs.textarea.$refs.textarea;
        textarea.style.width = "500px";
        textarea.style.height = "100px";
        console.log(this.$refs);
      });

      if (this.chatContentArr.length == 0) {
        return;
      }

      this.$nextTick(() => {
        // 使用canvas画对话框旁边的小勾
        //   this.$refs.canvas.forEach(canvas => drawCheckMark(canvas));
        // 由于画小勾的背景颜色要和对话框背景颜色一样，所以用js代替css渲染对话框背景颜色
        //   this.$refs.chatContentContent.forEach(node =>
        // drawChatContentContent(node)
        //   );

        //DOM节点名->处理该DOM节点的函数 映射
        let refNode_render = new Map([
          ["canvas", drawCheckMark],
          ["chatContentContent", drawChatContentContent]
        ]);

        // 对于每一个节点名，调用相应的处理函数进行处理
        for (const nodeName of refNode_render.keys()) {
          this.$refs[nodeName].forEach(node =>
            refNode_render.get(nodeName)(node)
          );
        }
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  },

  // 进入之前判断是否是通过点击enter进入的
  async beforeRouteEnter(to, from, next) {
    /*console.log(to, from);
    // ajax向服务器判断该用户是否在房间里
    const res = await Vue.prototype.$http.get('/api/authInRoom');
    // 在房间里，只有一种情况：通过点击Enter进去的
    if(res.data.success){
      next();
    } else {//不在房间里
      next(false);
    }*/
    next();
  },
  async beforeRouteLeave(to, from, next) {
    next();
  },
  beforeCreate() {
    self = this;
  },

  mounted() {
    this.initUserInfo();
    this.initMemberArr();
    this.renderContent();

    // let now = new Date;
    // this.chatContentArr.push({
    //   id: this.genId(now), //
    //   user_id: this.user.id, // 发这条msg的用户的id
    //   name: this.user.nickname, // 发这条msg的用户的昵称
    //   msg: this.user.msg, //消息内容
    //   time: now //发消息的时间
    // });

    class FakeUser {
      constructor(id, username, nickname) {
        this.id = id;
        this.username = username;
        this.nickname = nickname || username;
      }
    }

    class FakeMsg {
      constructor(id, user_id, name, msg, time) {
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.msg = msg;
        this.time = time;
      }
    }

    let _ = self._;
    // this.memberArr.push(
    //   new FakeUser(4, "秦兴隆"),
    //   new FakeUser(5, "9母"),
    //   new FakeUser(6, "蕾姆"),
    // );
    this.memberArr.push(
      new FakeUser(0,"许嵩"),
      new FakeUser(2,"五月天"),
      new FakeUser(3,"邓紫棋"),
      new FakeUser(4,"Taylor Swift"),
    )

    // let msgArr = [
    //   "嘻嘻嘻",
    //   "我觉得清者自清",
    //   "不努力就去死",
    //   "天啦撸",
    //   "啾咪惹",
    //   "喝下恒河水\n我要解开我的庆典"
    // ];

    let msgArr = [
      "你好",
      "很高兴认识你",
      "今晚吃什么?",
      "大家晚安"
    ];

    console.log(this.memberArr);

    let [i, j] = [0, 0];

    // 模拟消息产生
    setTimeout(function createMsg() {
      i++;
      let now = new Date();
      let user = self.memberArr[_.random(self.memberArr.length - 1)];

      let content = self.$refs.content;
      const { scrollTop, clientHeight, scrollHeight } = content;
      console.log(scrollHeight - scrollTop - clientHeight);
      let flag = false;
      if (scrollHeight - scrollTop - clientHeight <= 10) {
        flag = true;
      } else {
      }

      self.chatContentArr.push(
        new FakeMsg(
          _.random(0, 10000, true),``
          user.id,
          user.username,
          msgArr[_.random(msgArr.length - 1)],
          now
        )
      );

      // self.renderContent();
      self.$nextTick(() => {
        self.$refs.canvas
          .filter(canvas => !canvas.dataset.render) //过滤出未绘制的canvas
          .forEach(canvas => {
            // 绘制canvas
            drawCheckMark(canvas);
            // 给一起new出来的聊天气泡染色
            let newChatContentContentDOM = canvas.nextSibling;
            drawChatContentContent(newChatContentContentDOM);
          });
      });

      self.$nextTick(() => flag && self.scrollToBottom());

      if (i <= 10) {
        setTimeout(createMsg, _.random(0.3, 4) * 1000);
      }
    }, self._.random(0.3, 4) * 1000);

    // 模拟其他用户进入房间
    setTimeout(function joinRoom() {
      j++;
      let user = {
        id: _.random(5000, 10000),
        username: `小明`,
        nickname: `小明`
      };

      self.memberArr.push(user);

      self.$notify({
        title: "系统提示",
        message: `${user.nickname}加入了房间`,
        duration: 1000
      });

      setTimeout(() => {
        // self.memberArr.splice(self.memberArr.length - 1, 1);
        let user = self.memberArr.pop();
        self.$notify({
          title: "系统提示",
          message: `${user.nickname}退出了房间`,
          duration: 1000
        });
      }, _.random(1, 2) * 1000);

      // self.renderContent();

      if (j <= 2) {
        timer2 = setTimeout(joinRoom, _.random(0.3, 4) * 1000);
      }
    }, self._.random(0.3, 4) * 1000);

    window.onbeforeunload = function() {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8080/api/exitRoom", false);
      xhr.withCredentials = true;
      xhr.send(null);
    };
  },

  async destroyed() {
    // ---temp---

    // ---temp---

    window.onbeforeunload = null;

    try {
      const res = await this.exitAjax();
      console.log(res);
    } catch (err) {
      console.log(err);

      // 网络错误
      this.$alert("网络或服务器错误", "Error");
    }
  }
});
</script>

<style lang="scss" scoped>
.el-container {
  .el-header {
    .show-nickname {
      margin-top: 20px;
    }
  }
  .el-main {
    margin-top: 30px;
    padding-bottom: 100px;
    // 整体:宽高
    $wrapperWidth: 650px;
    $wrapperHeight: 540px;

    // 房间信息区:宽高背景颜色
    $titleWidth: $wrapperWidth;
    $titleHeight: 50px;
    $titleBackgroundColor: #606266;

    // 聊天内容区:宽高背景颜色
    $contentWidth: 500px;
    $contentHeight: 400px;
    $contentBackgroundColor: #ebeef5;

    // 文字输入区:宽高背景颜色
    $inputWidth: $contentWidth;
    $inputHeight: 100px;
    $inputBackgroundColor: #fcfcfc;

    // 聊天成员标题区:宽高背景颜色
    $memberTitleWidth: 150px;
    $memberTitleHeight: 30px;
    $memberTitleBackgroundColor: #f4f5f8;

    // 聊天成员列表区:宽高背景颜色
    $memberListWidth: $memberTitleWidth;
    $memberListHeight: 469px; //聊天成员标题区border-bottom占了一个px
    $memberListBackgroundColor: $memberTitleBackgroundColor;

    .wrapper {
      width: $wrapperWidth;
      height: $wrapperHeight;

      .title {
        width: $titleWidth;
        height: $titleHeight;
        background-color: $titleBackgroundColor;
      }

      .exclude-title-wrapper {
        > li {
          float: left;
        }

        .content {
          width: $contentWidth;
          height: $contentHeight;
          //   background-color: $contentBackgroundColor;
        }
        .input {
          width: $inputWidth;
          height: $inputHeight;
          background-color: $inputBackgroundColor;
        }

        .member-title {
          width: $memberTitleWidth;
          height: $memberTitleHeight;
          background-color: $memberTitleBackgroundColor;
        }
        .member-list {
          width: $memberListWidth;
          height: $memberListHeight;
          background-color: $memberListBackgroundColor;
        }
      }
    }

    .wrapper {
      .title {
        overflow: hidden; //BFC解决margin塌陷

        .exit-btn-wrapper {
          float: right;
          line-height: $titleHeight;

          .el-button {
            margin-right: 13px;
          }
        }
        .show-room-id,
        .show-room-name {
          color: #fff;
          margin-left: 10px;
        }
        .show-room-id {
          font-size: 10px;
          margin-top: 6px;
        }
        .show-room-name {
          font-size: 15px;
        }
      }

      .exclude-title-wrapper {
        .content {
          overflow-y: scroll;

          $otherContentBackgroundColor: #d1f1fd; // 别人的对话框
          $selfContentBackgroundColor: #f0f0f0; // 自己的对话框
          $nameColor: #a5a5a5; //名字颜色

          $chatContentInfoHeight: 20px; //名字、时间一栏的高度

          .content-ul {
            padding-bottom: 20px;
          }

          .chat-content-info {
            line-height: $chatContentInfoHeight;
            height: $chatContentInfoHeight;

            margin-top: 10px;
            margin-left: 15px;

            color: $nameColor;
            font-size: 14px;
          }

          .chat-content-content {
            display: inline-block;
            padding: 10px 10px;

            margin-top: 10px;

            border-radius: 5px;

            // 当单词太长时强制给单词换行
            word-break: break-word;

            // 内容的最大宽度
            max-width: 80%;

            font-size: 14px;
          }
          canvas {
            margin-bottom: 11px;
            margin-left: 30px;
          }

          // 自己的对话框特有的样式（可以覆盖上面的）
          .self-content {
            float: right;
            width: 100%;
            margin-right: 10px;

            // 为了实现自己的对话框整体在右边，名字部分采取文字靠右，内容部分采取右浮动。
            // 如果名字部分也采取右浮动，那么两个区域会在一行上。
            // 如果内容部分也采取文字靠右，那么内容字数的变化
            // 会导致.self-content的宽度变化，此时内容span在
            // .self-content内部是正常排列靠左的，所以会左移动
            .chat-content-info {
              text-align: right;
            }

            .chat-content-content {
              float: right;

              // background-color: $selfContentBackgroundColor;
            }

            canvas {
              float: right;
              margin-top: 10px;
              margin-left: 0px;
              line-height: 100px;
            }
          }

          .clear {
            clear: both;
          }
        }

        .input {
          overflow: hidden;
          border-bottom: 1px solid #ddd;

          .my-textarea {
            width: $contentWidth;
            height: $contentHeight;
            //   background-color: red;
          }
        }

        .member-title {
          color: #888;
          line-height: $memberTitleHeight;

          border-bottom: 1px solid #ddd;
          div {
            font-size: 13px;
          }
        }
        .member-list {
          overflow-y: scroll;
          border-bottom: 1px solid #ddd;
          .member-item {
            color: #666;
            line-height: 25px;
            padding-left: 13px;
          }
        }
      }
    }
  }
}
</style>
