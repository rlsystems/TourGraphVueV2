<script setup>
import PageNavigationTop from "@/components/page-navigation-top.vue";
import Layout from "@/components/layout/layout.vue";
import { menuOptions } from "./menu-options.js";
import {  ref, onMounted, onUnmounted } from "vue";


import { useRoute } from "vue-router";
const route = useRoute(); // difference between router and route

import { useSuppliersStore } from "@/stores/suppliersStore";
const suppliersStore = useSuppliersStore();

// refs
const initialLoad = ref(true);
const props = defineProps(["supplierId"]);

// initialize
onMounted(async () => {
  await suppliersStore.getSupplier(props.supplierId);
  initialLoad.value = false;
});

onUnmounted(() => {
  suppliersStore.currentSupplier = {}  // resetting current supplier to avoid pre-filled data in fields
})
</script>

<template>
  <Layout>
    <PageNavigationTop :activeTab="route.meta.activeTab" baseUrl="suppliers" :menu-options="menuOptions" :baseResource="props.supplierId" :title="suppliersStore.supplier.name" :subtitle="suppliersStore.supplier.supplierName" :parentResource="null" :loading="initialLoad" />
    <router-view></router-view>
  </Layout>
</template>

