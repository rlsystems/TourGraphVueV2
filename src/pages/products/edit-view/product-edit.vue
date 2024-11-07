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
    <PageNavigationTop :activeTab="route.meta.activeTab"  :menu-options="menuOptions" :title="productsStore.product.name" :parentName="productsStore.product.supplierName" :parentLink="parentLink" :loading="initialLoad" />
    <router-view></router-view>
  </Layout>
</template>
