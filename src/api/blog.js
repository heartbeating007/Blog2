import request from "@/utils/request";

// 分页获取文章
export function getBlog(page = 1, limit = 10) {
  return request({
    url: "/api/blog",
    method: "get",
    params: {
      page,
      limit,
    },
  });
}

// 删除文章
export function delOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "delete",
  });
}

// 添加文章

export function addBlog(data) {
  return request({
    url: " /api/blog",
    method: "post",
    data,
  });
}

//  编辑文章、

export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: "put",
    data: blogInfo.data,
  });
}

// 根据id 查找某一篇文章

export function findOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "get",
  });
}
