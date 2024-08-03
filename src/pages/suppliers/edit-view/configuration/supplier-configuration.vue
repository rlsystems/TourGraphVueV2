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


const emit = defineEmits(["proceed", "proceedDelete"]);

const suppliersLoading = ref(false);
const updating = ref(false);
const deleting = ref(false);

// initial values
const initialValues = ref({
  name: suppliersStore.supplier?.name,
  notes: suppliersStore.supplier?.notes,

});

// schema
const schema = yup.object({
  name: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta, setFieldValue, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [notes, notesAttrs] = defineField("notes");


const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// handle submit
const proceed = handleSubmit(async (values) => {
  let updatedSupplier = { ...suppliersStore.supplier, ...values }; // get the original row object and overwrite any updated fields with new values
  updating.value = true;
  if (await suppliersStore.updateSupplier(updatedSupplier)) {

    suppliersStore.currentSupplier = updatedSupplier; 
  }

  updating.value = false;
});

const proceedDelete = handleSubmit(async (values) => {
  deleting.value = true;
  if (await suppliersStore.deleteSupplier(suppliersStore.supplier.id)) {
    router.push("/suppliers");
  }
  deleting.value = false;
});

// watcher
watch(
  () => suppliersStore.supplier,
  () => {
    resetForm({
      values: {
        name: suppliersStore.supplier.name,
        notes: suppliersStore.supplier.notes,
      },
    });
  }
);
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="form-container">
        <div class="form-block-title">Supplier Details</div>
        <!-- Form -->
        <form @submit="proceed" class="my-2">
          <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 400px">
            <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
            <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Notes" label-for="notes" class="mb-2" style="max-width: 600px">
            <b-form-textarea type="text" rows="3" v-bind="notesAttrs" v-model="notes" />
            <b-form-invalid-feedback :state="false">{{ errors.notes }}</b-form-invalid-feedback>
          </b-form-group>

        </form>
      </div>
      <!-- Buttons -->
      <div class="d-flex flex-row-reverse">
        <LoadingButton variant="primary" type="submit" class="mx-2" :loading="updating" @click="proceed" :disabled="!canProceed">Save Changes</LoadingButton>
        <LoadingButton variant="danger" type="submit" :loading="deleting" @click="proceedDelete" :disabled="updating">Delete</LoadingButton>
      </div>
    </div>
  </div>
</template>
