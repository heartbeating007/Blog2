// 工具函数库

// 格式化日期
export function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp));
  const year = date.getFullYear(); //年
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); //月
  const day = date.getDate().toString().padStart(2, "0"); //日
  const hours = date.getHours().toString().padStart(2, "0"); //时
  const minutes = date.getMinutes().toString().padStart(2, "0"); //分
  const seconds = date.getSeconds().toString().padStart(2, "0"); //秒
  const weekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const week = weekArr[date.getDay()];

  return (
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    week
  );
}

// 生成随机字符串

export function randomString(e) {
  e = e || 24;
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefjhijklmnopqrstuvwxyz0123456789";
  const a = str.length;
  let result = "";
  for (let i = 0; i < e; i++) {
    result += str.charAt(Math.floor(Math.random() * a));
  }
  return result;
}
