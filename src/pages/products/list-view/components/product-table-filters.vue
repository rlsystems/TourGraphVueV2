<script setup>
import { onMounted, ref } from "vue";
const filterSupplierSelected = ref(null);
const filterSupplierOptions = ref(null);
import LoadingSelect from "@/components/loading-select.vue";
import { useSuppliersStore } from "@/stores/suppliersStore";
const suppliersStore = useSuppliersStore();
const loadingSuppliers = ref(false);


const props = defineProps(["loading"]);
const emit = defineEmits(["search"]);

const filterSearch = ref("");
onMounted(async () => {
  if (!suppliersStore.hasSuppliers) {
    loadingSuppliers.value = true;
    await suppliersStore.getSuppliers();
    loadingSuppliers.value = false;
  }
  filterSupplierOptions.value = suppliersStore.suppliersFull.map((obj) => ({
    value: obj.id,
    text: obj.name,
  }));
  filterSupplierOptions.value.unshift({
    value: null,
    text: "Any",
  });
  if (suppliersStore.supplierIdForFiltration) {  // select the selected supplierId in dropdown and run api call
    filterSupplierSelected.value = suppliersStore.supplierIdForFiltration;
    handleSearch();
  }
});


const handleSearch = () => {
  const filterData = {
    keyword: filterSearch.value,
    supplierId: filterSupplierSelected.value
  }

  emit('search', filterData)
};


</script>
<template>
  <!-- Filters -->
  <div class="d-flex align-items-end gap-2 flex-wrap">
    <div class="mb-2">
      <label for="searchInput" class="form-label">Search:</label>
      <input id="searchInput" type="text" placeholder="Search Products..." class="form-control" v-model="filterSearch" style="width: 200px" />
    </div>
    <div class="mb-2">
      <LoadingSelect v-model="filterSupplierSelected" id="filterSupplier" :loading="loadingSuppliers" :options="filterSupplierOptions" label="Supplier" style="width: 200px" />
    </div>
    <div class="mb-2">
      <button id="filter" type="button" class="btn btn-info" @click="handleSearch"  :disabled="props.loading">Filter</button>
    </div>
  </div>
</template>
