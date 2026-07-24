import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const Subscription = async ({
  page,
  limit,
  search,
  sortType,
  status,
}) => {
  const response = await api.get("/v1/subscription/admin", {
    params: {
      page,
      limit,
      isDeleted: false,
      searchByInvoiceNumber: search || undefined,
      sort: sortType,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const getUserBills = async ({
  page,
  limit,
  search,
  sortType,
  status,
}) => {
  const response = await api.get("/v1/order-invoice/admin", {
    params: {
      page,
      limit,
      isDeleted: false,
      search: search || undefined,
      sort: sortType,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const order = async ({ page, limit, search, sortType, status }) => {
  const response = await api.get("/v1/order/all-orders/admin", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const getManagers = async ({
  page,
  limit,
  search,
  sortType,
  status,
}) => {
  const response = await api.get("/v1/users", {
    params: {
      page,
      limit,
      role: "ADMIN",
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,

      status: status !== "all" ? status : undefined,
    },
  });

  return response.data;
};

export const getClients = async ({ page, limit, search, sortType, status }) => {
  const response = await api.get("/v1/users", {
    params: {
      page,
      limit,
      role: "CLIENT",
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,

      status: status !== "all" ? status : undefined,
    },
  });

  return response.data;
};

export const vehicleBrand = async ({
  page,
  limit,
  search,
  sortType,
  status,
}) => {
  const response = await api.get("/v1/vehicle-brands", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const vehicleBrandModel = async ({
  page,
  limit,
  search,
  sortType,
  status,
}) => {
  const response = await api.get("v1/vehicle-brand-models/admin", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const color = async ({ page, limit, search, sortType, status }) => {
  const response = await api.get("v1/color", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get("/v1/vehicle-brands");
  return response.data;
};

export const createBrands = async (formData) => {
  const response = await api.post("/v1/vehicle-brands/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createVehicleBrands = async (data) => {
  const response = await api.post("/v1/vehicle-brand-models/create", data);
  return response.data;
};

export const registerUser = async (userData) => {
  const formData = new FormData();

  formData.append("first_name", userData.first_name);
  formData.append("last_name", userData.last_name);
  formData.append("phone", userData.phone);
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("role", userData.role);

  // Optional fields
  formData.append("off_days", "");
  formData.append("start_latitude", "");
  formData.append("start_longitude", "");
  formData.append("in_active_start_date", "");
  formData.append("in_active_end_date", "");

  // Avatar (only if selected)
  if (userData.avatarFile) {
    formData.append("avatarFile", userData.avatarFile);
  }

  const response = await api.post("/v1/auth/register", formData);

  return response.data;
};

export const baqu = async ({ page, limit, search, sortType, status }) => {
  const response = await api.get("/v1/package/all-package?all=true", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const service_gift = async () => {
  const response = await api.get("/v1/service/all-service");
  return response.data;
};

export const add_gift = async (data) => {
  const response = await api.post("/v1/gift/", data);
  return response.data;
};

export const display_gifts = async (page, limit, search, sortType, status) => {
  const response = await api.get("/v1/gift/all-gifts/admin", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
};

export const points = async(page, limit, search, sortType, status) => {
  const response = await api.get("/v1/point/user", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
}

export const admin_points = async() => {
  const response = await api.get("/v1/point/admin-points-data");
  return response.data;
}

export const sms = async(page, limit, search, sortType, status) => {
  const response = await api.get("/v1/sms", {
    params: {
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
}

export const getOrderInvoice = async (id) => {
  const response = await api.get(`/v1/order-invoice/${id}/get-order-invoice`);
  return response.data;
};

export const downloadInvoice = async (id) => {
  const response = await api.get(`/v1/order-invoice/${id}/download`);
  return response.data;
};

export const bikers_points = async(page, limit, search, sortType, status) => {
  const response = await api.get("/v1/users", {
    params: {
      role: "BIKER",
      page,
      limit,
      search: search || undefined,
      sort: sortType !== "automatic" ? sortType : undefined,
      status: status !== "all" ? status : undefined,
    },
  });
  return response.data;
}

export default api;