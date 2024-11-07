<script setup>
import LoadingButton from "@/components/loading-button.vue";
import ConfirmModal from "@/components/confirm-modal.vue";

import SeasonsWidget from "./components/seasons-widget.vue";
import ItineraryProductsWidget from "./components/itinerary-products-widget.vue";

import { computed, ref, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { useRouter } from "vue-router";
const router = useRouter();

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

import { useAccountStore } from "@/stores/_core/accountStore";
const accountStore = useAccountStore();

// refs
const props = defineProps(["itineraryId"]);
const updating = ref(false);
const deleting = ref(false);
const showDeleteConfirmModal = ref(false);

const seasons = ref(itinerariesStore.itinerary?.seasons);
const itineraryProducts = ref(itinerariesStore.itinerary?.itineraryProducts);
const productOptions = ref(itinerariesStore.itinerary?.productOptions);

// initial values
const initialValues = ref({
  name: itinerariesStore.itinerary?.name || "",
  wpId: itinerariesStore.itinerary?.wpId || "",
  lengthInNights: itinerariesStore.itinerary?.lengthInNights || 1,
  productId: itinerariesStore.itinerary?.productId || null,
});

// schema
const schema = yup.object({
  name: yup.string().required(),
  lengthInNights: yup.number().required().min(1, "Must be greater than 0"),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [lengthInNights, lengthInNightsAttrs] = defineField("lengthInNights");
const [wpId, wpIdAttrs] = defineField("wpId");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// handle submit
const submitUpdate = handleSubmit(async (values) => {
  let updatedItinerary = { ...itinerariesStore.itinerary, ...values };
  updating.value = true;
  if (await itinerariesStore.updateItinerary(updatedItinerary)) {
    itinerariesStore.currentItinerary = updatedItinerary; // update current itinerary in memory
  }
  updating.value = false;
});

const parentLink = computed(() => {
  return { name: "supplier-itineraries", params: { supplierId: itinerariesStore.itinerary.supplierId } };
});

const submitDelete = handleSubmit(async () => {
  deleting.value = true;
  if (await itinerariesStore.deleteItinerary(itinerariesStore.itinerary.id)) {
    router.push(parentLink.value);

  }
  deleting.value = false;
  showDeleteConfirmModal.value = false;

});


// watcher
watch(
  () => itinerariesStore.itinerary,
  () => {
    resetForm({
      values: {
        name: itinerariesStore.itinerary.name,
        lengthInNights: itinerariesStore.itinerary.lengthInNights,
        productId: itinerariesStore.itinerary.productId,
        wpId: itinerariesStore.itinerary.wpId,
      },
    });
    seasons.value = itinerariesStore.itinerary.seasons;
    itineraryProducts.value = itinerariesStore.itinerary.itineraryProducts;
    productOptions.value = itinerariesStore.itinerary.productOptions;
  }
);
</script>

<template>
  <b-row>
    <!-- Itinerary Details -->
    <b-col lg="6">
      <div class="card">
        <div class="card-body">
          <div class="form-container">
            <form @submit="proceed">
              <div class="form-block-title">Itinerary Details</div>
              <div class="name-row">
                <b-form-group label="Name" label-for="name" class="mb-3">
                  <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
                  <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Length in Nights" label-for="lengthInNights" class="mb-3" style="max-width: 200px">
                  <b-form-input type="number" v-bind="lengthInNightsAttrs" v-model="lengthInNights" />
                  <b-form-invalid-feedback :state="false">{{ errors.lengthInNights }}</b-form-invalid-feedback>
                </b-form-group>
              </div>
              <b-form-group label="WordPress Id" label-for="wpId" class="mb-3" style="max-width: 200px">
                <b-form-input type="text" v-bind="wpIdAttrs" v-model="wpId" id="wpId" />
                <b-form-invalid-feedback :state="false">{{ errors.wpId }}</b-form-invalid-feedback>
              </b-form-group>
            </form>
          </div>
          <div v-if="!accountStore.userBasic" class="d-flex flex-row-reverse mt-4">
            <LoadingButton variant="primary" type="submit" class="ms-2" :loading="updating" @click="submitUpdate" :disabled="!canProceed">Save Changes</LoadingButton>
            <LoadingButton variant="danger" type="submit"  @click="showDeleteConfirmModal = true" :loading="deleting" :disabled="updating">Delete</LoadingButton>
            <ConfirmModal :show="showDeleteConfirmModal" :loading="deleting" @confirm="submitDelete" @close="showDeleteConfirmModal = false" title="Delete Itinerary?" message="If you delete this itinerary all price and departures will be removed."></ConfirmModal>
          </div>
        </div>
      </div>
    </b-col>
    <!-- Seasons / Products -->
    <b-col lg="6">
      <SeasonsWidget :seasons="seasons" :itineraryId="itinerariesStore.itinerary?.id"></SeasonsWidget>
      <ItineraryProductsWidget :itineraryProducts="itineraryProducts" :productOptions="productOptions" :itineraryId="itinerariesStore.itinerary?.id"></ItineraryProductsWidget>
    </b-col>
  </b-row>
</template>

<style lang="scss" scoped>
.name-row {
  display: grid;
  grid-template-columns: 1fr 200px;
  column-gap: 2rem;

  @media only screen and (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
}
</style>
