<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";

const emit = defineEmits(["proceedUpdate", "proceedCreate", "cancel", "proceedDelete"]);

// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
});

const isCreate = computed(() => {
  return !props.data.explicitRate;
});

// initial values
const initialValues = ref({
  useExplicitBaseAmount: isCreate.value ? false : props.data.explicitRate.useExplicitBaseAmount,
  baseAmount: isCreate.value ? 0 : props.data.explicitRate.baseAmount,
  usePromoAmount: isCreate.value ? false : props.data.explicitRate.usePromoAmount,
  promoAmount: isCreate.value ? 0 : props.data.explicitRate.promoAmount,
  hasAvailability: isCreate.value ? true : props.data.explicitRate.hasAvailability,
  roomsAvailable: isCreate.value ? props.data.numberOfRooms : props.data.explicitRate.roomsAvailable,
});

// schema
const schema = yup.object({
  roomsAvailable: yup.number().min(1).max(props.data.numberOfRooms)
});



// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [useExplicitBaseAmount, useExplicitBaseAmountAttrs] = defineField("useExplicitBaseAmount");
const [baseAmount, baseAmountAttrs] = defineField("baseAmount");
const [usePromoAmount, usePromoAmountAttrs] = defineField("usePromoAmount");
const [promoAmount, promoAmountAttrs] = defineField("promoAmount");
const [hasAvailability, hasAvailabilityAttrs] = defineField("hasAvailability");
const [roomsAvailable, roomsAvailableAttrs] = defineField("roomsAvailable");

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
  if (isCreate.value) {
    emit("proceedCreate", values);
  } else {
    values["id"] = props.data.explicitRate.id;
    emit("proceedUpdate", values);
  }
});


onMounted(async () => {
  console.log(props.data);
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="mb-3">
        <!-- Availability -->
        <div class="grid mb-4" style="min-height: 5.5rem;">
          <b-form-checkbox v-bind="hasAvailabilityAttrs" v-model="hasAvailability" switch @change="roomsAvailable = props.data.numberOfRooms">Has Availability</b-form-checkbox>
          <b-form-group v-if="hasAvailability" label="Rooms Available" class="mt-2">
            <b-form-input type="text" v-bind="roomsAvailableAttrs" v-model="roomsAvailable" id="roomsAvailable" />
            <b-form-invalid-feedback :state="false">{{ errors.roomsAvailable }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- Base Amount -->
        <div class="form-block-title mt-4">Base Explicit Rate</div>
        <div class="grid mb-4">
          <b-form-checkbox v-bind="useExplicitBaseAmountAttrs" v-model="useExplicitBaseAmount" switch>Use Explicit</b-form-checkbox>
          <b-form-group label="Base Amount" class="mt-2">
            <div class="input-group flex-nowrap">
              <b-form-input type="text" v-bind="baseAmountAttrs" v-model="baseAmount" id="baseAmount" />
              <span class="input-group-text">USD</span>
            </div>
            <b-form-invalid-feedback :state="false">{{ errors.baseAmount }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
        <!-- Promo Amount -->
        <div class="form-block-title">Promo Explicit Rate</div>
        <div class="grid mb-2">
          <b-form-checkbox v-bind="usePromoAmountAttrs" v-model="usePromoAmount" switch>Use Explicit</b-form-checkbox>
          <b-form-group label="Promo Amount" class="mt-2">
            <div class="input-group flex-nowrap">
              <b-form-input type="text" v-bind="promoAmountAttrs" v-model="promoAmount" id="promoAmount" />
              <span class="input-group-text">USD</span>
            </div>
            <b-form-invalid-feedback :state="false">{{ errors.promoAmount }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left"></div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton variant="primary" type="submit" :loading="props.saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>

<style scoped lang="scss">
.form-block-title {
  margin-bottom: 0;
}
.grid {
  display: grid;
  grid-template-columns: 10rem 13rem;
  column-gap: 3rem;
  align-items: center;
  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }

  & .form-switch {
    margin-top: 2.3rem;
  }
}


</style>
