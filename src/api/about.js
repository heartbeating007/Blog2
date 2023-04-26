import request from "@/utils/request";

// 获取关于我页面url
export function getAboutUrl() {
  return request({
    url: "/api/about",
    method: "get",
  });
}

// 设置关于我页面url

export function setAboutUrl(data) {
  return request({
    url: "/api/about",
    method: "post",
    data,
  });
}
