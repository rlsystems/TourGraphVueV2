<script setup>
import { computed, ref, onMounted } from "vue";
import {storeToRefs} from "pinia";

import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";
import VueDatePicker from '@vuepic/vue-datepicker';

const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

import {usePoliciesStore} from "@/stores/policiesStore.js";
const policiesStore = usePoliciesStore();

import {useLayoutStore} from "@/stores/_core/layoutStore.js";
const layoutStore = useLayoutStore();

const { theme } = storeToRefs(layoutStore)
// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  policy: {
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

// initial values
const initialValues = ref({
  startDate: props.policy?.startDate || "",
});

// schema
const schema = yup.object({
  startDate: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [startDate, startDateAttrs] = defineField("startDate");

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
  let updatedObject = { ...props.data, ...values }; // get the original row object and overwrite any updated fields with new values
  emit("proceed", updatedObject);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete");
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group label="Start Date" label-for="startDate" class="mb-2" style="max-width: 400px;">
            <VueDatePicker v-bind="startDateAttrs" v-model="startDate" :dark="theme === 'dark'" model-type="yyyy-MM-dd" auto-apply :hide-input-icon="true" :enable-time-picker="false" placeholder="Select Date" />
            <b-form-invalid-feedback :state="false">{{ errors.startDate }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left">
        <LoadingButton v-if="!isCreate" variant="danger" type="submit" :loading="deleting" @click="proceedDelete" :disabled="saving">Delete</LoadingButton>
      </div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton variant="primary" type="submit" :loading="saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>


