<script setup>
import { computed, ref, onMounted } from "vue";
import DepartureRateModal from "./departure-rate-modal.vue";
const show = ref(false);
const updating = ref(false);

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const props = defineProps({
  rate: {
    type: Object,
  },
  departure: {
    type: Object,
  },
});

onMounted(async () => {
  if(!props.departure.isAvailable){
    
  }
});

const submitUpdate = async (data) => {
  updating.value = true;
  if (await itinerariesStore.updateExplicitRate(data)) {
    await itinerariesStore.getDepartures(itinerariesStore.itinerary.id);
    show.value = false;
  }
  updating.value = false;
};

const submitCreate = async (data) => {
  updating.value = true;
  data["roomId"] = props.rate.roomId;
  data["departureId"] = props.departure.id;

  if (await itinerariesStore.createExplicitRate(data)) {
    await itinerariesStore.getDepartures(itinerariesStore.itinerary.id);
    show.value = false;
  }
  updating.value = false;
};

const baseAmount = computed(() => {
  let amount = props.rate.baseAmount;
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.useExplicitBaseAmount) {
      amount = props.rate.explicitRate.baseAmount;
    }
  }
  return amount;
});

const totalSingleAmount = computed(() => {
  let amount = props.rate.totalSingleAmount;
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.useExplicitBaseAmount || props.rate.explicitRate.usePromoAmount) {
      amount = props.rate.explicitRate.totalSingleAmount;
    }
  }
  return amount;
});

const totalChildAmount = computed(() => {
  let amount = props.rate.totalChildAmount;
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.useExplicitBaseAmount || props.rate.explicitRate.usePromoAmount) {
      amount = props.rate.explicitRate.totalChildAmount;
    }
  }
  return amount;
});

const totalExtraAmount = computed(() => {
  let amount = props.rate.totalExtraAmount;
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.useExplicitBaseAmount || props.rate.explicitRate.usePromoAmount) {
      amount = props.rate.explicitRate.totalExtraAmount;
    }
  }
  return amount;
});

const promoAmount = computed(() => {
  let amount = 0;
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.usePromoAmount) {
      amount = props.rate.explicitRate.promoAmount;
    }
  }
  return amount;
});

const rateTypeDisplay = computed(() => {
  let label = "Calculated Rate";
  if(props.rate.id == '00000000-0000-0000-0000-000000000000'){
    label = "Missing Calculated Rate";
  }
  if (props.rate.explicitRate) {
    if (props.rate.explicitRate.useExplicitBaseAmount) {
       label = "Explicit Rate";
    } 
    if (props.rate.explicitRate.usePromoAmount && !props.rate.explicitRate.useExplicitBaseAmount && props.rate.id == '00000000-0000-0000-0000-000000000000') {
       label = "Missing Calculated Rate";
    } 
  } 
  return label;
});



</script>

<template>
  <b-button class="rate text-dark" variant="light" @click="show = true">
    <div class="rate__info">
      <div class="rate__info__title">
        {{ props.rate.roomName }}
      </div>
      <div class="rate__info__rooms text-secondary">{{ filters.formatPlural(props.rate.numberOfRooms, "Room", "Rooms") }} Total</div>
      <div class="rate__info__occupancy text-secondary">{{ filters.formatOccupancy(props.rate.maxOccupancy) }} Occupancy</div>
      <div class="rate__info__availability">
        <b-badge v-if="props.rate.explicitRate?.hasAvailability == false" variant="danger" class="text-light p-1">Sold Out</b-badge>
        <b-badge v-else variant="success" class="text-light p-1">{{ props.rate.explicitRate && props.rate.explicitRate?.hasAvailability  ? filters.formatPlural(props.rate.explicitRate?.roomsAvailable, "Room", "Rooms") : ""}}</b-badge>
      </div>
    </div>
    <div class="rate__pricing">
      <div class="rate__pricing__main">
        <div class="rate__pricing__main__item explicit-label" :class="rateTypeDisplay == 'Missing Calculated Rate' ? 'text-warning' : 'text-info'">{{ rateTypeDisplay }}</div>


        <div class="rate__pricing__main__item text-success"><strong>Double: </strong>{{ filters.formatCurrency(baseAmount) }}</div>
        <div v-if="props.rate.explicitRate?.usePromoAmount" class="rate__pricing__main__item text-info-purple"><strong>Promo: </strong>{{ filters.formatCurrency(promoAmount) }}</div>
      </div>
      <div class="rate__pricing__sub">
        <div class="rate__pricing__sub__item">
          <strong>Single: </strong>
          <span>{{ filters.formatCurrency(totalSingleAmount) }}</span>
        </div>
        <div v-if="props.rate.maxOccupancy > 1" class="rate__pricing__sub__item">
          <strong>Child: </strong>
          <span>{{ filters.formatCurrency(totalChildAmount) }}</span>
        </div>
        <div v-if="props.rate.maxOccupancy > 2" class="rate__pricing__sub__item">
          <strong>Extra: </strong>
          <span>{{ filters.formatCurrency(totalExtraAmount) }}</span>
        </div>
      </div>
    </div>
  </b-button>
  <DepartureRateModal v-if="show" title="Edit Explicit Rate" :saving="updating" :data="props.rate" @proceedUpdate="submitUpdate" @proceedCreate="submitCreate" @cancel="show = false"></DepartureRateModal>
</template>

<style lang="scss" scoped>
.rate {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 2rem;
  text-align: start;

  &__info {
    &__title {
      font-weight: 700;
      font-size: 1.2rem;
    }
    &__availability {
      margin-top: 0.5rem;
    }
  }
  &__pricing {
    display: grid;

    &__main {
      font-size: 1rem;
      border-bottom: 1px solid rgba(var(--nano-secondary-rgb));
      & .explicit-label {
        font-size: 0.8rem;
        font-weight: 700;
      }
    }

    &__sub {
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }
  }
}
</style>
