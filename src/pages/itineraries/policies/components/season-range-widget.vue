<script setup>
import { onMounted, computed, ref } from "vue";
import SeasonRangeModal from "./season-range-modal.vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const props = defineProps({
  seasonRange: {
    type: Object,
  },
  itineraryId: {
    type: String,
  },
});

const submitUpdate = async (data) => {
  updating.value = true;
  const rangeObject = {
    id: data.id,
    startDate: data.dateRange[0],
    endDate: data.dateRange[1],
  };

  if (await policiesStore.updateSeasonRange(rangeObject)) {
    await policiesStore.getItineraryPolicies(props.itineraryId);
    show.value = false;
  }

  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await policiesStore.deleteSeasonRange(id)) {
    await policiesStore.getItineraryPolicies(props.itineraryId);
    show.value = false;
  }
  deleting.value = false;
};
</script>

<template>
  <b-button variant="light" @click="show = true"> {{ filters.formatDate(props.seasonRange.startDate, "range") }} - {{ filters.formatDate(props.seasonRange.endDate, "range") }}</b-button>
  <SeasonRangeModal v-if="show" title="Edit Season Range" :seasonRange="props.seasonRange" :saving="updating" :deleting="deleting"  @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false"></SeasonRangeModal>

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
