import request from "@/utils/request";

// 获取全局设置
export function getSetting() {
  return request({
    url: "/api/setting",
    method: "get",
  });
}

// 编辑全局设置
/**
 *
 * @param {Object} data
 * @returns 返回新的设置信息
 */
export function editSetting(data) {
  return request({
    url: "/api/setting",
    method: "put",
    data,
  });
}
