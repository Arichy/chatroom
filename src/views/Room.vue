<template>
    <el-container>
        <el-header>
            <nav-menu></nav-menu>
        </el-header>

        <el-main>
            <div class="wrapper" style="margin:auto;background:skyblue">
                <!-- 房间信息区 -->
                <div class="title">
                    <div class="exit-btn-wrapper">
                        <el-button type="danger" size="mini">退出房间</el-button>
                    </div>
                    
                    <ul>
                        <li class="show-room-id">130130</li>
                        <li class="show-room-name">周阴婷聊天室</li>
                    </ul>
                </div>

                <!-- 除了房间信息区以外区域的wrapper -->
                <ul class="exclude-title-wrapper">
                    <!-- 聊天内容区和文字输入区 -->
                    <li>
                        <!-- 聊天内容区 -->
                        <div class="content" @scroll="scrollHandler" ref="content">
                            <ul class="content-ul">
                                <li v-for="chatContent of chatContentArr" >
                                    <div :class="{'self-content':chatContent.id==id}">
                                        <div class="chat-content-info">
                                            <span>{{chatContent.name}} {{chatContent.time.toLocaleTimeString('it-IT')}}</span>
                                        </div>
                                        
                                        <!-- 聊天气泡的那个小勾 -->
                                        <canvas ref="canvas" 
                                        :data-render="false" 
                                        :data-self="chatContent.id===id"> 
                                        </canvas>

                                        <span 
                                        class="chat-content-content" 
                                        ref="chatContentContent" 
                                        :data-self="chatContent.id===id" 
                                        >
                                            <span>{{chatContent.msg}}</span>
                                        </span>
                                        <!-- <canvas ref="canvas" v-if="chatContent.id===id"></canvas> -->
                                    </div>

                                    <div v-if="chatContent.id===id" class="clear"></div>
                                </li>
                                
                            </ul>
                        </div>
                        <!-- 文字输入区 -->
                        <div class="input">
                            <el-input
                            type="textarea"
                            v-model="msg"
                            @keydown.enter.prevent.native="send"
                            @keydown.ctrl.enter.native="test"
                            resize="none" 
                            class="my-textarea"
                            ref="textarea"></el-input>
                            <!-- <my-textarea 
                            :myStyle="{
                                width:'500px',
                                height:'100px',
                                resize:'none',
                                'border-radius':'0px'
                            }"
                            
                            :model="msg"
                            ></my-textarea> -->

                            <!-- <my-textarea
                            :css="{
                                width:'500px',
                                height:'100px'
                            }"

                            v-model="msg"

                            :value="msg"
                            @input= "msg = $event"
                            ></my-textarea> -->
                        </div>
                    </li>

                    <!-- 聊天成员标题区和聊天成员列表区 -->
                    <li>
                        <!-- 聊天成员标题区 -->
                        <div class="member-title">
                            <div class="text-center">聊天成员({{peopleNum}})</div>
                        </div>
                        <!-- 聊天成员列表区 -->
                        <div class="member-list">
                            <ul>
                                <li class="member-item" v-for="member of this.memberArr">
                                    {{member.name}}
                                </li>
                            </ul>
                        </div>
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

let self = null;

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
      chatContentArr: [], // 聊天消息数组
      memberArr: [], // 此房间里的成员数组
      id: 1, // 当前用户id
      msg: "" // 当前用户输入的消息
    };
  },
  computed: {
    peopleNum: function() {
      return this.chatContentArr.length;
    }
  },
  methods: {
    async send(e) {
      // ---temp---
      this.chatContentArr.push({
        id: this.id,
        name: "周阴婷",
        msg: this.msg,
        time: new Date()
      });

      this.msg = "";

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

      // ---temp---
      return false;
    },

    test() {
      console.log(`%c${this.msg}`, "background-color:red");
      this.msg += "13";
    },

    scrollHandler(e) {
      console.log(e.target.scrollTop);
    },

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
    }
  },
  //   beforeRouteLeave(to,from,next){
  // 用户刷新了页面
  //   if(from.name==null){
  //       next();
  //   } else {// 离开此页面
  //     alert(13);
  //   }
  //   }
  beforeCreate() {
    console.log("beforeCreate");
    self = this;
  },

  mounted() {
    //---temp---
    for (let i = 0; i < 20; i++) {
      this.chatContentArr.push({
        id: i,
        name: `member${i}`,
        msg: "今天天气不错",
        time: new Date()
      });

      this.memberArr.push({
        id: i,
        name: `member${i}`
      });
    }

    this.chatContentArr.push({
      id: this.id,
      name: `member${this.id}`,
      msg: "嘻嘻嘻",
      time: new Date()
    });
    this.chatContentArr.push({
      id: this.id,
      name: `member${this.id}`,
      msg: "嘻嘻嘻",
      time: new Date()
    });

    ["南宁仙子周阴婷", "蔡依淋", "罗玉凤"].forEach((bitch, index) => {
      this.chatContentArr.push({
        id: index + 10,
        name: bitch,
        msg: "我素妓女",
        time: new Date()
      });

      this.memberArr.push({
        id: index + 10,
        name: bitch
      });
    });
    //---temp---

    // 使用nextTick，在v-for将li全部渲染完成后操作canvas和chatcontentcontent

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

    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },

  destroyed() {
    // alert(14);
  }
});
</script>

<style lang="scss" scoped>
.el-container {
  .el-main {
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
            // margin-left: 30px;

            border-radius: 5px;

            // 当单词太长时强制给单词换行
            word-break: break-word;

            // 内容的最大宽度
            max-width: 80%;

            // background-color: $otherContentBackgroundColor;
            font-size: 14px;
          }
          canvas {
            margin-bottom: 11px;
            margin-left: 30px;
          }

          // 自己的对话框特有的样式（可以覆盖上面的）
          .self-content {
            float: right;

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

              //   background-color: $selfContentBackgroundColor;
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
