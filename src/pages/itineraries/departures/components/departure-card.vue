<script setup>
import { ref } from "vue";
import DepartureModal from "./departure-modal.vue";
import DepartureStatus from "./departure-status.vue";
import DepartureRate from "./departure-rate.vue";
import DeparturePromotions from "./departure-promotions.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const props = defineProps(["departure", "promotions"]);
const show = ref(false);
const expand = ref(false);

const updating = ref(false);
const deleting = ref(false);

// TOTO: create and update
const submitUpdate = async (data) => {
  updating.value = true;
  if (await itinerariesStore.updateDeparture(data)) {
    await itinerariesStore.getDepartures(itinerariesStore.itinerary.id);
    show.value = false; // modal must be closed after updating the table
  }
  updating.value = false;
};

const submitDelete = async (departureID) => {
  deleting.value = true;
  if (await itinerariesStore.deleteDeparture(departureID)) {
    await itinerariesStore.getDepartures(itinerariesStore.itinerary.id);
    show.value = false;
  }
  deleting.value = false;
};
</script>

<!-- Edit button / modal -->
<template>
  <div class="card departure">
    <div class="departure__content">
      <div class="departure__content__top">
        <div class="departure__content__top__main">
          <!-- Title group -->
          <div class="departure-title-group">
            <h5 class="text-dark">
              {{ filters.formatDate(props.departure.startDate, "departure") }}
            </h5>
            <DepartureStatus :departure="props.departure"></DepartureStatus>
          </div>
          <!-- Season -->
          <div :class="{ 'text-info': props.departure.seasonName != 'Regular' }"> {{ props.departure.seasonName }} Season</div>
          <!-- Promotions -->
          <DeparturePromotions :departure="props.departure"></DeparturePromotions>
        </div>
        <!-- Controls -->
        <div class="departure__content__top__controls">
          <b-button variant="soft-info" pill @click="expand = !expand">Rates</b-button>
          <b-button variant="soft-primary" pill @click="show = true">Edit</b-button>
        </div>
      </div>
      <div v-if="expand" class="departure__content__rates">
        <DepartureRate :rate="rate" :departure="props.departure" v-for="rate in props.departure.rates"></DepartureRate>
      </div>
    </div>
  </div>
  <DepartureModal v-if="show" :saving="updating" :deleting="deleting" :promotions="props.promotions" :data="props.departure" @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false" />
</template>

<style lang="scss" scoped>
.departure {
  width: 100%;
  &__content {
    padding: 1rem;

    &__top {
      width: 100%;
      display: grid;
      align-items: center;
      grid-template-columns: 1fr max-content;
      gap: 1rem;
      & h5 {
        margin-bottom: 0.3rem;
      }

      &__main {
        display: grid;
        grid-template-columns: max-content 1fr 1fr;
        justify-items: center;
        align-items: center;
        gap: 2rem;
      }

      &__controls {
        & button {
          margin-right: 1rem;
        }
      }


    }
    &__rates {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--nano-border-color);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }
}
</style>
