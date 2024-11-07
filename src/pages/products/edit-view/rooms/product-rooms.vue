<script setup>
import CountLabel from '@/components/count-label.vue'

import RoomModal from './components/room-modal.vue'
import RoomCard from './components/room-card.vue'

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

  <!-- Main Content -->
  <div v-if="!loading">
    <div v-if="roomsStore.productRooms" class="grid-layout">
      <RoomCard :room="room" v-for="room in roomsStore.productRooms" :key="room.id" :productId="props.productId" :hideEdit="accountStore.userBasic"/>
    </div>
    <p v-else class="text-center">No rooms found</p>
  </div>
  <div v-else class="d-flex justify-content-center">
    <span class="spinner-border spinner-border-sm avatar-xs text-primary" role="status" aria-hidden="true"></span>
  </div>

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

