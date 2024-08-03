import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";


export const useRoomsStore = defineStore("rooms", {
  state: () => ({
    productRoomsList: [],
  }),
  getters: {
    productRooms: (state) => state.productRoomsList,
  },
  actions: {
    async getProductRooms(id) { 
      const response = await agent.get(`/rooms?productId=${id}`); 
      this.productRoomsList = response.data;
    },

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
        const response = await agent.put(`/rooms/${data.id}`, data);
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
        const response = await agent.delete(`/rooms/${id}`);
        if (response.succeeded) {
          toast.success("Room type deleted");
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
