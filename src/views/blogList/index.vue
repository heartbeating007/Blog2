<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * eachPage + 1
        }}</template>
      </el-table-column>
      <el-table-column label="文章名称" width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="文章描述" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="浏览数" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>
      <el-table-column label="评论量" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>
      <el-table-column label="所属分类" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.category === null ? "未分类" : scope.row.category.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
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
              @click="editBlog(scope.row)"
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
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlog(scope.row)"
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
import { getBlog, delOneBlog } from "@/api/blog.js";
import { formatDate } from "@/utils/tools.js";

export default {
  data() {
    return {
      data: [], //存储数据
      srcList: [], //预览图数组
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
      const resp = await getBlog(this.currentPage, this.eachPage);
      this.data = resp.data.rows;
      for (const i of this.data) {
        i.createDate = formatDate(i.createDate);
        i.thumb = i.thumb;
        this.srcList.push(i.thumb);
      }
      this.count = resp.data.total; //数据总条数

      this.totalPage = Math.ceil(this.count / this.eachPage); //总页数
      // 如果当前是第2页，删除第2页最后一篇文章后，当前页面还是2，但是总页数只有1了
      // 所有需要把当前页面-1，再重新请求数据
      //  当前页码 > 总页数
      if (this.currentPage > this.totalPage) {
        this.currentPage = this.totalPage;
        this.fetchData();
      }
    },
    // 跳转到具体文章
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },
    // 删除文章
    deleteBlog(blogInfo) {
      this.$confirm(
        "删除该文章后，该文章相关的所有评论也会一并删除，是否继续?",
        "是否删除此篇文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delOneBlog(blogInfo.id).then(() => {
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
    // 编辑文章
    editBlog(blogInfo) {
      this.$router.push(`/editBlog/${blogInfo.id}`);
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
  },
};
</script>

<style></style>
