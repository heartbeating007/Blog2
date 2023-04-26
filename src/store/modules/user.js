import { loginApi, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    user: null, //登录后的用户信息
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER: (state, payload) => {
    state.user = payload;
  },
};

const actions = {
  // user login
  // 变量解构赋值后{ commit }的commit = ctx.commit 了
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo)
        .then((resp) => {
          const { data } = resp;
          if (data) {
            // 如果data里面有数据，保存到仓库
            commit("SET_USER", data);
            resolve();
          } else {
            // 如果data里面没有数据
            reject(resp);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    // userInfo是用户登录提交的数据
    // const { username, password } = userInfo;
    // return new Promise((resolve, reject) => {
    //   loginApi({ username: username.trim(), password: password })
    //     .then((response) => {
    //       const { data } = response;
    //       commit("SET_TOKEN", data.token);
    //       setToken(data.token);
    //       resolve();
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 发送请求
      getInfo().then((response) => {
        if (typeof response === "string") {
          // 说明未登录，或者token已经过期
          response = JSON.parse(response);
          if (response.code === 401) {
            reject(response.msg);
          }
        } else {
          // 说明token 是有效的，将用户信息放到仓库
          commit("SET_USER", response.data);
          resolve();
        }
      });
      // getInfo(state.token)
      //   .then((response) => {
      //     const { data } = response;
      //     if (!data) {
      //       return reject("Verification failed, please Login again.");
      //     }
      //     const { name, avatar } = data;
      //     commit("SET_NAME", name);
      //     commit("SET_AVATAR", avatar);
      //     resolve(data);
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
      // logout(state.token)
      //   .then(() => {
      //     removeToken(); // must remove  token  first
      //     resetRouter();
      //     commit("RESET_STATE");
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
