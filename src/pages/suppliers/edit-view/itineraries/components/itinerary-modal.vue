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
  data: {
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
  enableDelete: {
    type: Boolean,
    default: false,
  },
});

// initial values
const initialValues = ref({
  name: props.data?.name || "",
  lengthInNights: props.data?.lengthInNights || 1,
  wpId: props.data?.wpId || "",
});

// schema
const schema = yup.object({
  name: yup.string().required(),
  lengthInNights: yup.number().required().min(1, "Must be greater than 0"),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [lengthInNights, lengthInNightsAttrs] = defineField("lengthInNights");
const [wpId, wpIdAttrs] = defineField("wpId");
const [externalIdentifier, externalIdentifierAttrs] = defineField("externalIdentifier");

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
  emit("proceedDelete", props.data.id);
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" size="lg" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="grid">
          <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 500px">
            <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
            <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Length In Nights" label-for="lengthInNights" class="mb-2" style="max-width: 200px">
            <b-form-input type="number" v-bind="lengthInNightsAttrs" v-model="lengthInNights" id="lengthInNights" />
            <b-form-invalid-feedback :state="false">{{ errors.lengthInNights }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="grid2">
          <b-form-group label="Wordpress ID" label-for="wordpressId" class="mb-2">
            <b-form-input type="text" v-bind="wpIdAttrs" v-model="wpId" id="wordpressId" />
            <b-form-invalid-feedback :state="false">{{ errors.wpId }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="External Identifier" label-for="externalIdentifier" class="mb-2">
            <b-form-input type="text" v-bind="externalIdentifierAttrs" v-model="externalIdentifier" id="externalIdentifier" />
            <b-form-invalid-feedback :state="false">{{ errors.externalIdentifier }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
      </form>
    </div>
    <div class="modal-footer footer-controls border-top-0">
      <div class="footer-controls__left">
        <LoadingButton v-if="enableDelete" variant="danger" type="submit" :loading="deleting" @click="proceedDelete" :disabled="saving">Delete</LoadingButton>
      </div>
      <div class="footer-controls__right">
        <b-button variant="light" @click="close">Close</b-button>
        <LoadingButton variant="primary" type="submit" :loading="saving" @click="proceed" :disabled="!canProceed">Save</LoadingButton>
      </div>
    </div>
  </b-modal>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 1fr 150px 150px;
  column-gap: 20px;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }
}

.grid2 {
  display: grid;
  grid-template-columns: 150px 1fr 150px;
  column-gap: 20px;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }
}
</style>
