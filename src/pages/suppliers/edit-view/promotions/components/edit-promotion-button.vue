<script setup>
import PromotionModal from "./promotion-modal.vue";
import { ref, computed } from "vue";

import { usePromotionsStore } from "@/stores/promotionsStore";
const promotionsStore = usePromotionsStore();

const props = defineProps(["promotion", "hideEdit"]);

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const submitUpdate = async (data) => {
  updating.value = true;
  if (await promotionsStore.updatePromotion(data)) {
    await promotionsStore.getSupplierPromotions(props.promotion.supplierId);
    show.value = false;
  }
  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await promotionsStore.deletePromotion(id)) {
    await promotionsStore.getSupplierPromotions(props.promotion.supplierId);
    show.value = false;
  }
  deleting.value = false;
};

</script>

<template>
  <!-- Row button and Edit modal -->
  <b-button variant="soft-primary" pill class="float-end" @click="show = true">Edit</b-button>
  <PromotionModal v-if="show" title="Edit Promotion" :data="props.promotion" :saving="updating" :deleting="deleting" @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false" enableDelete />

</template>
