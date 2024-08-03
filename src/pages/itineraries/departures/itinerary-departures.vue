<script setup>
import CountLabel from "@/components/count-label.vue";

import { computed, ref, onMounted, watch } from "vue";
import DepartureModal from "./components/departure-modal.vue";
import DepartureCard from "./components/departure-card.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const loading = ref(true);
const props = defineProps(["itineraryId", "productId"]);

const showDepartureModal = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await itinerariesStore.getDepartures(props.itineraryId);
  loading.value = false;
});

const itineraryDatesList = ref([]);
watch(
  () => itinerariesStore.itineraryDepartures,
  (departures) => {
    itineraryDatesList.value = departures;
    loading.value = false;
  }
);

// modal submit
const submitCreate = async (data) => {
  data.itineraryId = props.itineraryId;
  submitting.value = true;
  if (await itinerariesStore.createDeparture(data)) {
    await itinerariesStore.getDepartures(props.itineraryId);
    showDepartureModal.value = false;
  }
  submitting.value = false;
};
</script>

<template>
  <!-- Top Row -->
  <b-row>
    <b-col class="d-flex justify-content-between align-items-center mb-3">
      <CountLabel title="Departures" titleSingle="Departure" :count="itinerariesStore.itineraryDepartures?.length" :loading="loading"></CountLabel>

      <b-button variant="primary" @click="showDepartureModal = true">New Date</b-button>
    </b-col>
  </b-row>

  <!-- Main Content -->
  <div v-if="!loading">
    <div v-if="itineraryDatesList">
      <DepartureCard :departure="departure" v-for="departure in itineraryDatesList" :key="departure.id" :promotions="itinerariesStore.itinerary.promotionOptions" />
    </div>
    <p v-else class="text-center">No departures found</p>
  </div>
  <div v-else class="d-flex justify-content-center">
    <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
  </div>

  <!-- Add Departure Date Modal -->
  <DepartureModal v-if="showDepartureModal" :promotions="itinerariesStore.itinerary.promotionOptions" :saving="submitting" @proceed="submitCreate" @cancel="showDepartureModal = false" isCreate />
</template>

<style scoped lang="scss">
.grid-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
