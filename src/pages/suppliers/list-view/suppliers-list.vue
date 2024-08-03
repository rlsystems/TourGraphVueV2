<script setup>
import { onMounted, reactive, ref } from "vue";
import Layout from "@/components/layout/layout.vue";
import ServerTable from "@/components/tables/server-table.vue";
import { columns } from "./components/column-config.vue";
import SupplierModal from "./components/supplier-modal.vue";
import SupplierTableFilters from "./components/supplier-table-filters.vue";

import { useLayoutStore } from "@/stores/_core/layoutStore";
const layoutStore = useLayoutStore();

import { useSuppliersStore } from "@/stores/suppliersStore";
const suppliersStore = useSuppliersStore();

const showAddModal = ref(false);
const submitting = ref(false);
const initialLoad = ref(true);

onMounted(async () => {
  suppliersStore.currentPageMetaData = {
    pageNumber: 1,
    pageSize: layoutStore.pageSize,
    keyword: "",
    sorting: [],
  };
  await suppliersStore.getSuppliersPaginated();
  initialLoad.value = false;
});


const handleParamsChange = async (tableParams) => {
  
  if (!initialLoad.value) {
    suppliersStore.currentPageMetaData.pageNumber = tableParams.pageNumber; 
    suppliersStore.currentPageMetaData.pageSize = tableParams.pageSize; 
    suppliersStore.currentPageMetaData.sorting = tableParams.sorting; 
    await suppliersStore.getSuppliersPaginated();
  }
};


// modal submit
const submitCreate = async (data) => {
  submitting.value = true;
  if (await suppliersStore.addSupplier(data)) {
    showAddModal.value = false;
    suppliersStore.currentPageMetaData.pageNumber = 1;
    await suppliersStore.getSuppliersPaginated();
  }
  submitting.value = false;
};

const handleSearch = async (data) => {
  suppliersStore.currentPageMetaData.keyword = data.keyword;
  suppliersStore.currentPageMetaData.pageNumber = 1;
  await suppliersStore.getSuppliersPaginated();
};



</script>

<template>
  <Layout>
    <!-- Top Row -->
    <b-row>
      <b-col class="d-flex flex-row-reverse mb-3">
        <b-button variant="primary" @click="showAddModal = true">New Supplier</b-button>
      </b-col>
    </b-row>

    <!-- Main Row -->
    <b-row>
      <b-col>
        <ServerTable :data="suppliersStore.suppliersTable" :columns="columns" :loading="suppliersStore.tableLoading" :current-page-meta="suppliersStore.currentPageMeta" :table-pagination-meta="suppliersStore.paginationMeta" @table-params-change="handleParamsChange">
          <SupplierTableFilters @search="handleSearch" :loading="suppliersStore.tableLoading" />
        </ServerTable>
      </b-col>
    </b-row>
  </Layout>

  <!-- Modal (Add Supplier) -->
  <SupplierModal v-if="showAddModal" title="Add New Supplier" :saving="submitting" @proceed="submitCreate" @cancel="showAddModal = false" />
</template>
