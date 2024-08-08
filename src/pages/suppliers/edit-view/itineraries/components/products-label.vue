<script setup>
import { computed } from "vue";

const props = defineProps(["itinerary"]);
</script>

<template>
  <!-- Link -->
  <router-link :to="{ name: 'itinerary-policies', params: { itineraryId: props.itinerary.id } }" v-for="itineraryProduct in props.itinerary?.itineraryProducts">
    <b-badge class="badge-outline-secondary product-badge" variant="text-secondary"> {{ itineraryProduct.productName }} </b-badge>
  </router-link>

  <router-link v-if="itinerary.itineraryProducts?.length == 0" :to="{ name: 'itinerary-configuration', params: { itineraryId: props.itinerary.id } }">
    <div class="text-danger" >No Products Assigned</div>
  </router-link>

</template>

<style lang="scss" scoped>
.product-badge {
  margin: 5px;
  padding: 5px;
}

</style>
