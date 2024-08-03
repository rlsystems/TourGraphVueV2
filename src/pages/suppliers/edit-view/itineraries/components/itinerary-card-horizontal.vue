<script setup>
import PolicyLabel from "./policy-label.vue";
import AutomationWidget from "./automation-widget.vue";
import CountDisplay from "@/components/count-display.vue";
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

<!-- Edit button / modal -->
<template>
  <div class="card itinerary">
    <div class="itinerary__content">
      <div class="itinerary__content__column">
        <strong class="text-dark">{{ props.itinerary.name }}</strong>
        <small>{{ props.itinerary.lengthDisplay }}</small>
      </div>
      <div class="itinerary__content__column">
        <b-button class="related-button text-info" v-if="props.itinerary.relatedItineraries.length > 0" variant="light" :id="props.itinerary.id">Related Itineraries<i class="ri-link"></i></b-button>
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
      <div class="itinerary__content__column">
        <IdBadge :display="props.itinerary.wpId" class="m-1" :isLink="true"></IdBadge>
      </div>
      <div class="itinerary__content__column">
        <AutomationWidget :itinerary="props.itinerary"></AutomationWidget>
      </div>
      <div class="itinerary__content__column">
        <CountDisplay title="Dates" titleSingle="Date" :count="props.itinerary.departures.length" :link="datesItineraryLink" minWidth="100%"></CountDisplay>
      </div>
      <div class="itinerary__content__column">
        <PolicyLabel :count="props.itinerary.policies.length" :ratesMissing="props.itinerary.ratesMissing" :link="policiesItineraryLink" minWidth="100%"></PolicyLabel>
      </div>
      <div class="itinerary__content__column">
        <router-link :to="editItineraryLink">
          <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.itinerary {
  width: 100%;
  &__content {
    padding: 1rem;
    display: grid;
    align-items: center;
    grid-template-columns: 300px 150px 1fr 300px 150px 150px min-content;
    gap: 1rem;
    &__column {
      display: flex;
      flex-direction: column;
    }
  }
}

.related-button {
  width: max-content;
  padding: 0px;
  padding-top: 0px;
  font-size: 12px;
  font-weight: 500;
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
