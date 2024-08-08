<script setup>
import PageNavigationTop from "@/components/page-navigation-top.vue";
import Layout from "@/components/layout/layout.vue"; // move layout to components
import { menuOptions } from "./menu-options.js";

import { computed, ref, onMounted, onUnmounted } from "vue";

import { useRoute } from "vue-router";
const route = useRoute();

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

// refs
const initialLoad = ref(true);
const props = defineProps(["itineraryId"]);

const parentLink = computed(() => {
  return { name: "supplier-itineraries", params: { supplierId: itinerariesStore.itinerary.supplierId } };
});



const itineraryTitle = computed(() => {
  return `${itinerariesStore.itinerary.name} (${itinerariesStore.itinerary.lengthInNights} Night)`;
});

// initialize
onMounted(async () => {
  await itinerariesStore.getItinerary(props.itineraryId);
  initialLoad.value = false;
});

onUnmounted(() => {
  itinerariesStore.currentItinerary = {}; // resetting current itinerary to avoid pre-filled data in fields
});
</script>

<template>
  <Layout>
    <PageNavigationTop :activeTab="route.meta.activeTab" :menu-options="menuOptions" :title="itineraryTitle" :parentName="itinerariesStore.itinerary.supplierName" :parentLink="parentLink" :loading="initialLoad" />
    <router-view></router-view>
  </Layout>
</template>
