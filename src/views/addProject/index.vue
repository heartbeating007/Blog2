<template>
  <div class="app-container">
    <el-form :model="form">
      <!-- 项目名称 -->

      <el-form-item label="项目名称">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入项目名称"
        ></el-input>
      </el-form-item>

      <!-- 项目描述 -->

      <el-form-item label="项目描述（每一项描述以句号分割）">
        <el-input
          v-model="form.description"
          autocomplete="off"
          placeholder="请输入项目描述"
        ></el-input>
      </el-form-item>

      <!-- 项目链接 -->

      <el-form-item label="项目链接">
        <el-input
          v-model="form.url"
          autocomplete="off"
          placeholder="请输入项目链接"
        ></el-input>
      </el-form-item>

      <!-- github地址 -->

      <el-form-item label="github地址">
        <el-input
          v-model="form.github"
          autocomplete="off"
          placeholder="请输入项目github地址"
        ></el-input>
      </el-form-item>

      <!-- 预览图 -->
      <el-form-item label="预览图">
        <Upload v-model="form.thumb" />
      </el-form-item>

      <!-- 项目排序等级 -->
      <el-form-item label="项目排序等级">
        <el-select v-model="form.order" placeholder="分类等级">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addProjectHandle">发布项目</el-button>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import { addProject } from "@/api/project.js";
export default {
  data() {
    return {
      form: {
        name: "", //项目名字
        description: "", //项目描述
        url: "", //项目地址
        github: "", //github地址
        thumb: "", //缩略图
        order: 1, //
      },
    };
  },
  components: {
    Upload,
  },
  methods: {
    addProjectHandle() {
      let obj = { ...this.form };
      obj.description = this.form.description.split("。");
      obj.order = parseInt(this.form.order);
      addProject(obj).then(() => {
        this.$message.success("发布成功");
        this.$router.push("/projectList");
      });
    },
  },
};
</script>
