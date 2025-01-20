import { setJwt } from "./api-client";

function initializeAxios() {
    const jwt = localStorage.getItem("authToken");
    if (jwt) {
      setJwt(`${jwt}`);
    }
  }
export { initializeAxios }