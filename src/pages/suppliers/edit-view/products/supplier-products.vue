<script setup>
import { computed, ref, onMounted, watch } from "vue";
import ProductCard from "./components/product-card.vue";
import ProductModal from "@/pages/products/list-view/components/product-modal.vue";
import CountLabel from "@/components/count-label.vue";


import { useProductsStore } from "@/stores/productsStore";
const productsStore = useProductsStore();

import { useAccountStore } from "@/stores/_core/accountStore";
const accountStore = useAccountStore();


const loading = ref(true);
const props = defineProps(["supplierId"]);

const showModal = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await productsStore.getSupplierProducts(props.supplierId);
  loading.value = false;
});

// modal submit
const submitCreate = async (data) => {
  data.supplierId = props.supplierId;
  submitting.value = true;
  if (await productsStore.addProduct(data)) {
    await productsStore.getSupplierProducts(props.supplierId);
    showModal.value = false;
  }
  submitting.value = false;
};



</script>

<template>
  <!-- Top Row -->
  <b-row>
    <b-col class="d-flex justify-content-between align-items-center mb-3">
      <CountLabel title="Products" titleSingle="Product" :count="productsStore.productList?.length" :loading="loading"></CountLabel>
      <b-button variant="primary" @click="showModal = true" :disabled="accountStore.userBasic">New Product</b-button>
    </b-col>
  </b-row>

  <!-- Spinner and no itinerary found check -->
  <template v-if="!loading">
    <!-- Grid -->
    <div v-if="productsStore.productList" class="grid-layout">
      <ProductCard :product="product" v-for="product in productsStore.productList" :key="product.id" />
    </div>
    <p v-else class="text-center">No itineraries found</p>
  </template>
  <div v-else class="d-flex justify-content-center">
    <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
  </div>

  <!-- Modal -->
  <ProductModal v-if="showModal" title="Add New Product" :supplierId="props.supplierId" :saving="submitting" @proceed="submitCreate" @cancel="showModal = false" />
</template>

<style scoped lang="scss">
.grid-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
