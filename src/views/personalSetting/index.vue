<template>
  <div class="app-container">
    <el-form
      :model="adminInfo"
      :rules="setRules"
      ref="ruleForm"
      label-width="100px"
      width="500px"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="adminInfo.name"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input
          v-model="adminInfo.oldLoginPwd"
          placeholder="请输入旧密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="loginPwd">
        <el-input
          v-model="adminInfo.loginPwd"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码确认" prop="loginPwdConfirm">
        <el-input
          v-model="adminInfo.loginPwdConfirm"
          placeholder="请确认新密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-button type="primary" style="margin-top: 15px" @click="handleClick"
        >修改</el-button
      >
      <el-button type="danger" style="margin-top: 15px" @click="handleBack"
        >返回</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { getInfo, setUser } from "@/api/user.js";
export default {
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.adminInfo.loginPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      adminInfo: {
        id: "",
        loginId: "", // loginId
        name: "", // 用户名
        oldLoginPwd: "", // 旧密码
        loginPwd: "", // 新密码
        loginPwdConfirm: "", // 密码确认
      },
      setRules: {
        oldLoginPwd: [
          { required: true, trigger: "blur", message: "请输入旧的密码" },
        ],
        loginPwd: [
          { required: true, trigger: "blur", message: "请输入新的密码" },
        ],
        loginPwdConfirm: [
          { required: true, trigger: "blur", message: "请再次输入新密码" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    fetchData() {
      getInfo().then((res) => {
        this.adminInfo = res.data;
      });
    },
    handleClick() {
      // 验证每一项都填写
      if (
        this.adminInfo.name &&
        this.adminInfo.loginPwd &&
        this.adminInfo.oldLoginPwd
      ) {
        // 发送请求
        setUser(this.adminInfo).then((res) => {
          // 判断旧密码是否正确
          if (typeof res === "string") {
            // 旧密码错误
            const resp = JSON.parse(res);
            this.$message.error(resp.msg);
          } else {
            // 旧密码正确说明修改成功
            this.$message.success("密码修改成功");
            this.$store.dispatch("user/logout").then(() => {
              this.$router.push("/login");
            });
          }
        });
      } else {
        this.$message.error("请填写所有的项");
      }
    },
    handleBack() {
      this.$router.push("/");
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style></style>
