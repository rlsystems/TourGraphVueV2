<script setup>
import {  computed } from "vue";
const props = defineProps(["targetItinerary"]);

const editItineraryLink = computed(() => {
  return { name: 'itinerary-edit', params: { itineraryId: props.targetItinerary.id }};
})
</script>

<template>
  <!-- Row button and Edit modal -->
  <router-link :to="editItineraryLink">
    <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
  </router-link>
</template>
