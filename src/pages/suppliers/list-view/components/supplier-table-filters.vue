<script setup>
import { ref } from "vue";

const props = defineProps(["loading"]);
const emit = defineEmits(["search"]);

const filterSearch = ref("");

const handleSearch = () => {
  const filterData = {
    keyword: filterSearch.value,
  }
  emit('search', filterData)
};


</script>
<template>
  <!-- Filters -->
  <div class="d-flex align-items-end gap-2 flex-wrap">
    <div class="mb-2">
      <label for="searchInput" class="form-label">Search:</label>
      <input id="searchInput" type="text" placeholder="Search Suppliers..." class="form-control" v-model="filterSearch" style="width: 200px" />
    </div>
    <div class="mb-2">
      <button id="filter" type="button" class="btn btn-info" @click="handleSearch"  :disabled="props.loading">Filter</button>
    </div>
  </div>
</template>
