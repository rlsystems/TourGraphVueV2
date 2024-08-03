<script setup>
import { ref, computed } from "vue";
import LoadingButton from "@/components/loading-button.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();


const props = defineProps(["itinerary"]);
const running = ref(false);
const lastRunDate = ref(props.itinerary.lastRun); 

const editItineraryLink = computed(() => {
  return { name: "itinerary-automation", params: { itineraryId: props.itinerary.id } };
});

const runAutomation = async () => {
  running.value = true;
  const result = await itinerariesStore.runAutomation(props.itinerary.id);
  lastRunDate.value = result;
  running.value = false;

  if(result){
    await itinerariesStore.getProductItineraries(props.itinerary.productId); // reload the product itineraries, not showing load indication, neded for updating dates count
  }
};


</script>

<template>
  <!-- Button -->
  <div class="automation">
    <div v-if="props.itinerary.enableAutomation" class="automation__cta">
      <LoadingButton variant="light" :loading="running" @click="runAutomation" style="border: 1px solid;"><i class="ri ri-play-line"></i></LoadingButton>
    </div>
    <router-link :to="editItineraryLink" class="automation__detail">
      <div v-if="props.itinerary.enableAutomation" class="text-success">
        <strong>Automtion Enabled</strong>
      </div>
      <div v-else class="text-danger"><strong>Automtion Disabled</strong></div>
      <div v-if="props.itinerary.enableAutomation">Last Run: {{ filters.formatDate(lastRunDate, "automation") }}</div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.automation {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 1rem;
  width: 100%;
  align-items: center;
  width: 300px;
  &__detail {
    //padding: 0 1rem;
    text-align: start;
    font-size: 12px;
  }

  &__cta {
  }
}
</style>
