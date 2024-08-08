<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";
import LoadingSelect from "@/components/loading-select.vue";

import { useSuppliersStore } from "@/stores/suppliersStore";

const suppliersStore = useSuppliersStore();
const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);
const loadingSuppliers = ref(false);

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
  supplierId: {
    type: String,
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
  supplierId: props.supplierId ? props.supplierId : props.data?.supplierId || null, // will have supplierId when creating new product in supplier edit view
});

// schema
const schema = yup.object({
  name: yup.string().required(),
  supplierId: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [supplierId, supplierIdAttrs] = defineField("supplierId");

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
  let updatedProduct = { ...props.data, ...values }; // get the original row object and overwrite any updated fields with new values
  emit("proceed", updatedProduct);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete", props.data.id);
});

const selectSupplierOptions = ref(null);

onMounted(async () => {
  if (!props.supplierId) { // selection will only display if there is no supplierId passed to modal (like in supplier list view)
    loadingSuppliers.value = true;
    await suppliersStore.getSuppliers();
    loadingSuppliers.value = false;
    selectSupplierOptions.value = suppliersStore.suppliersFull.map((obj) => ({
      value: obj.id,
      text: obj.name,
    }));
    selectSupplierOptions.value.unshift({
      value: null,
      text: "Select a supplier",
    });
  }
});
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" size="lg" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 400px">
          <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
          <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
        </b-form-group>

        <LoadingSelect v-if="!props.supplierId" v-bind="supplierIdAttrs" v-model="supplierId" :options="selectSupplierOptions" :loading="loadingSuppliers" label="Supplier" id="supplierSelect" style="max-width: 400px" />
        <b-form-invalid-feedback :state="false">{{ errors.supplierId }}</b-form-invalid-feedback>



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
