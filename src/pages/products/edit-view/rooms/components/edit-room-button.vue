<script setup>
import {  computed } from "vue";
const props = defineProps(["room", "hideEdit"]);

import RoomModal from "./room-modal.vue";
import { ref } from "vue";

import { useRoomsStore } from "@/stores/roomsStore";
const roomsStore = useRoomsStore();

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const submitUpdate = async (data) => {
  updating.value = true;
  if (await roomsStore.updateRoom(data)) {
    await roomsStore.getProductRooms(props.room.productId);
    show.value = false;
  }
  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await roomsStore.deleteRoom(id)) {
    await roomsStore.getProductRooms(props.room.productId);
    show.value = false;
  }
  deleting.value = false;
};

</script>

<template>
  <!-- Row button and Edit modal -->
  <b-button variant="soft-primary" pill class="float-end" @click="show = true">Edit</b-button>
  <RoomModal v-if="show" title="Edit Room" :data="props.room" :saving="updating" :deleting="deleting" @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false" enableDelete />

</template>
