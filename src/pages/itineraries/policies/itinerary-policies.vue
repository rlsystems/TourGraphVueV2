<script setup>
import { ref, onMounted, watch } from "vue";
import PolicyModal from "./components/policy-modal.vue";
import PolicyPanel from "./components/policy-panel.vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const loading = ref(true);
const props = defineProps(["itineraryId"]);

const showPolicyModal = ref(false);
const submitting = ref(false);

const currentPolicyId = ref(null);
const selectedItineraryProductId = ref(null);

const selectedPolicyId = ref(null);

const selectedSeasonId = ref("00000000-0000-0000-0000-000000000000");

const deletingPolicy = ref(false);

onMounted(async () => {
  await policiesStore.getItineraryProducts(props.itineraryId);
  console.log(policiesStore.itineraryProducts);
  loading.value = false;
});

// modal submit
const submitCreatePolicy = async (data) => {
  data.itineraryId = props.itineraryId;
  submitting.value = true;
  if (await policiesStore.createPolicy(data)) {
    await policiesStore.getItineraryProducts(props.itineraryId);
    showPolicyModal.value = false;
  }
  submitting.value = false;
};

const seasonChange = (data) => {
  selectedSeasonId.value = data;
};

// delete policy
const submitDeletePolicy = async (id) => {
  deletingPolicy.value = true;
  if (await policiesStore.deletePolicy(id)) {
    await policiesStore.getItineraryProducts(props.itineraryId);
    //selectedItineraryProductId.value = 
    selectedPolicyId.value = currentPolicyId.value;

    showPolicyModal.value = false;
  }
  deletingPolicy.value = false;
};
</script>

<template>
  <!-- Extra Row -->
  <div class="policy-header mb-3">
    <div class="policy-header__options">
      <b-button pill :variant="itineraryProduct.id == selectedItineraryProductId ? 'success' : 'outline-light'" v-for="itineraryProduct in policiesStore.itineraryProducts" @click="selectedItineraryProductId = policy.id">{{ itineraryProduct.productName }}</b-button>
      <b-button pill variant="soft-dark"><i class="mdi mdi-filter-variant"></i> </b-button>
    </div>
    <div class="policy-header__cta">
      <b-button variant="primary" @click="showPolicyModal = true">New Policy</b-button>
    </div>
  </div>

  <!-- Top Row -->
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
