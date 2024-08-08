<script setup>
import RateWidget from "./rate-widget.vue";
import SeasonRangeModal from "./season-range-modal.vue";
import PolicyModal from "./policy-modal.vue";

import { ref } from "vue";

import { usePoliciesStore } from "@/stores/policiesStore";
import SeasonRangeWidget from "./season-range-widget.vue";
const policiesStore = usePoliciesStore();

const props = defineProps(["policy", "itineraryId", "selectedSeasonId", "deletingPolicy"]);
const emit = defineEmits(["tabChange", "deletePolicy"]);

const showRangeModal = ref(false);
const savingRange = ref(false);

const showPolicyModal = ref(false);
const updatingPolicy = ref(false);

const changeSeason = (data) => {
  emit("tabChange", data);
}

const deletePolicy = () => {
  emit("deletePolicy", props.policy.id);
}

// create season range
const submitCreateSeasonRange = async (data) => {
  const rangeObject = {
    policyId: data.policyId,
    seasonId: data.seasonId,
    startDate: data.dateRange[0],
    endDate: data.dateRange[1],
  };
  savingRange.value = true;
  if (await policiesStore.createSeasonRange(rangeObject)) {
    await policiesStore.getItineraryProducts(props.itineraryId);
    showRangeModal.value = false; // modal must be closed after updating the table
  }
  savingRange.value = false;
};



// update policy
const submitUpdatePolicy = async (data) => {
  let updatedPolicy = { ...props.policy, ...data };
  updatingPolicy.value = true;
  if (await policiesStore.updatePolicy(updatedPolicy)) {
    await policiesStore.getItineraryProducts(props.itineraryId);
    showPolicyModal.value = false; 
  }
  updatingPolicy.value = false;
};



</script>

<template>
  <div class="card">
    <div class="card-body">
      <!-- Tabs -->
      <b-tabs>
        <b-tab :title="season.name + ' Season'" :id="season.name" v-for="season in props.policy.seasons" :key="season.id" @click="changeSeason(season.id)" :active="season.id == props.selectedSeasonId" >
          <div class="seasons">
            <div class="seasons__ranges" v-if="season.id != '00000000-0000-0000-0000-000000000000'">
              <div class="seasons__ranges__title text-dark">Season Range:</div>
              <div class="seasons__ranges__items">
                <SeasonRangeWidget v-for="range in season.seasonRanges" :season-range="range" :itinerary-id="props.itineraryId"> </SeasonRangeWidget>
                <small v-if="season.seasonRanges.length == 0" class="text-warning">Season Ranges Pending</small>
              </div>
              <div class="seasons__ranges__control">
                <b-button variant="primary" @click="showRangeModal = true">Create Range</b-button>
                <SeasonRangeModal v-if="showRangeModal" title="Create Season Range" :policy-id="props.policy.id" :season-id="season.id" :saving="savingRange" isCreate @proceed="submitCreateSeasonRange" @cancel="showRangeModal = false"></SeasonRangeModal>
              </div>
            </div>
            <div class="seasons__rates">
              <RateWidget :rate="rate" :itinerary-id="itineraryId" :policy-id="props.policy.id" v-for="rate in season.rates"></RateWidget>
            </div>
          </div>
        </b-tab>
      </b-tabs>
      <!-- Edit Policy -->
      <div class="policy-name">
        <b-badge class="badge-outline-secondary ms-1" variant="text-secondary">{{ props.policy.default ? "Default Policy" : "Effective " + props.policy.startDate }}</b-badge>
        <b-button v-if="!props.policy.default" variant="primary" @click="showPolicyModal = true">Edit Policy</b-button>
        <PolicyModal v-if="showPolicyModal" :policy="props.policy" title="Edit Policy" :saving="updatingPolicy" :deleting="props.deletingPolicy" @proceed="submitUpdatePolicy" @proceedDelete="deletePolicy" @cancel="showPolicyModal = false" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.seasons-nav {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--nano-border-color);
  display: flex;
  gap: 1rem;

  & button {
    & .pending-rates {
      font-size: 0.8rem;
      font-weight: 600;
    }
  }
}

.seasons {
  &__ranges {
    padding: 1rem 0;
    border-bottom: 1px solid var(--nano-border-color);
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    gap: 1rem;
    align-items: center;
    &__title {
      font-weight: 700;
    }
    &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    &__control {
    }
  }
}

.policy-name {
  display: flex;
  font-size: 1.2rem;
  padding-top: 1.5rem;
  justify-content: space-between;
  align-items: center;
}
</style>
