<script setup>
import CountLabel from '@/components/count-label.vue'
import PromotionModal from './components/promotion-modal.vue'
import PromotionCard from './components/promotion-card.vue'
import { computed, ref, onMounted, watch } from "vue";
import ClientTable from "@/components/tables/client-table.vue";
import { columns } from "./components/column-config.vue";

import { useAccountStore } from "@/stores/_core/accountStore";
const accountStore = useAccountStore();

import { usePromotionsStore } from "@/stores/promotionsStore";
const promotionsStore = usePromotionsStore();

const props = defineProps(["supplierId"]);
const loading = ref(true);
const showPromotionModal = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await promotionsStore.getSupplierPromotions(props.supplierId);
  loading.value = false;
  console.log(promotionsStore.supplierPromotions)
});

const hasDefaultPromotion = computed(() => {
  return promotionsStore.supplierPromotions.some(promotion => promotion.isDefault === true);
});

const submitCreate = async (data) => {
  data.supplierId = props.supplierId;
  submitting.value = true;
  if (await promotionsStore.createPromotion(data)) {
    await promotionsStore.getSupplierPromotions(props.supplierId);
    showPromotionModal.value = false;
  }
  submitting.value = false;
};


</script>

<template>

  <!-- Top Row -->
  <b-row>
    <b-col class="d-flex justify-content-between align-items-center mb-3">
      <CountLabel title="Promotions" titleSingle="Promotion" :count="promotionsStore.supplierPromotions?.length" :loading="loading"></CountLabel>
      <b-button variant="primary" @click="showPromotionModal = true" :disabled="accountStore.userBasic">New Promotion</b-button>
    </b-col>
  </b-row>


  <!-- Main Row  -->
  <b-row>
    <b-col>
      <!-- Table -->
      <ClientTable :data="promotionsStore.supplierPromotions" :columns="columns" :loading="loading" filterPlaceholder="Search Itineraries..."></ClientTable>
    </b-col>
  </b-row>

  <!-- Modal -->
  <PromotionModal v-if="showPromotionModal" title="Add New Promotion" :allowDefault="!hasDefaultPromotion" :saving="submitting" @proceed="submitCreate" @cancel="showPromotionModal = false" />

</template>


<style scoped lang="scss">
.grid-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>

