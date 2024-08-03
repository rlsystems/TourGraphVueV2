<script setup>
import { ref, onMounted } from "vue";
import PolicyModal from "./components/policy-modal.vue";
import PolicyPanel from "./components/policy-panel.vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

const loading = ref(true);
const props = defineProps(["itineraryId"]);

const showPolicyModal = ref(false);
const submitting = ref(false);

const currentPolicyId = ref(null);
const selectedPolicyId = ref(null);
const selectedSeasonId = ref("00000000-0000-0000-0000-000000000000");

const deletingPolicy = ref(false);

onMounted(async () => {
  await policiesStore.getItineraryPolicies(props.itineraryId);
  console.log(policiesStore.itineraryPolicies);

  const initialPolicy = policiesStore.itineraryPolicies.find((policy) => policy.current === true);
  currentPolicyId.value = initialPolicy.id;
  selectedPolicyId.value = initialPolicy.id;

  loading.value = false;
});

// modal submit
const submitCreatePolicy = async (data) => {
  data.itineraryId = props.itineraryId;
  submitting.value = true;
  if (await policiesStore.createPolicy(data)) {
    await policiesStore.getItineraryPolicies(props.itineraryId);
    showPolicyModal.value = false;
  }
  submitting.value = false;
};

const seasonChange =  (data) => {
  selectedSeasonId.value = data;
};



// delete policy
const submitDeletePolicy = async (id) => {
  deletingPolicy.value = true;
  if (await policiesStore.deletePolicy(id)) {
    await policiesStore.getItineraryPolicies(props.itineraryId);
    selectedPolicyId.value = currentPolicyId.value;

    showPolicyModal.value = false; 
  }
  deletingPolicy.value = false;
};

</script>

<template>
  <!-- Top Row -->
  <!-- TODO: need a way to handle multiple policy selection -->
  <!-- MAKE: one button is displaying selected, to the right a small button with down arrow opens selection for other policies, past and future -->
  <div class="policy-header mb-3">
    <div class="policy-header__options">
      <b-button pill :variant="policy.id == selectedPolicyId ? 'success' : 'outline-light'" v-for="policy in policiesStore.itineraryPolicies" @click="selectedPolicyId = policy.id">{{ policy.current ? "Current Policy" : policy.startDate }}</b-button>
      <b-button pill variant="soft-dark"><i class="mdi mdi-filter-variant"></i> </b-button>
    </div>
    <div class="policy-header__cta">
      <b-button variant="primary" @click="showPolicyModal = true">New Policy</b-button>
    </div>
  </div>
  <!-- Main Content -->
  <div v-if="!loading">
    <div v-if="policiesStore.itineraryPolicies">
      <div v-for="policy in policiesStore.itineraryPolicies">
        <PolicyPanel v-if="policy.id == selectedPolicyId" :policy="policy" :key="policy.id" :itineraryId="props.itineraryId" @tabChange="seasonChange" @deletePolicy="submitDeletePolicy" :deletingPolicy="deletingPolicy" :selectedSeasonId="selectedSeasonId" />
      </div>
    </div>
    <p v-else class="text-center">No policies found</p>
  </div>

  <!-- Loading spinner -->
  <div v-else class="d-flex justify-content-center">
    <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
  </div>

  <!-- Modal -->
  <PolicyModal v-if="showPolicyModal" :itineraryId="props.itineraryId" title="Add New Policy" isCreate :saving="submitting" @proceed="submitCreatePolicy" @cancel="showPolicyModal = false" />
</template>

<style lang="scss" scoped>


.policy-header {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;

  &__options {
    display: flex;
    gap: 1rem;
  }

  &__cta {
  }
}
</style>
