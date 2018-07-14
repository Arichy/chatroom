import Vue from 'vue'
import Router from 'vue-router'

// /index 
import Index from './views/Index.vue'
import Reg from './components/Index/Reg.vue';
import Login from './components/Index/Login.vue';

// /showroom
import ShwoRoom from './views/ShowRoom.vue';

// /room
import Room from './components/Room.vue';

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login',
      component: Index,
      children: [
        {
          path: '/reg',
          component: Reg
        },
        {
          path: '/login',
          component: Login
        }
      ]
    },
    {
      path: '/showroom',
      name:'showroom',
      component: ShwoRoom,
      meta: {
        requireAuth: true
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // 需要登陆
  if (to.meta.requireAuth) {
    const authRes = await Vue.prototype.$http.get('/api/auth');
    console.log('authRes',authRes);
    
    //如果已经登录
    if (authRes.data.success) {
      next();
    } else {//跳转到登录页面
      next({
        path:'/login',
        query:{
          tip:true  //在未登录的情况下通过自行修改url进入了某个界面，那么重定向至登录页面并且弹出提示
        }
      });
    }

  } else {
    next();
  }
});

export default router;
