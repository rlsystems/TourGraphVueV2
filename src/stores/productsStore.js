import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";


export const useProductsStore = defineStore("products", {
  state: () => ({
    productList: {},
    supplierProductList: {},
    paginationMetaData: {}, // reponse meta from server
    currentPageMetaData: {}, // current meta - used to build request
    tableLoadingState: false,
    currentProduct: {}
  }),

  getters: {
    hasProducts: (state) => state.productList.length > 0,

    product: (state) => state.currentProduct,
    products: (state) => state.productList,
    paginationMeta: (state) => state.paginationMetaData,
    currentPageMeta: (state) => state.currentPageMetaData,
    tableLoading: (state) => state.tableLoadingState,

  },
  actions: {
    async getProduct(id) {
      const response = await agent.get(`/products/${id}`); // get full list
      this.currentProduct = response.data;
    },
    async getProducts() {
      const response = await agent.get("/products"); // get full list
      this.productList = response.data;
    },
    async getSupplierProducts(id) { 
      const response = await agent.get(`/products?supplierId=${id}`); 
      this.productList = response.data;
    },
    async getProductsPaginated() {
      this.tableLoadingState = true;
      const response = await agent.post("/products/products-paginated", this.currentPageMeta); // get server-paginated list
      this.tableLoadingState = false;
      this.productList = response.data;
      delete response.data;
      this.paginationMetaData = response;
    },
    async addProduct(data) {
      try {
        const response = await agent.post("/products", data); // products api only returns the guid
        if (response.succeeded) {
          toast.success("New product added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async updateProduct(data) {
      try {
        const response = await agent.put(`/products/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Product updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async deleteProduct(id) {
      try {
        const response = await agent.delete(`/products/${id}`);
        if (response.succeeded) {
          toast.success("Product deleted");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async getRooms(id) { // i would rather get the rooms from the product 
      const response = await agent.get(`/rooms?productId=${id}`); 
      this.currentProduct.rooms = response.data;
    },
    // Rooms
    async createRoom(data) {
      try {
        const response = await agent.post("/rooms", data);
        if (response.succeeded) {
          toast.success("New room type added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async updateRoom(data) {
      try {
        const response = await agent.put("/rooms", data);
        if (response.succeeded) {
          toast.success("Room type updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async deleteRoom(id) {
      try {
        const response = await agent.delete(`/rooms${id}`, data);
        if (response.succeeded) {
          toast.success("Room type delete");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
  },
});
