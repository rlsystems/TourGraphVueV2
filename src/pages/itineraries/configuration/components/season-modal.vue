<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";

const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

// props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  itineraryId: { // need for create
    type: String,
    required: false,
  },
  season: {
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
  name: props.season?.name,
  itineraryId: props.isCreate ? props.itineraryId : props.season?.itineraryId,
});

// schema
const schema = yup.object({
  name: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");

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
  emit("proceedDelete", props.season.id);
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 400px">
            <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
            <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
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


