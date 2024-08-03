import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import BootstrapVueNext from "bootstrap-vue-next";
import VueApexCharts from "vue3-apexcharts";

import Vue3Toasity from "vue3-toastify";
import { toast } from "vue3-toastify";

import jQuery from "jquery"; // some plugins still require jQuery -- range-slider, datepicker, dragula.
window.$ = window.jQuery = jQuery;

import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "vue3-toastify/dist/index.css";
import "nprogress/nprogress.css";
import "simplebar-vue/dist/simplebar.min.css";
import "vue-multiselect/dist/vue-multiselect.css";

import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "@vuepic/vue-datepicker/dist/main.css";

import "@/assets/scss/nanite-theme.scss";
import "@/assets/scss/icons.scss";

const app = createApp(App);
app.config.globalProperties.filters = {
  formatPlural(count, single, plural) {
    if (count == 1) {
      return count + " " + single;
    } else {
      return count + " " + plural;
    }
  },
  formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  },
  formatOccupancy(value) {
    switch (value) {
      case 1:
        return "Single";
      case 2:
        return "Double";
      case 3:
        return "Triple";
      case 4:
        return "Quad";
      default:
        if (value > 4) {
          return value + "-Pax";
        } else {
          return "Unknown";
        }
    }
  },
  formatDate(value, type) {
    if (value.slice(-1) !== "Z") { // fix the UTC format to add Z for Zulu
      value += "Z";
    }

    const dateValue = new Date(value);
    switch (type) {
      case "automation":
        return dateValue.toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit", // Use "2-digit" for leading zero
          year: "numeric",
          hour: "numeric",
          minute: "2-digit", // Use "2-digit" for leading zero
          hour12: true, // Display in 12-hour format with "am/pm"
        });
      case "departure":
        return dateValue.toLocaleDateString("en-US", {
          timeZone: "UTC", // must specify UTC on DateOnly types
          weekday: "long",
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
      case "range":
        return dateValue.toLocaleDateString("en-US", {
          timeZone: "UTC", // must specify UTC on DateOnly types
          month: "short",
          day: "2-digit",
        });
    }
  },
};

app.use(createPinia());
app.use(router);
app.use(BootstrapVueNext);
app.use(VueApexCharts);
app.use(Vue3Toasity, {
  autoClose: 2500,
  theme: "colored",
  position: toast.POSITION.BOTTOM_LEFT,
});
app.mount("#app");
