<template>
  <div>
    <b-badge v-for="promotion in props.departure.promotions" class="badge-outline-info-purple m-1 p-1" variant="text-warning">{{ promotion.name }}</b-badge>
    <b-badge v-if="props.departure.automationErrors" class="badge-outline-danger m-1 p-1" variant="text-danger">{{ props.departure.automationErrors }}</b-badge>

  </div>

</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["departure"]);

</script>
