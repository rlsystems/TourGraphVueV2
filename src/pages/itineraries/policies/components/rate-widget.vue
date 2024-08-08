<script setup>
import OccupancyWidget from "./occupancy-widget.vue";
import LoadingButton from "@/components/loading-button.vue";

import { ref } from "vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

const props = defineProps(["rate", "itineraryId", "policyId"]);
const updatingRate = ref(false);
const creatingRate = ref(false);



const updateRate = async () => {
  if (!props.rate.baseAmount) {
    props.rate.baseAmount = 0;
  }

  updatingRate.value = true;
  await policiesStore.updateRate(props.rate);
  updatingRate.value = false;
};

// create new rate
const submitCreateRate = async () => {
  creatingRate.value = true;
  const newRate = {
    roomId: props.rate.roomId,
    seasonId: props.rate.seasonId,
    policyId: props.policyId,

  };
  if (await policiesStore.createRate(newRate)) {
    await policiesStore.getItineraryProducts(props.itineraryId);
  }
  creatingRate.value = false;
};



</script>

<template>
  <div class="rate">
    <h4 class="rate__title text-dark">
      {{ props.rate.roomName }}
    </h4>
    <div class="rate__add" v-if="props.rate.id == '00000000-0000-0000-0000-000000000000'"> 
      <LoadingButton variant="success" :loading="creatingRate" @click="submitCreateRate" style="width: 90px">Create</LoadingButton>
      <div class="text-warning">
        Rate pending
      </div>
    </div>
    <div v-else class="rate__inputs">
      <div class="rate__inputs__fields">
        <b-form-group label="Base Price">
          <div class="input-group flex-nowrap">
            <b-form-input type="text" :id="props.rate.roomId" v-model="props.rate.baseAmount" @change="updateRate" />
            <span class="input-group-text">USD</span>
          </div>
        </b-form-group>
        <b-form-group label="Occupancy">
          <h2 class="text-info">{{ filters.formatOccupancy(props.rate.maxOccupancy)  }}</h2>
        </b-form-group>
      </div>
      <div class="rate__inputs__widgets">
        <h3 v-if="props.rate.maxOccupancy == 1">
          <b-badge  class="bg-info-subtle text-info">Single Cabin</b-badge>
        </h3>
        <OccupancyWidget v-if="props.rate.maxOccupancy > 1" :is-single="true" :rate="props.rate" :itineraryId="itineraryId"></OccupancyWidget>
        <OccupancyWidget v-if="props.rate.maxOccupancy > 1" :is-child="true" :rate="props.rate" :itineraryId="itineraryId"></OccupancyWidget>
        <OccupancyWidget v-if="props.rate.maxOccupancy > 2" :is-extra="true" :rate="props.rate" :itineraryId="itineraryId"></OccupancyWidget>
      </div>
    </div>
    <div v-if="updatingRate" class="rate__updating text-success">
      <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
      Updating...
    </div>
  </div>
</template>
<style lang="scss" scoped>
.rate {
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--nano-border-color);
  position: relative;
  &__add {
    display: flex;
    align-items: center;
    gap: 2em;
  }

  &__inputs {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 2rem;
    align-items: center;

    @media only screen and (max-width: 1100px) {
      grid-template-columns: 1fr;
      gap: 0;
    }

    &__fields {
      display: grid;
      grid-template-columns: 14rem 8rem;
      gap: 2rem;
      margin-bottom: 1.5rem;
      & legend {
        font-weight: 700 !important;
      }
    }

    &__widgets {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      gap: 1rem;
    }
  }

  &__updating {
    position: absolute;
    bottom: 1.5rem;
    left: 0;
    font-size: 0.8rem;
  }
}
</style>
