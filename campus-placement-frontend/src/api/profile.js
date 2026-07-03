import api from "./axios";

export const getMyStudent = async () => {
  const { data } = await api.get("/student/me");
  return data;
};

export const getMyCompany = async () => {
  const { data } = await api.get("/company/me");
  return data;
};