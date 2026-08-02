import api from "../lib/axios";

// Dashboard
export const getDashboardStats = () => api.get("/dashboard/stats").then((r) => r.data.data);
export const getRecentActivities = () => api.get("/dashboard/activities").then((r) => r.data.data);
export const getMonthlyRevenue = () => api.get("/dashboard/revenue").then((r) => r.data.data);

// Customers
export const getCustomers = (params) => api.get("/customers", { params }).then((r) => r.data);
export const getCustomerById = (id) => api.get(`/customers/${id}`).then((r) => r.data.data);
export const createCustomer = (data) => api.post("/customers", data).then((r) => r.data.data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data).then((r) => r.data.data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`).then((r) => r.data);

// Policies
export const getPolicies = (params) => api.get("/policies", { params }).then((r) => r.data);
export const getPolicyById = (id) => api.get(`/policies/${id}`).then((r) => r.data.data);
export const createPolicy = (data) => api.post("/policies", data).then((r) => r.data.data);
export const updatePolicy = (id, data) => api.put(`/policies/${id}`, data).then((r) => r.data.data);
export const deletePolicy = (id) => api.delete(`/policies/${id}`).then((r) => r.data);

// Claims
export const getClaims = (params) => api.get("/claims", { params }).then((r) => r.data);
export const getClaimById = (id) => api.get(`/claims/${id}`).then((r) => r.data.data);
export const submitClaim = (data) => api.post("/claims", data).then((r) => r.data.data);
export const updateClaimStatus = (id, data) => api.patch(`/claims/${id}/status`, data).then((r) => r.data.data);

// Premiums
export const getPaymentsByPolicy = (policyId, params) => api.get(`/premiums/policy/${policyId}`, { params }).then((r) => r.data);
export const getOverduePayments = (params) => api.get("/premiums/overdue", { params }).then((r) => r.data);
export const recordPayment = (data) => api.post("/premiums", data).then((r) => r.data.data);
export const updatePaymentStatus = (id, data) => api.patch(`/premiums/${id}/status`, data).then((r) => r.data.data);

// Reports
export const getPremiumReport = (params) => api.get("/reports/premiums", { params }).then((r) => r.data.data);
export const getClaimsReport = (params) => api.get("/reports/claims", { params }).then((r) => r.data.data);
export const getCustomerGrowthReport = () => api.get("/reports/customers/growth").then((r) => r.data.data);
