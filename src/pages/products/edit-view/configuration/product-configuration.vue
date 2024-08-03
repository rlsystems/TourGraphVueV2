<script setup>
import LoadingButton from "@/components/loading-button.vue";
import LoadingSelect from "@/components/loading-select.vue";

import { computed, ref, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { useRouter } from "vue-router";
const router = useRouter();

import { useSuppliersStore } from "@/stores/suppliersStore";
const suppliersStore = useSuppliersStore();

import { useProductsStore } from "@/stores/productsStore";
const productsStore = useProductsStore();
console.log("data from store ", productsStore.product);

const emit = defineEmits(["proceed", "proceedDelete"]);

// refs
const suppliersLoading = ref(false);

const updating = ref(false);
const deleting = ref(false);
const selectSupplierOptions = ref(suppliersStore.supplierListFull);

// initial values
const initialValues = ref({
  name: productsStore.product?.name,
  notes: productsStore.product?.notes,
  supplierId: productsStore.product?.supplierId, // TODO FIX: supplier dropdown not loading correctly
  wpId: productsStore.product?.wpId,
  bookingConfigurationId: productsStore.product?.bookingConfigurationId,
});

// schema
const schema = yup.object({
  name: yup.string().required(),
  supplierId: yup.string().required(),
  bookingConfigurationId: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta, setFieldValue, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [notes, notesAttrs] = defineField("notes");
const [supplierId, supplierIdAttrs] = defineField("supplierId");
const [wpId, wpIdAttrs] = defineField("wpId");

const [bookingConfigurationId, bookingConfigurationIdAttrs] = defineField("bookingConfigurationId");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// handle submit
const proceed = handleSubmit(async (values) => {
  let updatedProduct = { ...productsStore.product, ...values }; // get the original row object and overwrite any updated fields with new values
  updating.value = true;
  if (await productsStore.updateProduct(updatedProduct)) {
    productsStore.currentProduct = updatedProduct; // QUESTION: is it ok to set state directly like this?
  }

  updating.value = false;
});

const proceedDelete = handleSubmit(async (values) => {
  deleting.value = true;
  if (await productsStore.deleteProduct(productsStore.product.id)) {
    router.push("/products");
  }
  deleting.value = false;
});

// initialize
onMounted(async () => {
  if (!suppliersStore.hasSuppliers) {
    suppliersLoading.value = true;
    await suppliersStore.getSuppliers();
    suppliersLoading.value = false;
  }
  selectSupplierOptions.value = suppliersStore.suppliersFull.map((obj) => ({
    value: obj.id,
    text: obj.name,
  }));
});

// watcher
watch(
  () => productsStore.product,
  () => {
    resetForm({
      values: {
        name: productsStore.product.name,
        supplierId: productsStore.product.supplierId,
        notes: productsStore.product.notes,
        wpId: productsStore.product.wpId,

        bookingConfigurationId: productsStore.product.bookingConfigurationId,
      },
    });
  }
);
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="form-container">
        <div class="form-block-title">Product Details</div>
        <!-- Form -->
        <form @submit="proceed" class="my-2">
          <div class="details-row">
            <div class="details-row__group">
              <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 600px">
                <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
                <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
              </b-form-group>
              <div class="mb-2" style="max-width: 600px">
                <LoadingSelect v-model="supplierId" v-bind="supplierIdAttrs" id="filterSupplier" :loading="suppliersLoading" :options="selectSupplierOptions" label="Supplier" style="width: 100%" />
                <b-form-invalid-feedback :state="false">{{ errors.supplierId }}</b-form-invalid-feedback>
              </div>
              <b-form-group label="Wordpress Id" label-for="wpId" class="mb-2" style="max-width: 150px">
                <b-form-input type="text" v-bind="wpIdAttrs" v-model="wpId" id="wpId" />
                <b-form-invalid-feedback :state="false">{{ errors.wpId }}</b-form-invalid-feedback>
              </b-form-group>
            </div>

            <b-form-group label="Notes" label-for="notes" class="mb-2" >
              <b-form-textarea type="text" rows="8" v-bind="notesAttrs" v-model="notes" />
              <b-form-invalid-feedback :state="false">{{ errors.notes }}</b-form-invalid-feedback>
            </b-form-group>
          </div>

          <!-- <LoadingSelect v-model="filterSupplierSelected" id="filterSupplier" :loading="loadingSuppliers" :options="filterSupplierOptions" label="Supplier" style="width: 200px" /> -->

          <div class="form-block-title mt-4">Booking Configuration</div>
          <div class="d-inline-flex flex-wrap">
            <div class="radio-group me-2 mb-1">
              <input name="bookingConfigurationId" type="radio" class="radio-group__input" id="configFixed" value="1" v-bind="bookingConfigurationIdAttrs" v-model="bookingConfigurationId" />
              <label for="configFixed" class="radio-group__label">
                <span class="radio-group__label__button"></span>
                <div class="radio-group__label__text">
                  <div class="radio-group__label__text__title">Fixed Itineraries</div>
                </div>
              </label>
            </div>

            <div class="radio-group me-2 mb-1">
              <input name="bookingConfigurationId" type="radio" class="radio-group__input" id="configOpen" value="2" v-bind="bookingConfigurationIdAttrs" v-model="bookingConfigurationId" />
              <label for="configOpen" class="radio-group__label">
                <span class="radio-group__label__button"></span>
                <div class="radio-group__label__text">
                  <div class="radio-group__label__text__title">Open Itineraries</div>
                </div>
              </label>
            </div>

            <div class="radio-group me-2 mb-1">
              <input name="bookingConfigurationId" type="radio" class="radio-group__input" id="configNightly" value="3" v-bind="bookingConfigurationIdAttrs" v-model="bookingConfigurationId" />
              <label for="configNightly" class="radio-group__label">
                <span class="radio-group__label__button"></span>
                <div class="radio-group__label__text">
                  <div class="radio-group__label__text__title">Nightly</div>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
      <!-- FIX: Disabled save changes until form dirty / valid -->
      <div class="d-flex flex-row-reverse">
        <LoadingButton variant="primary" type="submit" class="mx-2" :loading="updating" @click="proceed" :disabled="!canProceed">Save Changes</LoadingButton>
        <LoadingButton variant="danger" type="submit" :loading="deleting" @click="proceedDelete" :disabled="updating">Delete</LoadingButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.details-row  {
  display: grid;
  grid-template-columns: 1fr  1fr;
  gap: 2rem;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

</style>