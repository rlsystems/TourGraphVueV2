import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { toast } from "vue3-toastify";

export const useAccountStore = defineStore("account", {
  state: () => {
    return {
      currentUser: null
    };
  },
  getters: {
    user: (state) => state.currentUser,
    userFullName: (state) => state.currentUser.firstName + " " + state.currentUser.lastName,
    userBasic: (state) => state.currentUser.roleId === 'basic'
  },
  actions: {
    async getCurrentUser() {
      const response = await agent.get("/identity/profile");
      this.currentUser = response.data;
    },
    async updateCurrentUser(data) {
      const response = await agent.put("/identity/profile", data);
      if (!response.succeeded) {
        toast.error(response.messages[0]);
      } else {
        this.currentUser = response.data;
        toast.success("User updated");
      }
    },
    async updateProfileImage(formData) {
      const response = await agent.putFormData("/identity/profile-image", formData);
      if (!response.succeeded) {
        toast.error(response.messages[0]);
      } else {
        this.currentUser.imageUrl = response.data;
        toast.success("Profile image updated");
      }
    },
    async updatePassword(data) {
      const response = await agent.put("/identity/change-password", data);
      if (!response.succeeded) {
        toast.error(response.messages[0]);
      } else {
        toast.success("Password updated");
      }
    },
    // preferences - handled in layoutStore (dark mode & page size)
  },
});
