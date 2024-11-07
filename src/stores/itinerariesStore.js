import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";

export const useItinerariesStore = defineStore("itineraries", {
  state: () => ({
    itineraryDeparturesList: [],
    supplierItinerariesList: [],
    currentItinerary: {},
    currentAppSettings: {},
  }),

  getters: {
    itineraryDepartures: (state) => state.itineraryDeparturesList,
    supplierItineraries: (state) => state.supplierItinerariesList,
    itinerary: (state) => state.currentItinerary,
    appSettings: (state) => state.currentAppSettings,
  },
  actions: {
    async getItinerary(id) {
      const response = await agent.get(`/itineraries/${id}`);
      this.currentItinerary = response.data;
    },
    async getSupplierItineraries(id) {
      const response = await agent.get(`/itineraries?supplierId=${id}`);
      this.supplierItinerariesList = response.data;
    },

    async runAutomation(id) {
      try {
        const response = await agent.post(`/automations/${id}`); // returns an automationResponse
        if (response.succeeded && response.data.runSucceeded) {
          const updatedItinerary = { ...this.currentItinerary };
          updatedItinerary["lastRun"] = response.data.lastRun;
          updatedItinerary["recordsChanged"] = response.data.recordsChanged;
          updatedItinerary["runSucceeded"] = true;
          this.currentItinerary = updatedItinerary;
          toast.success("Automation completed");
          return response.data.lastRun;
        } else {
          const updatedItinerary = { ...this.currentItinerary };
          updatedItinerary["lastRun"] = response.data.lastRun;
          updatedItinerary["recordsChanged"] = response.data.recordsChanged;
          updatedItinerary["runSucceeded"] = false;
          this.currentItinerary = updatedItinerary;
          toast.error("Automation failed");
          return false;
        }
      } catch (error) {
        const updatedItinerary = { ...this.currentItinerary };
        updatedItinerary["lastRun"] = new Date();
        updatedItinerary["recordsChanged"] = 0;
        updatedItinerary["runSucceeded"] = false;
        this.currentItinerary = updatedItinerary;

        toast.error(error.message);

        return false;
      }
    },
    // Departures
    async getCronSchedule() {
      const response = await agent.get(`/itineraries/cron-schedule`);
      this.currentAppSettings = response.data;
    },
    async updateCronSchedule(data) {
      try {
        const response = await agent.post(`/itineraries/update-cron`, data);
        if (response.succeeded) {
          toast.success("Cron schedule updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async createItinerary(data) {
      try {
        const response = await agent.post("/itineraries", data);
        if (response.succeeded) {
          toast.success("New itinerary added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async updateItinerary(data) {
      try {
        const response = await agent.put(`/itineraries/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Itinerary updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async updateAutomationSettings(data) {
      try {
        const response = await agent.put(`/itineraries/automation-settings/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Automation settings updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async deleteItinerary(id) {
      try {
        const response = await agent.delete(`/itineraries/${id}`);
        if (response.succeeded) {
          toast.success("Itinerary deleted");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);
        return false;
      }
    },
    //Season
    async createSeason(data) {
      try {
        const response = await agent.post("/seasons", data);
        if (response.succeeded) {
          toast.success("New season added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async updateSeason(data) {
      try {
        const response = await agent.put(`/seasons/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Season updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async deleteSeason(id) {
      try {
        const response = await agent.delete(`/seasons/${id}`);
        if (response.succeeded) {
          toast.success("Season deleted");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    //Itinerary Product
    async createItineraryProduct(data) {
      try {
        const response = await agent.post("/itineraries/itinerary-product", data);
        if (response.succeeded) {
          toast.success("Product added to itinerary");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async deleteItineraryProduct(id) {
      try {
        const response = await agent.delete(`/itineraries/itinerary-product/${id}`);
        if (response.succeeded) {
          toast.success("Product removed from itinerary");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },

    // Departures
    async getDepartures(id) {
      const response = await agent.get(`/departures?itineraryId=${id}`);
      this.itineraryDeparturesList = response.data;
    },
    async createDeparture(data) {
      try {
        const response = await agent.post("/departures", data);
        if (response.succeeded) {
          toast.success("New departure added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async updateDeparture(data) {
      try {
        const response = await agent.put(`/departures/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Departure updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async deleteDeparture(id) {
      try {
        const response = await agent.delete(`/departures/${id}`);
        if (response.succeeded) {
          toast.success("Departure deleted");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async createExplicitRate(data) {
      try {
        const response = await agent.post("/explicitRates", data);
        if (response.succeeded) {
          toast.success("New explicit rate added");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
    async updateExplicitRate(data) {
      try {
        const response = await agent.put(`/explicitRates/${data.id}`, data);
        if (response.succeeded) {
          toast.success("Explicit rate updated");
          return true;
        } else {
          toast.error(response.messages[0]);
          return false;
        }
      } catch (error) {
        toast.error(error.message);

        return false;
      }
    },
  },
});
