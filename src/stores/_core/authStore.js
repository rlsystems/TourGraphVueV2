import { defineStore } from "pinia";
import agent from "@/api/agent.js";
import { useStorage } from "@vueuse/core";
import router from "@/router";
import { toast } from "vue3-toastify";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentToken: useStorage("token", null),
    currentRefreshToken: useStorage("refreshToken", null),

  }),

  getters: {
    token: (state) => state.currentToken,
    refreshToken: (state) => state.currentRefreshToken,

  },

  actions: {
    async login(formData) {
      const email = formData.email;
      const password = formData.password;
      const response = await agent.post("/tokens", { email, password }); // fix error handling
      if (!response.succeeded) {
        toast.error("Login failed");
      } else {
        this.currentToken = response.data.token;
        this.currentRefreshToken = response.data.refreshToken;

        toast.success("Login success");
        return true;
      }
    },
    async getRefreshToken() {
      const response = await agent.get("/tokens/" + this.currentRefreshToken);
      if (!response.succeeded) {
        this.logout();
      } else {
        this.currentToken = response.data.token;
        this.currentRefreshToken = response.data.refreshToken;
        console.log('refresh token success')
        return true;
      }
    },
    async forgotPassword(formData) {
      const email = formData.email;
      const response = await agent.post("/identity/forgot-password", { email });
      if (!response.succeeded) {
        toast.error(response.messages[0]);
      } else {
        toast.success("Sent password reset to email");
        return true;
      }
    },
    async resetPassword(formData) {
      const response = await agent.post("/identity/reset-password", formData);
      if (!response.succeeded) {
        toast.error(response.messages[0]);
      } else {
        toast.success("Password reset success");
        return true;
      }
    },
    logout() {
      this.currentToken = null;
      this.currentRefreshToken = null;

      return router.push("/");
    },
  },
});
