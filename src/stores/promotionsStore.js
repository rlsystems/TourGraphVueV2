import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";


export const usePromotionsStore = defineStore("promotions", {
  state: () => ({
    supplierPromotionsList: [],
  }),
  getters: {
    supplierPromotions: (state) => state.supplierPromotionsList,
  },
  actions: {
    async getSupplierPromotions(id) { 
      const response = await agent.get(`/promotions?supplierId=${id}`); 
      this.supplierPromotionsList = response.data;
    },

    async createPromotion(data) {
      try {
        const response = await agent.post("/promotions", data);
        if (response.succeeded) {
          toast.success("New promotion added");
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
    async updatePromotion(data) {
      try {
        const response = await agent.put(`/promotions/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Promotion updated");
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
    async deletePromotion(id) {
      try {
        const response = await agent.delete(`/promotions/${id}`);
        if (response.succeeded) {
          toast.success("Promotion deleted");
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
