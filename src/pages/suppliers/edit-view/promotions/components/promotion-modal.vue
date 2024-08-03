<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";

const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

import { useSuppliersStore } from "@/stores/suppliersStore";
const suppliersStore = useSuppliersStore();

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
  wpId: props.data?.wpId || "",
  externalIdentifier: props.data?.externalIdentifier || "",
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
  updatedObject.supplierId = suppliersStore.supplier.id;
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
        <div class="name-row">
          <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 400px">
            <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
            <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
          </b-form-group>
        </div>    
        <div class="form-block-title mt-4">Identifiers</div>
        <div class="id-row ">
          <b-form-group label="WordPress Id" label-for="wpId" style="max-width: 150px">
            <b-form-input type="text" v-bind="wpIdAttrs" v-model="wpId" id="wpId" />
            <b-form-invalid-feedback :state="false">{{ errors.wpId }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="External Identifier" label-for="externalIdentifier"  style="max-width: 150px">
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
.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }
}


.id-row {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 2rem;

}
</style>
