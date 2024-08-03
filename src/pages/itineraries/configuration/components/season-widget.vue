<script setup>
import { onMounted, computed, ref } from "vue";
import SeasonModal from "./season-modal.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();
const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const props = defineProps({
  season: {
    type: Object,
  },
});

const submitUpdate = async (data) => {
  updating.value = true;

  if (await itinerariesStore.updateSeason(data)) {
    await itinerariesStore.getItinerary(props.season.itineraryId);
    show.value = false;
  }

  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await itinerariesStore.deleteSeason(id)) {
    await itinerariesStore.getItinerary(props.season.itineraryId);
    show.value = false;
  }
  deleting.value = false;
};
</script>

<template>
  <b-button variant="light" @click="show = true">{{ props.season.name }} Season</b-button>

  <SeasonModal
    v-if="show"
    title="Edit Season"
    :season="props.season"
    :saving="updating"
    :deleting="deleting"
    @proceed="submitUpdate"
    @proceedDelete="submitDelete"
    :isCreate="false"
    @cancel="show = false"
  ></SeasonModal>
</template>

<style lang="scss" scoped>
.occupancy {
  &__title {
    font-weight: 700;
    margin-bottom: 5px;
  }
  &__amount {
    font-weight: 700;
  }
}
</style>
