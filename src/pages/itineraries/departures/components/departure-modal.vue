<script setup>
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import Multiselect from "vue-multiselect";

import { useLayoutStore } from "@/stores/_core/layoutStore.js";
const layoutStore = useLayoutStore();

const { theme } = storeToRefs(layoutStore);
const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

const promotionSelectOptions = ref([]); // multi select
const selectItineraryProductOptions = ref(null);

// props
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
  promotions: {
    type: Array,
    required: false,
  },
  itineraryProductOptions: {
    type: Array,
    required: false,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  promotionSelectOptions.value = props.promotions.map((obj) => ({
    id: obj.id,
    name: obj.name,
  }));

  selectItineraryProductOptions.value = props.itineraryProductOptions.map((obj) => ({
    value: obj.productId,
    text: obj.productName,
  }));
  selectItineraryProductOptions.value.unshift({
    value: null,
    text: "Select a product",
  });
});

// initial values
const initialValues = ref({
  startDate: props.data?.startDate,
  itineraryId: props.data?.itineraryId,
  productId: props.data ? props.data?.productId : props.itineraryProductOptions.length == 1 ? props.itineraryProductOptions[0].productId : null,
  promotions: props.data?.promotions,
});

// schema
const schema = yup.object({
  startDate: yup.string().required(),
  productId: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [startDate, startDateAttrs] = defineField("startDate");
const [promotions, promotionsAttrs] = defineField("promotions");
const [productId, productIdAttrs] = defineField("productId");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// modal proceed / close
const show = ref(true);
const close = async () => {
  show.value = false;
  emit("cancel");
};
const proceed = handleSubmit((values) => {
  const promotionIds = values.promotions?.map((promotion) => promotion.id);
  values.promotions = promotionIds;

  let updatedObject = { ...props.data, ...values };
  emit("proceed", updatedObject);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete", props.data.id);
});
</script>

<template>
  <b-modal v-model="show" :title="props.isCreate ? 'Add New Departure' : 'Edit Departure'" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group v-if="isCreate" label="Select Product" class="mb-2" label-for="productSelect" >
            <b-form-select id="productSelect" v-bind="productIdAttrs" v-model="productId" :options="selectItineraryProductOptions" />
            <b-form-invalid-feedback :state="false">{{ errors.productId }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Start Date" label-for="startDate" class="mb-2">
            <VueDatePicker v-bind="startDateAttrs" v-model="startDate" :dark="theme === 'dark'" model-type="yyyy-MM-dd" auto-apply :hide-input-icon="true" :enable-time-picker="false" placeholder="Select Date" />
            <b-form-invalid-feedback :state="false">{{ errors.startDate }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Promotions" label-for="promotionSelect" class="mb-2">
            <multiselect id="promotionSelect" v-if="props.promotions" v-model="promotions" :options="promotionSelectOptions" track-by="id" label="name" :multiple="true" :searchable="false"> </multiselect>
          </b-form-group>
        </div>
      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left">
        <LoadingButton v-if="!isCreate" variant="danger" type="submit" :loading="props.deleting" @click="proceedDelete" :disabled="props.saving">Delete</LoadingButton>
      </div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton variant="primary" type="submit" :loading="props.saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 3rem;

  & legend {
    font-weight: 700 !important;
  }

  & .form-switch {
    margin-top: 2.3rem;
  }
}
</style>
