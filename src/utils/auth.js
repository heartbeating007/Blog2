import Cookies from "js-cookie";

export function getToken() {
  return localStorage.adminToken;
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  // return Cookies.remove(TokenKey);
  localStorage.removeItem("adminToken");
}
