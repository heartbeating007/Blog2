<template>
  <div class="app-container">
    <!-- 添加首页标语 -->
    <el-button
      type="primary"
      style="margin-bottom: 15px"
      @click="addBannerHandle"
      >添加
      <i style="margin-left: 5px; font-size: 12px" class="el-icon-plus"></i
    ></el-button>
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="标题" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImgUrl"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImgUrl"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBannerHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delBanner(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑首页标语 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"> </el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 上传中图 -->

              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <!-- 上传大图 -->

              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加首页标语 -->
    <el-dialog
      title="请编辑信息"
      :visible.sync="dialogAddFormVisible"
      top="5vh"
    >
      <el-form :model="addForm">
        <el-form-item label="标题">
          <el-input v-model="addForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addForm.description" autocomplete="off">
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 上传中图 -->

              <Upload v-model="addForm.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <!-- 上传大图 -->

              <Upload v-model="addForm.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadBanner">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner.js";

import Upload from "@/components/Upload";
import { randomString } from "@/utils/tools.js";
export default {
  data() {
    return {
      data: [],
      dialogFormVisible: false,
      form: {
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
      dialogAddFormVisible: false,
      addForm: {
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
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
      const resp = await getBanner();
      this.data = resp.data;

      for (const item of this.data) {
        item.midImgUrl = item.midImg;
        item.bigImgUrl =  item.bigImg;
      }
    },
    editBannerHandle(bannerInfo) {
      this.form = { ...bannerInfo };
      this.dialogFormVisible = true;
    },
    editBannerConfirm() {
      // 从表单里面拿到用户修改的数据form，发送给服务器
      // api要求把三个首页标语都发过去

      let arr = [...this.data];
      for (let i = 0; i < arr.length; i++) {
        // 找到被修改的一项,用修改过后的数据替换
        if (arr[i].id === this.form.id) {
          arr[i] = this.form;
        }
      }

      setBanner(arr).then((resp) => {
        this.dialogFormVisible = false; //关闭对话框
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success",
        });
        this.fetchData(); //重新获取数据
      });
    },

    addBannerHandle() {
      this.dialogAddFormVisible = true;
      this.addForm.id = randomString();
    },
    uploadBanner() {
      let obj = [...this.data, { ...this.addForm }];
      setBanner(obj).then((resp) => {
        this.dialogAddFormVisible = false; //关闭对话框
        this.$message({
          showClose: true,
          message: "添加成功",
          type: "success",
        });
        this.fetchData(); //重新获取数据
      });
    },
    delBanner(bannerInfo) {
      const arr = this.data.filter((item) => {
        return item.id !== bannerInfo.id;
      });

      this.$confirm("此操作将永久删除该标语, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setBanner(arr).then((resp) => {
            this.fetchData(); //重新获取数据
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style></style>
