<script setup>
import { ref } from "vue";
import SeasonModal from "./season-modal.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const seasonToEdit = ref(null);
const showEdit = ref(false);
const showCreate = ref(false);

const updating = ref(false);
const deleting = ref(false);
const creating = ref(false);

const props = defineProps({
  seasons: {
    type: Array,
  },
  itineraryId: {
    type: String,
  },
});

const setEditSeason = (selectedSeason) => {
  seasonToEdit.value = selectedSeason;
  showEdit.value = true;
};

const submitCreate = async (values) => {
  creating.value = true;
  if (await itinerariesStore.createSeason(values)) {
    await itinerariesStore.getItinerary(props.itineraryId);
    showCreate.value = false;
  }
  creating.value = false;
};

const submitUpdate = async (data) => {
  updating.value = true;
  if (await itinerariesStore.updateSeason(data)) {
    await itinerariesStore.getItinerary(props.itineraryId);
    showEdit.value = false;
  }
  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await itinerariesStore.deleteSeason(id)) {
    await itinerariesStore.getItinerary(props.itineraryId);
    showEdit.value = false;
  }
  deleting.value = false;
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="form-block-title">Seasons</div>
      <div class="widget-grid">
        <div class="widget-grid__items">
          <div class="widget-grid__items__default">Regular</div>
          <div v-for="season in props.seasons">
            <b-button variant="light" @click="setEditSeason(season)">{{ season.name }} Season</b-button>
            <SeasonModal v-if="showEdit" title="Edit Season" :season="seasonToEdit" :saving="updating" :deleting="deleting" @proceed="submitUpdate" @proceedDelete="submitDelete" :isCreate="false" @cancel="showEdit = false"></SeasonModal>
          </div>
        </div>
        <div class="widget-grid__control">
          <b-button variant="primary" @click="showCreate = true">New Season</b-button>
          <SeasonModal v-if="showCreate" :itinerary-id="props.itineraryId" title="Create New Season" :saving="creating" @proceed="submitCreate" @cancel="showCreate = false" isCreate></SeasonModal>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.widget-grid {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    &__default {
      padding: 0.5rem 1rem;
      border: 1px solid var(--nano-border-color);
      border-radius: 5px;
    }
  }
  &__control {
    display: flex;
    align-items: flex-end;
  }
}
</style>
