<script setup>
import Layout from "@/components/layout/layout.vue";
import ServerTable from "@/components/tables/server-table.vue";
import ProductModal from "./components/product-modal.vue";
import ProductTableFilters from "./components/product-table-filters.vue";
import { columns } from "./components/column-config.vue";
import { onMounted, ref } from "vue";

import { useLayoutStore } from "@/stores/_core/layoutStore";
const layoutStore = useLayoutStore();

import { useProductsStore } from "@/stores/productsStore";
const productsStore = useProductsStore();

import {useSuppliersStore} from "@/stores/suppliersStore.js";
const supplierStore = useSuppliersStore();

const showAddModal = ref(false);
const initialLoad = ref(true);
const submitting = ref(false);

onMounted(async () => {
  productsStore.currentPageMetaData = { // rename to tableMetaData
    pageNumber: 1,
    pageSize: layoutStore.pageSize,
    keyword: "",
    supplierId: null,
    sorting: [],
  };
  if (!supplierStore.supplierIdForFiltration) {   // check for preventing duplicate api calls when supplierId is selected
    await productsStore.getProductsPaginated();
  }
  initialLoad.value = false;
});

const handleParamsChange = async (tableParams) => { // rename to handleTableMetaChange
  if (!initialLoad.value) {
    productsStore.currentPageMetaData.pageNumber = tableParams.pageNumber;
    productsStore.currentPageMetaData.pageSize = tableParams.pageSize;
    productsStore.currentPageMetaData.sorting = tableParams.sorting;
    await productsStore.getProductsPaginated();
  }
};

// modal submit
const submitCreate = async (data) => {  // rename to submitModalCreate
  submitting.value = true;
  if (await productsStore.addProduct(data)) {
    showAddModal.value = false;
    productsStore.currentPageMetaData.keyword = "";
    productsStore.currentPageMetaData.supplierId = null;
    productsStore.currentPageMetaData.pageNumber = 1;
    await productsStore.getProductsPaginated();
  }
  submitting.value = false;
};

const handleSearch = async (data) => {
  productsStore.currentPageMetaData.keyword = data.keyword;
  productsStore.currentPageMetaData.supplierId = data.supplierId;
  productsStore.currentPageMetaData.pageNumber = 1;
  await productsStore.getProductsPaginated();
};
</script>

<template>
  <Layout>
    <!-- Top Row -->
    <b-row>
      <b-col class="d-flex flex-row-reverse mb-3">
        <b-button variant="primary" @click="showAddModal = true">New Product</b-button>
      </b-col>
    </b-row>

    <!-- Main Row -->
    <b-row>
      <b-col>
        <ServerTable
          :data="productsStore.products"
          :columns="columns"
          :loading="productsStore.tableLoading"
          :current-page-meta="productsStore.currentPageMeta"
          :table-pagination-meta="productsStore.paginationMeta"
          @table-params-change="handleParamsChange"
        >
          <ProductTableFilters
            @search="handleSearch"
            :loading="productsStore.tableLoading"
          />
        </ServerTable>
      </b-col>
    </b-row>
  </Layout>

  <!-- Modal (Add Product) -->
  <ProductModal
    v-if="showAddModal"
    title="Add New Product"
    :saving="submitting"
    @proceed="submitCreate"
    @cancel="showAddModal = false"
  />
</template>
