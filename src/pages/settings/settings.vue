<script setup>
import Layout from "@/components/layout/layout.vue";
import { onMounted, ref, computed, watch } from "vue";
import LoadingButton from "@/components/loading-button.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

const initialLoad = ref(true);
const submitting = ref(false);

onMounted(async () => {
  await itinerariesStore.getCronSchedule();
  resetForm({
    values: {
      cronExpression: itinerariesStore.appSettings.cronExpression,
    },
  });

  initialLoad.value = false;
});

// initial values
const initialValues = ref({
  cronExpression: itinerariesStore.appSettings?.cronExpression,
});

// schema
const schema = yup.object({
  cronExpression: yup.string().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta, setFieldValue, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [cronExpression, cronExpressionAttrs] = defineField("cronExpression");
const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// handle submit
const proceed = handleSubmit(async (values) => {
  let updatedAppSettings = { ...itinerariesStore.appSettings, ...values }; // get the original row object and overwrite any updated fields with new values

  submitting.value = true;
  if (await itinerariesStore.updateCronSchedule(values)) {
    itinerariesStore.currentAppSettings = updatedAppSettings;
  }

  submitting.value = false;
});
</script>

<template>
  <Layout>
    <!-- Main Row -->
    <div class="card">
      <div class="card-body">
        <div class="form-container">
          <div class="form-block-title">Settings</div>
          <!-- Form -->
          <form @submit="proceed" class="my-2">
            <b-form-group label="Cron Expression" label-for="cronExpression" class="mb-2" style="max-width: 400px">
              <b-form-input type="text" v-bind="cronExpressionAttrs" v-model="cronExpression" id="cronExpression" />
              <b-form-invalid-feedback :state="false">{{ errors.cronExpression }}</b-form-invalid-feedback>
            </b-form-group>
          </form>
          <div>
            <label> GBP Exchange Rate </label>
            <div class="text-success">{{ itinerariesStore.appSettings?.gbpExchangeRate }}</div>
            
          </div>
        </div>
        <!-- Buttons -->
        <div class="d-flex flex-row-reverse">
          <LoadingButton variant="primary" type="submit" class="mx-2" :loading="submitting" @click="proceed" :disabled="!canProceed">Save Changes</LoadingButton>
        </div>
      </div>
    </div>
  </Layout>
</template>
