<script setup>
import {  computed } from "vue";
const props = defineProps(["targetSupplier"]);

const editSupplierLink = computed(() => {
  return { name: 'supplier-edit', params: { supplierId: props.targetSupplier.id }};
})
</script>

<template>
  <!-- Row button and Edit modal -->
  <router-link :to="editSupplierLink">
    <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
  </router-link>
</template>
