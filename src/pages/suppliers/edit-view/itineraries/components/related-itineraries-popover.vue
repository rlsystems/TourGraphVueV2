<script setup>
const props = defineProps(["itinerary"]);
</script>

<template>
  <!-- Title / Stats -->
  <div class="d-flex flex-column">
    <b-button class="related-button text-info" v-if="props.itinerary.relatedItineraries.length > 0" variant="light" :id="props.itinerary.id">{{ props.itinerary.relatedItineraries.length }} Related Itineraries</b-button>
    <b-popover v-if="props.itinerary.relatedItineraries.length > 0" :target="props.itinerary.id" placement="right">
      <ul class="mb-0">
        <li v-for="relatedItinerary in props.itinerary.relatedItineraries" class="related text-info">
          <router-link :to="{ name: 'itinerary-edit', params: { itineraryId: relatedItinerary.id } }">
            {{ relatedItinerary.name }}
          </router-link>
        </li>
      </ul>
    </b-popover>
  </div>
</template>

<style scoped lang="scss">
.related-button {
  width: max-content;
  padding: 0px;
  padding-top: 0px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  box-shadow: none;
  &:hover {
    border-color: transparent;
  }
}
</style>
