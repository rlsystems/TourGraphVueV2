<script setup>
import { computed, ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import LoadingButton from "@/components/loading-button.vue";
import Incrementer from "@/components/incrementer.vue";

const emit = defineEmits(["proceed", "cancel", "proceedDelete"]);

import { useProductsStore } from "@/stores/productsStore";
const productsStore = useProductsStore();

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
  numberOfRooms: props.data?.numberOfRooms || 1,
  maxOccupancy: props.data?.maxOccupancy || 2,
  priority: props.data?.priority || 0,
  wpId: props.data?.wpId || "",
  externalIdentifier: props.data?.externalIdentifier || "",
});

// schema
const schema = yup.object({
  name: yup.string().required(),
  numberOfRooms: yup.number().required().min(1, 'Must be greater than 0'),
  maxOccupancy: yup.number().required(),
});

// veevalidate form object
const { handleSubmit, defineField, errors, meta } = useForm({
  initialValues: initialValues,
  validationSchema: schema,
});

// fields
const [name, nameAttrs] = defineField("name");
const [numberOfRooms, numberOfRoomsAttrs] = defineField("numberOfRooms");
const [priority, priorityAttrs] = defineField("priority");
const [maxOccupancy, maxOccupancyAttrs] = defineField("maxOccupancy");
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
  updatedObject.productId = productsStore.currentProduct.id;
  emit("proceed", updatedObject);
});

const proceedDelete = handleSubmit(() => {
  emit("proceedDelete", props.data.id);
});

const addOccupancy = async () => {
  maxOccupancy.value += 1;
};

const subtractOccupancy = async () => {
  maxOccupancy.value -= 1;
};
</script>

<template>
  <b-modal v-model="show" :title="title" title-class="h4" size="lg" hide-footer @cancel="close" @close="close" @hidden="close">
    <div class="">
      <form @submit="proceed" class="my-2">
        <div class="name-row">
          <b-form-group label="Name" label-for="name" class="mb-2" style="max-width: 500px">
            <b-form-input type="text" v-bind="nameAttrs" v-model="name" id="name" />
            <b-form-invalid-feedback :state="false">{{ errors.name }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Number of rooms" label-for="numberOfRooms" class="mb-2" style="max-width: 150px">
            <b-form-input type="number" v-bind="numberOfRoomsAttrs" v-model="numberOfRooms" id="numberOfRooms" />
            <b-form-invalid-feedback :state="false">{{ errors.numberOfRooms }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Priority" label-for="priority" class="mb-2" style="max-width: 100px">
            <b-form-input type="number" v-bind="priorityAttrs" v-model="priority" />
            <b-form-invalid-feedback :state="false">{{ errors.priority }}</b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="occupancy-row">
          <label>Max Occupancy</label>
          <Incrementer :count="maxOccupancy" :min="1" @add="addOccupancy" @subtract="subtractOccupancy"></Incrementer>
          <h3>
            <b-badge pill class="bg-info-subtle text-info ms-1">{{ filters.formatOccupancy(maxOccupancy) }} Occupancy</b-badge>
          </h3>
        </div>
        <div class="form-block-title mt-4">Identifiers</div>

        <div class="id-row">
          <b-form-group label="WordPress Id" label-for="wpId" style="max-width: 150px">
            <b-form-input type="text" v-bind="wpIdAttrs" v-model="wpId" id="wpId" />
            <b-form-invalid-feedback :state="false">{{ errors.wpId }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="External Identifier" label-for="externalIdentifier" style="max-width: 150px">
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
  grid-template-columns: 1fr max-content 1fr;
  column-gap: 2rem;

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 0px;
  }
}

.occupancy-row {
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  margin-top: 1rem;
  column-gap: 2rem;
  align-items: center;
}

.id-row {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 2rem;
}
</style>
