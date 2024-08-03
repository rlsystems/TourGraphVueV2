<script setup>
import PageNavigationTop from "@/components/page-navigation-top.vue";
import Layout from "@/components/layout/layout.vue";
import { menuOptions } from "./menu-options.js";
import {  ref, onMounted, onUnmounted, computed } from "vue";


import { useRoute } from "vue-router";
const route = useRoute(); // difference between router and route

import { useProductsStore } from "@/stores/productsStore";
const productsStore = useProductsStore();

// refs
const initialLoad = ref(true);
const props = defineProps(["productId"]);

const parentLink = computed(() => {
  return { name: "supplier-products", params: { supplierId: productsStore.product.supplierId } };
});

// initialize
onMounted(async () => {
  await productsStore.getProduct(props.productId);
  initialLoad.value = false;
});

onUnmounted(() => {
  productsStore.currentProduct = {}  // resetting current product to avoid pre-filled data in fields
})
</script>

<template>
  <Layout>
    <PageNavigationTop :activeTab="route.meta.activeTab"  :menu-options="menuOptions" :title="productsStore.product.name" :subParentName="productsStore.product.supplierName" :subParentLink="parentLink" :loading="initialLoad" />
    <router-view></router-view>
  </Layout>
</template>

// this product-edit component should have the top section, reusable PageNavigationTop, and content displayed via router child view // left side of top section should be Title (product), Subtitle (supplier) and sometimes the subtitle will be a link to another view // right side should be navigation for the child views that appear below // child views: Product Configuration, Itineraries, Rooms // the child Configuration form should populate using the same data that was loaded for this product-edit form // also, if the list of suppliers should use loading-select and load the full supplier list // I'm having trouble getting the form to load initially, with data, and waiting on suppliers, and using the loading-select... etc. // Ideally things should load in parellel when possible, and efficiently as possible // the child Itineraries component (product-itineraries) itienraries for this product are displayed in a grid view (list already filtered by product id) // creating a new itinerary should be handled by modal (already created) // editing an itinerary (clicking the edit button on the itinerary card) should take the user to a completly different view, itineraries/itinerary-edit, which like product-edit, contains a top nav and child elements: Itinerary Configuration, Dates, Rates // these itinerary-cards will have 3 buttons, eventually each button should use count-display to indicate the count: // edit should go to itineraries/itinerary-edit to the Configuration child component // dates should go to itineraries/itinerary-edit to the Dates child component // rates should go to itineraries/itinerary-edit to the Rates child component
