<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";

const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);
const selectProductOptions = ref(null);

// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itineraryId: {
    type: String,
    required: true,
  },
  productOptions: {
    type: Array,
    required: true,
  },
  itineraryProduct: {
    type: Object,
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

// initialize
onMounted(() => {
  selectProductOptions.value = props.productOptions.map((obj) => ({
    value: obj.id,
    text: obj.name,
  }));
  selectProductOptions.value.unshift({
    value: null,
    text: "Select a product",
  });
});

// initial values
const initialValues = ref({
  productId: props.itineraryProduct ? props.itineraryProduct?.productId : null,
  itineraryId: props.itineraryId,
});

// schema
const schema = yup.object({
  productId: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
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
  let updatedObject = { ...props.season, ...values };
  emit("proceed", updatedObject);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete", props.itineraryProduct.id);
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group v-if="isCreate" label="Select Product" class="loading-select">
            <b-form-select v-bind="productIdAttrs" v-model="productId" :options="selectProductOptions" />
            <b-form-invalid-feedback :state="false">{{ errors.productId }}</b-form-invalid-feedback>
          </b-form-group>
          <div v-else>
            {{ props.itineraryProduct?.productName }}
            <div class="text-danger "><small>Deleting will remove all policies and departures</small></div>

          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left">
        <LoadingButton v-if="!isCreate" variant="danger" type="submit" :loading="deleting" @click="proceedDelete" :disabled="saving">Delete</LoadingButton>
      </div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton v-if="isCreate" variant="primary" type="submit" :loading="saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>
