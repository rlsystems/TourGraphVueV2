<script setup>
import { computed, ref, onMounted } from "vue";
import {storeToRefs} from "pinia";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";
import VueDatePicker from '@vuepic/vue-datepicker';

import {useLayoutStore} from "@/stores/_core/layoutStore.js";
const layoutStore = useLayoutStore();

const { theme } = storeToRefs(layoutStore)
const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  policyId: { // need for create
    type: String,
    required: false,
  },
  seasonId: { // need for create
    type: String,
    required: false,
  },
  seasonRange: {
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


const minRange = '2001-01-01'; // year will be ignored, any non-leap year will do
const maxRange = '2002-01-01';
const startDate = '2001-01-02'


onMounted(() => {
  console.log(minRange, maxRange);
});

// initial values
const initialValues = ref({
  seasonId: props.isCreate ? props.seasonId : props.seasonRange?.seasonId,
  policyId: props.isCreate ? props.policyId : props.seasonRange?.policyId,
  dateRange: props.isCreate ? null : [props.seasonRange.startDate, props.seasonRange.endDate],
});

// schema
const schema = yup.object({
    dateRange: yup.array().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [dateRange, dateRangeAttrs] = defineField("dateRange");

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
  let updatedObject = { ...props.seasonRange, ...values };
  emit("proceed", updatedObject);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete", props.seasonRange.id);
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
        <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group label="Date Range" label-for="startDate" class="mb-2" >
            <VueDatePicker v-bind="dateRangeAttrs" v-model="dateRange" id="startDate" :dark="theme === 'dark'" auto-apply :hide-input-icon="true" :enable-time-picker="false" placeholder="Select Date" model-type="yyyy-MM-dd" range multi-calendars disable-year-select format="MMM-dd" :min-date="minRange" :max-date="maxRange" :start-date="startDate" prevent-min-max-navigation />
            <b-form-invalid-feedback :state="false">{{ errors.dateRange }}</b-form-invalid-feedback>
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


