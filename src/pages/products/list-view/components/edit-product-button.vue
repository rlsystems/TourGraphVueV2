<script setup>
import {  computed } from "vue";
const props = defineProps(["targetProduct"]);

const editProductLink = computed(() => {
  return { name: 'product-edit', params: { productId: props.targetProduct.id }};
})
</script>

<template>
  <!-- Row button and Edit modal -->
  <router-link :to="editProductLink">
    <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
  </router-link>
</template>
