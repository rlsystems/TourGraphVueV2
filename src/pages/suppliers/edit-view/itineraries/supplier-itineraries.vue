<script setup>
import { computed, ref, onMounted, watch } from "vue";
import ItineraryCard from "./components/itinerary-card-horizontal.vue";
import ItineraryModal from "./components/itinerary-modal.vue";
import CountLabel from "@/components/count-label.vue";
import { columns } from "./components/column-config.vue";
import ClientTable from "@/components/tables/client-table.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

import { useAccountStore } from "@/stores/_core/accountStore";
const accountStore = useAccountStore();

const loading = ref(true);
const props = defineProps(["supplierId"]);

const showItineraryModal = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await itinerariesStore.getSupplierItineraries(props.supplierId);
  loading.value = false;
});

// modal submit
const submitCreate = async (data) => {
  data.supplierId = props.supplierId;
  submitting.value = true;
  if (await itinerariesStore.createItinerary(data)) {
    await itinerariesStore.getSupplierItineraries(props.supplierId);
    showItineraryModal.value = false;
  }
  submitting.value = false;
};
</script>

<template>
  <!-- Top Row -->
  <b-row>
    <b-col class="d-flex justify-content-between align-items-center mb-3">
      <CountLabel title="Itineraries" titleSingle="Itinerary" :count="itinerariesStore.supplierItineraries?.length" :loading="loading"></CountLabel>
      <b-button variant="primary" @click="showItineraryModal = true" :disabled="accountStore.userBasic">New Itinerary</b-button>
    </b-col>
  </b-row>

  <!-- Main Row  -->
  <b-row>
    <b-col>
      <!-- Table -->
      <ClientTable :data="itinerariesStore.supplierItineraries" :columns="columns" :loading="loading" filterPlaceholder="Search Itineraries..."></ClientTable>
    </b-col>
  </b-row>

  <!-- Modal -->
  <ItineraryModal v-if="showItineraryModal" title="Add New Itinerary" :saving="submitting" @proceed="submitCreate" @cancel="showItineraryModal = false" />
</template>

<style scoped lang="scss">
.grid-layout {
  display: flex;
  flex-wrap: wrap;
}
</style>
