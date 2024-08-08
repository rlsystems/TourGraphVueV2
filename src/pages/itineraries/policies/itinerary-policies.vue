<script setup>
import { ref, onMounted, watch } from "vue";
import PolicyModal from "./components/policy-modal.vue";
import PolicyPanel from "./components/policy-panel.vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

const loading = ref(true);
const props = defineProps(["itineraryId"]);

const showPolicyModal = ref(false);
const submitting = ref(false);

const selectedItineraryProductId = ref(null);
const initialPolicyId = ref(null);
const selectedPolicyId = ref(null);

const selectedSeasonId = ref("00000000-0000-0000-0000-000000000000");

const deletingPolicy = ref(false);

onMounted(async () => {
  await policiesStore.getItineraryProducts(props.itineraryId);
  const initialItineraryProduct = policiesStore.itineraryProducts?.[0];
  setItineraryProduct(initialItineraryProduct);

  loading.value = false;
});

// set policy when selecting itinerary product
const setItineraryProduct = (itineraryProduct) => {
  if (itineraryProduct) {
    selectedItineraryProductId.value = itineraryProduct.id;
    const initialPolicy = itineraryProduct.policies.find((policy) => policy.current === true);
    selectedPolicyId.value = initialPolicy.id;
    initialPolicyId.value = initialPolicy.id; // fallback for delete
  }
};

// modal submit
const submitCreatePolicy = async (data) => {
  data.itineraryProductId = selectedItineraryProductId.value;
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
    selectedPolicyId.value = initialPolicyId.value;

    showPolicyModal.value = false;
  }
  deletingPolicy.value = false;
};
</script>

<template>
  <!-- Extra Row -->
  <div class="policy-header mb-3">
    <div class="policy-header__options">
      <b-button pill :variant="itineraryProduct.id == selectedItineraryProductId ? 'success' : 'outline-light'" v-for="itineraryProduct in policiesStore.itineraryProducts" @click="setItineraryProduct(itineraryProduct)">{{ itineraryProduct.productName }}</b-button>
    </div>
  </div>

  <!-- Top Row -->
  <div class="policy-header mb-3">
    <div class="policy-header__options">
      <div v-for="itineraryProduct in policiesStore.itineraryProducts">
        <b-button v-if="itineraryProduct.id == selectedItineraryProductId" pill :variant="policy.id == selectedPolicyId ? 'success' : 'outline-light'" v-for="policy in itineraryProduct.policies" @click="selectedPolicyId = policy.id">{{ policy.current ? "Current Policy" : policy.startDate }}</b-button>
      </div>
    </div>
    <div class="policy-header__cta">
      <b-button variant="primary" @click="showPolicyModal = true">New Policy</b-button>
    </div>
  </div>
  <!-- Main Content -->
  <div v-if="!loading">
    <div v-if="policiesStore.itineraryProducts">
      <div v-for="itineraryProduct in policiesStore.itineraryProducts">
        <div v-for="policy in itineraryProduct.policies">
          <PolicyPanel v-if="policy.id == selectedPolicyId" :policy="policy" :key="policy.id" :itineraryId="props.itineraryId" @tabChange="seasonChange" @deletePolicy="submitDeletePolicy" :deletingPolicy="deletingPolicy" :selectedSeasonId="selectedSeasonId" />
        </div>
      </div>
    </div>
    <p v-else class="text-center">No policies found</p>
  </div>

  <!-- Loading spinner -->
  <div v-else class="d-flex justify-content-center">
    <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
  </div>

  <!-- Modal -->
  <PolicyModal v-if="showPolicyModal" title="Add New Policy" isCreate :saving="submitting" @proceed="submitCreatePolicy" @cancel="showPolicyModal = false" />
</template>

<style lang="scss" scoped>
.policy-header {
  display: grid;
  grid-template-columns: 1fr max-content;

  &__options {
    display: flex;
    button {
      margin-right: 1rem;
    }
  }

  &__cta {
  }
}
</style>
