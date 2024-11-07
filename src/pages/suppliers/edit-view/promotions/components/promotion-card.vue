<script setup>
import ResourceCard from "@/components/resource-card.vue";
import PromotionModal from "./promotion-modal.vue";
import { ref, computed } from "vue";

import { usePromotionsStore } from "@/stores/promotionsStore";
const promotionsStore = usePromotionsStore();

const props = defineProps(["promotion", "supplierId", "hideEdit"]);

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const submitUpdate = async (data) => {
  updating.value = true;
  if (await promotionsStore.updatePromotion(data)) {
    await promotionsStore.getSupplierPromotions(props.supplierId);
    show.value = false;
  }
  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await promotionsStore.deletePromotion(id)) {
    await promotionsStore.getSupplierPromotions(props.supplierId);
    show.value = false;
  }
  deleting.value = false;
};

const wpBadgeClass = computed(() => {
  if (!props.promotion.wpId) {
    return "bg-danger-subtle text-danger";
  } else {
    return "bg-success-subtle text-success";
  }
});

const externalIdClass = computed(() => {
  if (!props.promotion.externalIdentifier) {
    return "bg-danger-subtle text-danger";
  } else {
    return "bg-success-subtle text-success";
  }
});

</script>

<template>
  <ResourceCard divider>
    <template v-slot:default>
      <div>
        <strong class="text-dark">{{ props.promotion.name }}</strong>
      </div>
      <div class="button-area">
        <b-button v-if="!props.hideEdit" variant="soft-primary" pill class="float-end" @click="show = true">Edit</b-button>
      </div>
    </template>
    <template v-slot:bottom>
      <div class="identifier">
        <div class="identifier__title">Wordpress ID</div>
        <div class="identifier__value">
            <b-badge :class="wpBadgeClass">{{ !props.promotion.wpId ? "Missing" : props.promotion.wpId }}</b-badge>
        </div>
      </div>
      <div class="identifier">
        <div class="identifier__title">External Identifier</div>
        <div class="identifier__value">
          <b-badge :class="externalIdClass">{{ !props.promotion.externalIdentifier ? "Missing" : props.promotion.externalIdentifier }}</b-badge>        
        </div>
      </div>
    </template>
  </ResourceCard>

  <PromotionModal v-if="show" title="Edit Promotion" :data="props.promotion" :saving="updating" :deleting="deleting" @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false" enableDelete />
</template>

