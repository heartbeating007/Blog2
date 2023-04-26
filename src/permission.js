import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration 进度条配置

// const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start(); //进度条开始

  // set page title
  document.title = getPageTitle(to.meta.title);
  const hasGetUserInfo = store.getters.user; //获取用户信息
  if (to.meta.auth) {
    // 需要鉴权
    if (hasGetUserInfo) {
      // 有用户信息
      next();
    } else {
      // 没有有用户信息,判断是否有token
      const token = localStorage.adminToken;
      if (token) {
        // 有token 验证token有效性
        try {
          // token 有效 通过
          await store.dispatch("user/getInfo"); //who am I?
          next();
        } catch (err) {
          // token 无效 不通过 删除token
          await store.dispatch("/user/resetToken");

          Message.error("登录已过期，请重新登录");
          next(`/login?redirect=${to.path}`);
          NProgress.done(); //进度条结束
        }
      } else {
        // 没有token。需要重新登录
        next(`/login?redirect=${to.path}`);
        NProgress.done(); //进度条结束
      }
    }
  } else {
    // 不需要鉴权
    if (to.path === "/login" && hasGetUserInfo) {
      // 登录状态下，进入登录页面。直接导航到首页
      console.log(2);

      next({ path: "/" });
    } else {
      next();
    }
    NProgress.done(); //进度条结束
  }

  // vue-element-admin 鉴权流程
  // determine whether the user has logged in
  // const hasToken = getToken();

  // if (hasToken) {
  //   if (to.path === "/login") {
  //     // if is logged in, redirect to the home page
  //     next({ path: "/" });
  //     NProgress.done();
  //   } else {
  //     const hasGetUserInfo = store.getters.name;
  //     if (hasGetUserInfo) {
  //       next();
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch("user/getInfo");

  //         next();
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch("user/resetToken");
  //         Message.error(error || "Has Error");
  //         next(`/login?redirect=${to.path}`);
  //         NProgress.done();
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next();
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`);
  //     NProgress.done();
  //   }
  // }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
