import request from "./api";

export const buscarDashboard = async () => {
  return request("/dashboard");
}
