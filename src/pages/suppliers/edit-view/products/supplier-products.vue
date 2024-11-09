<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { columns } from "@/pages/products/list-view/components/column-config.vue";
import ProductModal from "@/pages/products/list-view/components/product-modal.vue";
import CountLabel from "@/components/count-label.vue";
import ClientTable from "@/components/tables/client-table.vue";


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
  console.log(productsStore.productList);
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

  <!-- Main Row  -->
  <b-row>
    <b-col>
      <!-- Table -->
      <ClientTable :data="productsStore.productList" :columns="columns" :loading="loading" filterPlaceholder="Search Itineraries..."></ClientTable>
    </b-col>
  </b-row>
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
