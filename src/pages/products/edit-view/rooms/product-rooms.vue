<script setup>
import CountLabel from "@/components/count-label.vue";
import ClientTable from "@/components/tables/client-table.vue";
import { columns } from "./components/column-config.vue";

import RoomModal from "./components/room-modal.vue";

import { computed, ref, onMounted, watch } from "vue";

import { useRoomsStore } from "@/stores/roomsStore";
const roomsStore = useRoomsStore();

import { useAccountStore } from "@/stores/_core/accountStore";
const accountStore = useAccountStore();

const loading = ref(true);
const props = defineProps(["productId"]);

const showRoomModal = ref(false);
const submitting = ref(false);

onMounted(async () => {
  await roomsStore.getProductRooms(props.productId);
  console.log(roomsStore.productRooms);
  loading.value = false;
});

// modal submit
const submitCreate = async (data) => {
  data.productId = props.productId;
  submitting.value = true;
  if (await roomsStore.createRoom(data)) {
    await roomsStore.getProductRooms(props.productId);
    showRoomModal.value = false;
  }
  submitting.value = false;
};
</script>

<template>
  <!-- Top Row -->
  <b-row>
    <b-col class="d-flex justify-content-between align-items-center mb-3">
      <CountLabel title="Room Types" titleSingle="Room Type" :count="roomsStore.productRooms?.length" :loading="loading"></CountLabel>
      <b-button variant="primary" @click="showRoomModal = true" :disabled="accountStore.userBasic">New Room</b-button>
    </b-col>
  </b-row>

  <!-- Main Row  -->
  <b-row>
    <b-col>
      <!-- Table -->
      <ClientTable :data="roomsStore.productRooms" :columns="columns" :loading="loading" filterPlaceholder="Search Itineraries..."></ClientTable>
    </b-col>
  </b-row>

  <!-- Modal -->
  <RoomModal v-if="showRoomModal" title="Add New Room" :saving="submitting" @proceed="submitCreate" @cancel="showRoomModal = false" />
</template>

<style scoped lang="scss">
.grid-layout {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
