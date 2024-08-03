<script setup>
import { onMounted, computed, ref } from "vue";
import OccupancyModal from "./occupancy-modal.vue";

import { usePoliciesStore } from "@/stores/policiesStore";
const policiesStore = usePoliciesStore();

const props = defineProps({
  isSingle: {
    type: Boolean,
    default: false,
  },
  isChild: {
    type: Boolean,
    default: false,
  },
  isExtra: {
    type: Boolean,
    default: false,
  },
  rate: {
    type: Object,
  },
  itineraryId: {
    type: String,
  },
});

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);
const modifier = ref(0);
const isAmount = ref(false);

const submitUpdate = async (data) => {
  updating.value = true;
  if (props.isSingle) {
    props.rate.singleIsAmount = data.isAmount;
    props.rate.singleModifier = data.modifier;
  } else if (props.isChild) {
    props.rate.childIsAmount = data.isAmount;
    props.rate.childModifier = data.modifier;
  } else if (props.isExtra) {
    props.rate.extraIsAmount = data.isAmount;
    props.rate.extraModifier = data.modifier;
  }

  if (await policiesStore.updateRate(props.rate)) {
    await policiesStore.getItineraryPolicies(props.itineraryId);
    show.value = false; // modal must be closed after updating the table
  }
  updating.value = false;
};



const title = computed(() => {
  if (props.isSingle) {
    return "Single Supplement";
  } else if (props.isChild) {
    return "Child Guest";
  } else if (props.isExtra) {
    return "Extra Guest";
  }
});

// initialize
onMounted(() => {
  if (props.isSingle) {
    modifier.value = props.rate.singleModifier;
    isAmount.value = props.rate.singleIsAmount;
  } else if (props.isChild) {
    modifier.value = props.rate.childModifier;
    isAmount.value = props.rate.childIsAmount;
  } else if (props.isExtra) {
    modifier.value = props.rate.extraModifier;
    isAmount.value = props.rate.extraIsAmount;
  }
});

// display
const amountDisplay = computed(() => {
  if (props.isSingle) {
    const type = props.rate.singleIsAmount ? " USD" : "%";
    return props.rate.singleModifier + type;
  } else if (props.isChild) {
    const type = props.rate.childIsAmount ? " USD" : "%";
    return props.rate.childModifier + type;
  } else if (props.isExtra) {
    const type = props.rate.extraIsAmount ? " USD" : "%";
    return props.rate.extraModifier + type;
  }
});


const amountCalculated = computed(() => {
  if (props.isSingle) {
    const amount = props.rate.singleIsAmount ? +props.rate.baseAmount + +props.rate.singleModifier : +props.rate.baseAmount + +(props.rate.baseAmount * (+props.rate.singleModifier / 100));
    return amount;
  } else if (props.isChild) {
    const amount = props.rate.childIsAmount ? +props.rate.baseAmount + +props.rate.childModifier : +props.rate.baseAmount + (+props.rate.baseAmount * (+props.rate.childModifier / 100));
    return amount;
  } else if (props.isExtra) {
    const amount = props.rate.extraIsAmount ? +props.rate.baseAmount + +props.rate.extraModifier : +props.rate.baseAmount + (+props.rate.baseAmount * (+props.rate.extraModifier / 100));
    return amount;
  }
});




</script>

<template>
  <b-button class="occupancy" @click="show = true" variant="light">
    <div class="occupancy__title">{{ title }}</div>
    <div class="occupancy__amount text-info">{{ amountDisplay }}</div>
    <div class="occupancy__calculated text-success">{{ filters.formatCurrency(amountCalculated) }}</div>

  </b-button>

  <OccupancyModal v-if="show" :title="title" :isAmount="isAmount" :modifier="modifier"  :saving="updating" :deleting="deleting"  @proceed="submitUpdate" @cancel="show = false"></OccupancyModal>
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
