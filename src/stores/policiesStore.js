import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";

export const usePoliciesStore = defineStore("policies", {
  state: () => ({
    itineraryPoliciesList: [],
  }),
  getters: {
    itineraryPolicies: (state) => state.itineraryPoliciesList,
  },
  actions: {
    async getItineraryPolicies(id) { 
      const response = await agent.get(`/policies?itineraryId=${id}`); 
      this.itineraryPoliciesList = response.data;
    },

    // Policies
    async createPolicy(data) {
      try {
        const response = await agent.post("/policies", data);
        if (response.succeeded) {
          toast.success("New policy created");
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
    async updatePolicy(data) {
      try {
        const response = await agent.put(`/policies/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Policy updated");
          return response.data;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async deletePolicy(id) {
      try {
        const response = await agent.delete(`/policies/${id}`);
        if (response.succeeded) {
          toast.success("Policy deleted");
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

    // Rates
    async createRate(data) { 
      try {
        const response = await agent.post("/rates", data); // data: roomId, seasonId
        if (response.succeeded) {
          console.log('rate created');
          return response.data;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },

    async updateRate(data) { // trigger whenever change is detected in a rate field
      try {
        const response = await agent.put("/rates/", data);
        if (response.succeeded) {
          console.log('rate updated');
          return response.data;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },

    // Season Range    
    async createSeasonRange(data) { 
      try {
        const response = await agent.post("/seasonRanges", data); // years always ignored by server
        if (response.succeeded) {
          toast.success('Season range created');
          return response.data;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async updateSeasonRange(data) { 
      try {
        const response = await agent.put(`/seasonRanges/${data.id}`, data);
        if (response.succeeded) {
          toast.success('Season range updated');
          return response.data;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error);
        return false;
      }
    },
    async deleteSeasonRange(id) {
      try {
        const response = await agent.delete(`/seasonRanges/${id}`);
        if (response.succeeded) {
          toast.success("Season range deleted");
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
