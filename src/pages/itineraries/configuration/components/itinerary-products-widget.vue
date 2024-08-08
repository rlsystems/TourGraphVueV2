<script setup>
import { onMounted, computed, ref } from "vue";
import ItineraryProductModal from "./itinerary-product-modal.vue";

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const itineraryProductToEdit = ref(null);
const showEdit = ref(false);
const showCreate = ref(false);

const deleting = ref(false);
const creating = ref(false);

const props = defineProps({
  itineraryProducts: {
    type: Array,
  },
  productOptions: {
    type: Array,
  },
  itineraryId: {
    type: String,
  },
});

const setEdititineraryProduct = (selecteditineraryProduct) => {
  itineraryProductToEdit.value = selecteditineraryProduct;
  showEdit.value = true;
};

const submitCreate = async (values) => {
  creating.value = true;
  if (await itinerariesStore.createItineraryProduct(values)) {
    await itinerariesStore.getItinerary(props.itineraryId);
    showCreate.value = false;
  }
  creating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await itinerariesStore.deleteItineraryProduct(id)) {
    await itinerariesStore.getItinerary(props.itineraryId);
    showEdit.value = false;
  }
  deleting.value = false;
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="form-block-title">Products</div>
      <div class="widget-grid">
        <div class="widget-grid__items">
          <div class="widget-grid__items__default text-danger" v-if="props.itineraryProducts?.length == 0">No Products</div>

          <div v-for="itineraryProduct in props.itineraryProducts">
            <b-button variant="light" @click="setEdititineraryProduct(itineraryProduct)">{{ itineraryProduct.productName }}</b-button>
            <ItineraryProductModal v-if="showEdit" :itineraryProduct="itineraryProductToEdit" :productOptions="props.productOptions" :itinerary-id="props.itineraryId" title="Remove Product from Itinerary" :deleting="deleting" @proceedDelete="submitDelete" @cancel="showEdit = false" />
          </div>
        </div>
        <div class="widget-grid__control">
          <b-button variant="primary" @click="showCreate = true" :disabled="props.itineraryProducts?.length == props.productOptions?.length">New Product</b-button>
          <ItineraryProductModal v-if="showCreate" :productOptions="props.productOptions" :itinerary-id="props.itineraryId" title="Add Product to Itinerary" :saving="creating" @proceed="submitCreate" @cancel="showCreate = false" isCreate />
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
      padding: 0.5rem 0;
      // //border: 1px solid var(--nano-border-color);
      // border-radius: 5px;
      // color: ;
    }
  }
  &__control {
    display: flex;
    align-items: flex-end;
  }
}
</style>
