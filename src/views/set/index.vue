<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <div>
      <div class="title">网站信息</div>
      <!-- 网站标题 -->
      <el-divider></el-divider>
      <div class="mixTitle">网站标题</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.siteTitle" disabled></el-input>
      </div>

      <!-- 邮箱 -->

      <div class="mixTitle">邮箱</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.mail" disabled></el-input>
      </div>

      <!-- 备案号 -->

      <div class="mixTitle">备案号</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.icp" disabled></el-input>
      </div>

      <el-divider></el-divider>

      <!-- 网站头像信息 -->

      <div class="title">网站头像信息</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.avatar"
        ></el-image>
      </div>

      <el-divider></el-divider>

      <!-- 网址图标信息 -->

      <div class="title">网址图标信息</div>

      <!-- 网址图标地址 -->

      <div class="mixTitle">网址图标地址</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.favicon" disabled></el-input>
      </div>

      <!-- 网址图标预览 -->

      <div class="mixTitle">网址图标预览</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.favicon"
        ></el-image>
      </div>

      <el-divider></el-divider>

      <!-- github信息 -->

      <div class="title">github信息</div>

      <!-- github名字 -->

      <div class="mixTitle">github名字</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.githubName" disabled></el-input>
      </div>

      <!-- github地址 -->

      <div class="mixTitle">github地址</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.github" disabled></el-input>
      </div>

      <el-divider></el-divider>

      <!-- QQ信息 -->

      <div class="title">QQ 信息</div>

      <!-- QQ号码 -->

      <div class="mixTitle">QQ 号码</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.qq" disabled></el-input>
      </div>

      <!-- QQ二维码图片预览 -->

      <div class="mixTitle">QQ 二维码图片预览</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.qqQrCodeUrl"
        ></el-image>
      </div>

      <el-divider></el-divider>

      <!-- 微信信息 -->
      <div class="title">微信信息</div>

      <!-- 微信号 -->
      <div class="mixTitle">微信号</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-input v-model="form.weixin" disabled></el-input>
      </div>

      <!-- 微信二维码图片预览 -->
      <div class="mixTitle">微信二维码图片预览</div>
      <div style="margin-bottom: 25px; width: 500px">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.weixinQrCodeUrl"
        ></el-image>
      </div>

      <el-divider></el-divider>
      <!-- 进入编辑模式 -->
      <el-button type="primary" @click="openEditPanel">进入编辑模式</el-button>

      <!-- 弹出层 -->
      <el-dialog
        title="请编辑信息"
        :visible.sync="dialogFormVisible"
        width="50%"
        top="5vh"
        fullscreen
      >
        <el-form :model="form">
          <el-form-item label="网站标题">
            <el-input v-model="form2.siteTitle"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form2.mail"></el-input>
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="form2.icp"></el-input>
          </el-form-item>
          <el-form-item label="网站头像">
            <!-- <el-input v-model="form2.avatar"></el-input> -->
            <Upload v-model="form2.avatar" />
          </el-form-item>
          <el-form-item label="网站图标地址">
            <el-input v-model="form2.favicon"></el-input>
          </el-form-item>
          <el-form-item label="github 名字">
            <el-input v-model="form2.githubName"></el-input>
          </el-form-item>
          <el-form-item label="github 地址">
            <el-input v-model="form2.github"></el-input>
          </el-form-item>
          <el-form-item label="QQ 号码">
            <el-input v-model="form2.qq"></el-input>
          </el-form-item>
          <el-form-item label="QQ 二维码图片地址">
            <!-- <el-input v-model="form2.qqQrCode"></el-input> -->
            <Upload v-model="form2.qqQrCode" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="form2.weixin"></el-input>
          </el-form-item>
          <el-form-item label="微信二维码图片地址">
            <!-- <el-input v-model="form2.weixinQrCode"></el-input> -->
            <Upload v-model="form2.weixinQrCode" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditSetting"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSetting, editSetting } from "@/api/setting.js";
import Upload from "@/components/Upload";

export default {
  data() {
    return {
      form: {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      form2: {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      dialogFormVisible: false,
    };
  },
  components: {
    Upload,
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const resp = await getSetting();
      this.form = resp.data;
      this.form.avatarUrl =  this.form.avatarUrl;
      this.form.qqQrCodeUrl =  this.form.qqQrCode;
      this.form.weixinQrCodeUrl =  this.form.weixinQrCode;
      this.form2 = { ...this.form };
    },
    // 打开编辑模式
    openEditPanel() {
      this.dialogFormVisible = true;
    },
    // 完成编辑
    confirmEditSetting() {
      editSetting(this.form2).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: 100;
  font-size: 24px;
  margin-bottom: 25px;
}
.mixTitle {
  margin-bottom: 15px;
  font-weight: 100;
}
</style>
