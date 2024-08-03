<script setup>
import PolicyLabel from "./policy-label.vue";
import AutomationWidget from "./automation-widget.vue";

import CountDisplay from "@/components/count-display.vue";

import ResourceCard from "@/components/resource-card.vue";
import IdBadge from "@/components/id-badge.vue";

import { computed } from "vue";

const props = defineProps(["itinerary"]);



const editItineraryLink = computed(() => {
  return { name: "itinerary-edit", params: { itineraryId: props.itinerary.id } };
});

const datesItineraryLink = computed(() => {
  return { name: "itinerary-departures", params: { itineraryId: props.itinerary.id } };
});

const policiesItineraryLink = computed(() => {
  return { name: "itinerary-policies", params: { itineraryId: props.itinerary.id } };
});






</script>

<template>
  <ResourceCard>
    <template v-slot:default>
      <!-- Title / Stats -->
      <div class="d-flex flex-column">
        <strong class="text-dark">{{ props.itinerary.name }}</strong>
        <small>{{ props.itinerary.lengthDisplay }}</small>
        <div class="mt-1">Wordpress Id:<IdBadge :display="props.itinerary.wpId" class="m-1" :isLink="true"></IdBadge></div>

        <b-button class="related-button text-info" v-if="props.itinerary.relatedItineraries.length > 0" variant="light" :id="props.itinerary.id"><i class="ri-link"></i>Related Itineraries</b-button>
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
      <!-- Edit -->
      <router-link :to="editItineraryLink">

        <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
      </router-link>
    </template>
    <!-- Stats -->
    <template v-slot:stats>
     <AutomationWidget :itinerary="props.itinerary"></AutomationWidget>
    </template>
    <!-- Bottom -->
    <template v-slot:bottom>
      <CountDisplay class="mt-2" title="Dates" titleSingle="Date" :count="props.itinerary.departures.length" :link="datesItineraryLink" minWidth="100%"></CountDisplay>
      <PolicyLabel class="mt-2" :count="props.itinerary.policies.length" :ratesMissing="props.itinerary.ratesMissing" :link="policiesItineraryLink" minWidth="100%"></PolicyLabel>
    </template>
  </ResourceCard>

</template>

<style scoped lang="scss">
.card {
  width: 350px;
  margin-bottom: 0;
}
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
.card-body {
  display: grid;
  grid-template-columns: 1fr min-content;
  row-gap: 1.5rem;
}
</style>
