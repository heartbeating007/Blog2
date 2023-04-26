<template>
  <div class="app-container">
    <div class="title">关于我</div>
    <el-input
      v-model="url"
      placeholder="请输入内容"
      :disabled="isDisabled"
    ></el-input>
    <el-button type="primary" style="margin-top: 15px" @click="clickHandle">{{
      butContent
    }}</el-button>
  </div>
</template>

<script>
import { getAboutUrl, setAboutUrl } from "@/api/about.js";
export default {
  data() {
    return {
      url: "",
      isDisabled: true,
      butContent: "编辑",
    };
  },
  created() {
    this.fetchDate();
  },
  methods: {
    async fetchDate() {
      const resp = await getAboutUrl();
      this.url = resp.data;
    },
    clickHandle() {
      if (this.isDisabled) {
        // 输入框禁用状态，点击开始编辑
        this.isDisabled = false;
        this.butContent = "确定修改";
      } else {
        // 输入框不是禁用，点击编辑完成

        if (this.url) {
          this.isDisabled = true;
          this.butContent = "编辑";
          setAboutUrl({ url: this.url }).then(() => {
            this.$message.success("更改成功");
          });
        } else {
          this.$message({
            message: "输入框不能为空",
            type: "warning",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: 100;
  font-size: 24px;
  margin-bottom: 15px;
}
</style>
