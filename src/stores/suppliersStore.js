import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";
import router from "@/router";

export const useSuppliersStore = defineStore("suppliers", {
  state: () => ({
    supplierListTable: {}, // rename to tableSupplierList
    supplierListFull: {}, // rename to suppliersList (this is the full list)
    paginationMetaData: {}, // reponse meta from server
    currentPageMetaData: {}, // current meta - used to build request
    tableLoadingState: false,
    selectedSupplierId: '',
    currentSupplier: {}
  }),

  getters: {
    hasSuppliers: (state) => state.supplierListFull.length > 0,
    supplier: (state) => state.currentSupplier,
    suppliersFull: (state) => state.supplierListFull,
    suppliersTable: (state) => state.supplierListTable,
    paginationMeta: (state) => state.paginationMetaData,
    currentPageMeta: (state) => state.currentPageMetaData,
    tableLoading: (state) => state.tableLoadingState,
    supplierIdForFiltration: (state) => state.selectedSupplierId
  },
  actions: {
    async getSupplier(id) {
      const response = await agent.get(`/suppliers/${id}`); // get full list
      this.currentSupplier = response.data;
    },
    async getSuppliers() {
      const response = await agent.get("/suppliers"); // get full list
      this.supplierListFull = response.data;
    },
    async getSuppliersPaginated() {
      this.tableLoadingState = true;
      const response = await agent.post("/suppliers/suppliers-paginated", this.currentPageMeta); // get server-paginated list
      this.tableLoadingState = false;
      this.supplierListTable = response.data;
      delete response.data;
      this.paginationMetaData = response;
    },
    async addSupplier(data) {
      try {
        const response = await agent.post("/suppliers", data);
        if (response.succeeded) {
          toast.success("New supplier added");
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
    async updateSupplier(data) {
      try {
        const response = await agent.put(`/suppliers/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Supplier updated");
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
    async deleteSupplier(id) {
      try {
        const response = await agent.delete(`/suppliers/${id}`);
        if (response.succeeded) {
          toast.success("Supplier deleted");
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
