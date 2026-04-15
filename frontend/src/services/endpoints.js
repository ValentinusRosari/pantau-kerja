import api from "./api";

export const authService = {
  login: (username, password) => api.post("/auth/login", { username, password }),

  getProfile: () => api.get("/auth/profile"),
};

export const employeeService = {
  getAll: (params) => api.get("/employees", { params }),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.patch(`/employees/${id}`, data),
  remove: (id) => api.delete(`/employees/${id}`),
};

export const attendanceService = {
  clockIn: (formData) =>
    api.post("/attendances/clock-in", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  clockOut: (formData) =>
    api.post("/attendances/clock-out", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getTodayStatus: () => api.get("/attendances/today"),

  getMyHistory: (params) => api.get("/attendances/my", { params }),

  getAll: (params) => api.get("/attendances", { params }),

  getOne: (id) => api.get(`/attendances/${id}`),
};
