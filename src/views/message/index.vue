<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <!-- 序号 -->

      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * eachPage + 1
        }}</template>
      </el-table-column>

      <!-- 头像 -->
      <el-table-column label="头像" align="center" width="80">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            size="small"
            :src="scope.row.avatar"
          ></el-avatar>
        </template>
      </el-table-column>

      <!-- 昵称 -->
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>

      <!-- 留言内容 -->
      <el-table-column label="评论内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <!-- 评论日期 -->
      <el-table-column label="评论日期" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
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
              style="background: red; border-color: red"
              size="mini"
              @click="delCommentHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->

    <el-pagination
      style="margin-top: 30px"
      background
      :page-size="eachPage"
      layout="prev, pager, next,total,->,sizes,jumper"
      :total="count"
      :page-sizes="[5, 10, 20]"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandel"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getMessage, delMessage } from "@/api/message.js";

import { formatDate } from "@/utils/tools.js";
export default {
  data() {
    return {
      data: [], //存储数据
      eachPage: 5, //每页显示条数
      currentPage: 1, //当前页码，默认第一页
      totalPage: 0, //总页数
      count: 0, //数据总条数
      pagerCurrentPage: 1, // 分页栏当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const resp = await getMessage(this.currentPage, this.eachPage);
      this.data = resp.data.rows;
      this.count = resp.data.total;
      for (const i of this.data) {
        i.createDate = formatDate(i.createDate);
        i.avatar =  i.avatar;
      }

      this.totalPage = Math.ceil(this.count / this.eachPage); //总页数
      // 如果当前是第2页，删除第2页最后一篇文章后，当前页面还是2，但是总页数只有1了
      // 所有需要把当前页面-1，再重新请求数据
      //  当前页码 > 总页数
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage;
        this.fetchData();
      }
    },

    // 分页相关事件
    sizeChangeHandle(pageNum) {
      // pageSize每页条数 改变时会触发
      this.eachPage = parseInt(pageNum);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    currentChangeHandle(pageNum) {
      // currentPage当前页 改变时会触发
      this.currentPage = parseInt(pageNum);

      this.fetchData();
    },
    prevClickHandle() {
      // 用户点击上一页按钮改变当前页后触发
      this.currentPage -= 1;
    },
    nextClickHandel() {
      // 用户点击下一页按钮改变当前页后触发
      this.currentPage += 1;
    },

    delCommentHandle(CommentInfo) {
      this.$confirm("此操作会永久删除该留言，是否继续?", "是否删除此留言", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delMessage(CommentInfo.id).then(() => {
            this.fetchData();
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
