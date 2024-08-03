<script setup>
import LoadingButton from "@/components/loading-button.vue";

import { computed, ref, onMounted, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { useRouter } from "vue-router";
const router = useRouter();

import { useItinerariesStore } from "@/stores/itinerariesStore";
const itinerariesStore = useItinerariesStore();

// refs
const props = defineProps(["itineraryId"]);
const updating = ref(false);
const deleting = ref(false);
const running = ref(false);
const lastRun = ref(itinerariesStore.itinerary?.lastRun);
const runSucceeded = ref(itinerariesStore.itinerary?.runSucceeded);
const recordsChanged = ref(itinerariesStore.itinerary?.recordsChanged);

// initial values
const initialValues = ref({
  productId: itinerariesStore.itinerary?.productId || null,
  enableAutomation: itinerariesStore.itinerary?.enableAutomation || false,
  externalIdentifier: itinerariesStore.itinerary?.externalIdentifier || "",
  requireLengthIdentifier: itinerariesStore.itinerary?.requireLengthIdentifier || false,
  requirePortIdentifier: itinerariesStore.itinerary?.requirePortIdentifier || false,
  isDisembarkation: itinerariesStore.itinerary?.isDisembarkation || false,
  portIdentifier: itinerariesStore.itinerary?.portIdentifier || "",
});

const onEnableAutomationChange = (value) => {
  if (value == false) {
    requirePortIdentifier.value = false;
  }
};

// schema
const schema = yup.object({
  enableAutomation: yup.boolean(),
  externalIdentifier: yup.string().when("enableAutomation", {
    is: true,
    then: (schema) => schema.required("External identifier is required when automation is enabled"),
    otherwise: (schema) => schema.optional(),
  }),
  portIdentifier: yup.string().when("requirePortIdentifier", {
    is: true,
    then: (schema) => schema.required("Port identifier is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta, resetForm } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [enableAutomation, enableAutomationAttrs] = defineField("enableAutomation");
const [externalIdentifier, externalIdentifierAttrs] = defineField("externalIdentifier");
const [requireLengthIdentifier, requireLengthIdentifierAttrs] = defineField("requireLengthIdentifier");
const [requirePortIdentifier, requirePortIdentifierAttrs] = defineField("requirePortIdentifier");
const [isDisembarkation, isDisembarkationAttrs] = defineField("isDisembarkation");
const [portIdentifier, portIdentifierAttrs] = defineField("portIdentifier");

const canProceed = computed(() => {
  return meta.value.dirty && meta.value.valid;
});

// handle submit
const submitUpdate = handleSubmit(async (values) => {
  let updatedItinerary = { ...itinerariesStore.itinerary, ...values };
  updating.value = true;
  if (await itinerariesStore.updateAutomationSettings(updatedItinerary)) {
    itinerariesStore.currentItinerary = updatedItinerary; // update current itinerary in memory
  }
  updating.value = false;
});

const runAutomation = async () => {
  running.value = true;
  await itinerariesStore.runAutomation(props.itineraryId);
  running.value = false;
};

// watcher
watch(
  () => itinerariesStore.itinerary,
  () => {
    resetForm({
      values: {
        productId: itinerariesStore.itinerary.productId,
        enableAutomation: itinerariesStore.itinerary.enableAutomation,
        externalIdentifier: itinerariesStore.itinerary.externalIdentifier,
        requireLengthIdentifier: itinerariesStore.itinerary.requireLengthIdentifier,
        requirePortIdentifier: itinerariesStore.itinerary.requirePortIdentifier,
        isDisembarkation: itinerariesStore.itinerary.isDisembarkation,
        portIdentifier: itinerariesStore.itinerary.portIdentifier,
      },
    });
    lastRun.value = itinerariesStore.itinerary.lastRun;
    runSucceeded.value = itinerariesStore.itinerary.runSucceeded;
    recordsChanged.value = itinerariesStore.itinerary.recordsChanged;
  }
);
</script>

<template>
  <!-- Main Content -->
  <b-row>
    <!-- Form -->
    <b-col lg="6">
      <div class="card">
        <div class="card-body">
          <div class="form-container">
            <!-- Form -->
            <form @submit="proceed">
              <div class="form-block-title mb-3">Configure Automation</div>
              <b-form-checkbox v-bind="enableAutomationAttrs" v-model="enableAutomation" switch @update:modelValue="onEnableAutomationChange">Enable Automation</b-form-checkbox>
              <div v-if="enableAutomation">
                <b-form-group label="External Identifier" label-for="externalIdentifier" class="my-3" style="max-width: 600px">
                  <b-form-input type="text" v-bind="externalIdentifierAttrs" v-model="externalIdentifier" id="externalIdentifier" />
                  <b-form-invalid-feedback :state="false">{{ errors.externalIdentifier }}</b-form-invalid-feedback>
                </b-form-group>
                <div class="mb-3">
                  <b-form-checkbox v-bind="requireLengthIdentifierAttrs" v-model="requireLengthIdentifier" switch>Require Length Identifier</b-form-checkbox>
                </div>
                <div class="mb-3">
                  <b-form-checkbox v-bind="requirePortIdentifierAttrs" v-model="requirePortIdentifier" switch>Require Port Identifier</b-form-checkbox>
                </div>
                <div v-if="requirePortIdentifier">
                  <div class="port-checkbox-row">
                    <b-form-radio name="portCheck" :value="false" v-bind="isDisembarkationAttrs" v-model="isDisembarkation">Embarkation</b-form-radio>
                    <b-form-radio name="portCheck" :value="true" v-bind="isDisembarkationAttrs" v-model="isDisembarkation">Disembarkation</b-form-radio>
                  </div>
                  <b-form-input type="text" v-bind="portIdentifierAttrs" v-model="portIdentifier" id="portIdentifier" style="max-width: 600px" />
                </div>
              </div>
            </form>
          </div>

          <div class="d-flex flex-row-reverse mt-4">
            <LoadingButton variant="primary" type="submit" class="ms-2" :loading="updating" @click="submitUpdate" :disabled="!canProceed">Save Changes</LoadingButton>
          </div>
        </div>
      </div>
    </b-col>
    <!-- Automations -->
    <b-col lg="6">
      <div class="card" v-if="enableAutomation && itinerariesStore.itinerary?.enableAutomation">
        <div class="card-body">
          <div class="form-container">
            <div class="form-block-title">Run Automation</div>
            <div class="automation-grid">
              <div>
                <small>Last Run: </small>
                <h4 :class="{ 'text-success': runSucceeded, 'text-danger': !runSucceeded }">
                  {{ filters.formatDate(itinerariesStore.itinerary.lastRun, "automation") }}
                </h4>
                <small>Records Changed</small>
                <h4 :class="{ 'text-success': runSucceeded, 'text-danger': !runSucceeded }">
                  {{ recordsChanged }}
                </h4>
                <small>Run Status</small>
                <h4 :class="{ 'text-success': runSucceeded, 'text-danger': !runSucceeded }">
                  {{ running ? "Running Automation..." : runSucceeded ? "Success" : "Fail" }}
                </h4>
              </div>
              <LoadingButton variant="primary" :loading="running" @click="runAutomation">Run Automation</LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<style lang="scss" scoped>
.automation-grid {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  align-items: end;
}

.name-row {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 2rem;
}

.port-checkbox-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.seasons-grid {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    &__default {
      padding: 0.5rem 1rem;
      border: 1px solid var(--nano-border-color);
      border-radius: 5px;
    }
  }
  &__control {
    display: flex;
    align-items: flex-end;
  }
}
</style>
