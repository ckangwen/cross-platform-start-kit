import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { HOME_PAGE, LOGIN_PAGE } from "@/constants/index";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const whiteList: string[] = [];
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }

  // 待访问的页面是否需要token
  const notNeedTokenPage = to.name ? whiteList.includes(to.name.toString()) : false;

  // const token = getToken();
  const token = "TOKEN";

  // 没有token，则表示没有登录
  if (!token) {
    // 页面处于白名单页面，不需要登录
    if (notNeedTokenPage) {
      next();
    } else {
      // 否则重定向到登录页面
      next({
        name: LOGIN_PAGE,
      });
    }
  } else if (notNeedTokenPage) {
    // TODO: 可能会有问题,如果有个页面,无论是否登录都可以访问的话,这种方式就不行
    // 如果已登录,但是去访问哪些不需要token的页面,则返回首页
    next({
      name: HOME_PAGE,
    });
  } else {
    // 已登录,则继续访问
    next();
  }

  // https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications
  // const store = useUser();
  // store.refreshUserInfo();
});

export default router;
