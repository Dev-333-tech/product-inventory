import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getProducts = (params) => API.get("/products", { params });
export const createProduct = (data) => API.post("/products", data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getCategories = () => API.get("/products/categories");
