<template>
  <div class="upload-container">
    <!-- 标题 -->
    <div class="title" v-if="upLoadTitle">{{ upLoadTitle }}</div>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
      :before-upload="onUploadBefore"
      v-loading="loading"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>

export default {
  props: ["upLoadTitle", "value"],
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    imageUrl() {
      if (this.value) {
        return  this.value;
      }
    },
    headers() {
      return {
        // 因为上传图片需要授权，所以加上token

        Authorization: "Bearer " + localStorage.getItem("adminToken"),
      };
    },
  },
  methods: {
    handleAvatarSuccess(res) {
      //   res {code: 0, msg: '', data: '/static/upload/2023-2-9-20-14-11-194-165b0.jpg'}
      //   上传成功得到的返回值;
      if (res.code === 0 && res.data) {
        // 说明上传成功，把数据传给父组件，父组件得到过后重新传递下来，重新渲染页面

        this.$emit("input", res.data);
        this.loading = false;
      }
    },
    onUploadBefore() {
      this.loading = true;
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.title {
  margin: 15px 0;
  font-weight: 100;
  display: block;
}
.upload-container {
  width: 177px;
}
</style>
