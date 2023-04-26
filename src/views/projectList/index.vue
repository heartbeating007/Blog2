<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table
      v-loading="listLoading"
      :data="data"
      style="width: 100%"
      border
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <!-- 项目名称 -->
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          <a class="proName" :href="scope.row.url">{{ scope.row.name }}</a>
        </template>
      </el-table-column>

      <!-- 项目描述 -->
      <el-table-column label="项目描述" align="center">
        <template slot-scope="scope">{{
          scope.row.description.toString()
        }}</template>
      </el-table-column>

      <!-- 预览图 -->
      <el-table-column label="预览图" align="center" width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.thumbUrl"
            fit="cover"
            :preview-src-list="srcList"
          ></el-image>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <!-- github地址 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="gitHub"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="iconfont icon-github"
              class="github"
              circle
              size="mini"
              @click="openGithubHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <!-- 编辑 -->
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
              @click="editProjectHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <!-- 删除 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteProjectHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 项目编辑框 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form :model="form">
        <!-- 项目名称 -->

        <el-form-item label="项目名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 项目描述 -->

        <el-form-item label="项目描述（每一项描述以句号分割）">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 项目链接 -->

        <el-form-item label="项目链接">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>

        <!-- github地址 -->

        <el-form-item label="github地址">
          <el-input v-model="form.github" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 预览图 -->
        <el-form-item label="预览图">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <!-- 项目排序等级 -->
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 确认按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, editProject, delProject } from "@/api/project.js";

import Upload from "@/components/Upload";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      data: [],
      srcList: [], //预览图数组
      listLoading: false,
      dialogFormVisible: false,
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

  created() {
    this.fetchDate();
  },

  methods: {
    async fetchDate() {
      this.listLoading = true;
      const resp = await getProject();
      this.listLoading = false;
      this.data = resp.data;
      for (let i of this.data) {
        i.thumbUrl =  i.thumb;
        this.srcList.push(i.thumbUrl);
      }
    },
    // github按钮点击事件
    openGithubHandle(projectInfo) {
      window.open(projectInfo.github);
    },
    // 编辑项目点击事件
    editProjectHandle(projectInfo) {
      this.form = {
        ...projectInfo,
        description: projectInfo.description.toString(),
      };
      this.dialogFormVisible = true;
    },
    // 删除项目点击事件
    deleteProjectHandle(projectInfo) {
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProject(projectInfo.id).then(() => {
            this.fetchDate();
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
    // 提交表单
    confirmEditProjectHandle() {
      let obj = { ...this.form };
      obj.description = this.form.description.split("。");
      obj.order = parseInt(this.form.order);

      editProject({
        id: obj.id,
        data: obj,
      }).then(() => {
        this.dialogFormVisible = false;
        this.fetchDate();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style scoped>
.proName:hover {
  color: #008c8c;
  font-weight: bold;
}
.github {
  background: rgba(41, 38, 38, 0.8);
  border-color: rgba(41, 38, 38, 0.8);
}
</style>
