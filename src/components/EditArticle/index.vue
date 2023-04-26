<template>
  <div>
    <!-- 文章标题 -->
    <div class="title">文章标题</div>
    <div style="margin-bottom: 25px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>

    <!-- 文章编辑 -->

    <div class="title">文章编辑</div>
    <div style="margin-bottom: 25px">
      <Editor
        ref="toastuiEditor"
        :initialValue="form.editorText"
        height="600px"
        :options="editOptions"
      />
    </div>

    <!-- 文章描述 -->
    <div class="title">文章描述</div>
    <div style="margin-bottom: 25px">
      <el-input
        v-model="form.description"
        type="textarea"
        placeholder="请输入文章描述"
        :rows="6"
      ></el-input>
    </div>

    <!-- 文章头图 -->
    <Upload v-model="form.thumb" upLoadTitle="文章头图" />

    <!-- 文章分类 -->
    <div class="title">文章分类</div>
    <div style="margin-bottom: 25px">
      <el-select v-model="form.select" placeholder="请选择文章分类">
        <el-option
          v-for="item in blogType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>

    <!--发布文章 -->
    <el-button type="primary" @click="addArticleHandle">{{
      buttonContent
    }}</el-button>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import Upload from "@/components/Upload";
import { getBlogType } from "@/api/blogType.js";
import { addBlog, editBlog, findOneBlog } from "@/api/blog.js";

import { Editor } from "@toast-ui/vue-editor";
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
  props: ["mode"],
  data() {
    return {
      buttonContent: "发布文章",
      form: {
        title: "", //文章标题
        editorText: "", // 用户编辑的内容
        description: "", //文章的描述
        thumb: "", // 文章的图片
        select: "", // 选择分类
      },
      blogType: [], //存放博客分类
      editOptions: {
        language: "zh-CN",
      },
    };
  },
  components: {
    Editor,
    Upload,
  },
  async created() {
    if (this.mode === "edit") {
      // 根据id 获得文章内容 回填进表单
      this.id = this.$route.params.id;

      findOneBlog(this.id).then((re) => {
        //  把这篇文章的内容回填到表单
        this.form = re.data;

        this.form.select = re.data.category === null ? "" : re.data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", re.data.htmlContent);
      });

      this.buttonContent = "确认修改";
    }
    const resp = await getBlogType();

    this.blogType = resp.data;
  },
  methods: {
    async addArticleHandle() {
      // 获取表单内容  发送请求

      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        thumb: this.form.thumb,
        htmlContent: html,
        markdownContent: markdown,
      };
      // 除了图片，其他内容必须要有
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          // 新增文章
          await addBlog(obj);
        } else {
          // 编辑文章
          await editBlog({
            id: this.id,
            data: obj,
          });
          this.$message.success("文章修改成功");
        }

        this.$router.push("/blogList"); //发布成功，跳转到文章列表
      } else {
        this.$message.error("请填写所有内容");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 15px 0;
  font-weight: 100;
}
</style>
