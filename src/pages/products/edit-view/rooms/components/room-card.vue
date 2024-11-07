<script setup>
import ResourceCard from "@/components/resource-card.vue";
import IdBadge from "@/components/id-badge.vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";

import RoomModal from "./room-modal.vue";
import { ref } from "vue";

import { useRoomsStore } from "@/stores/roomsStore";
const roomsStore = useRoomsStore();

const props = defineProps(["room", "productId", "hideEdit"]);

const show = ref(false);
const updating = ref(false);
const deleting = ref(false);

const submitUpdate = async (data) => {
  updating.value = true;
  if (await roomsStore.updateRoom(data)) {
    await roomsStore.getProductRooms(props.productId);
    show.value = false;
  }
  updating.value = false;
};

const submitDelete = async (id) => {
  deleting.value = true;
  if (await roomsStore.deleteRoom(id)) {
    await roomsStore.getProductRooms(props.productId);
    show.value = false;
  }
  deleting.value = false;
};
</script>

<template>
  <ResourceCard divider>
    <template v-slot:default>
      <div class="room-title">
        <div class="d-flex flex-column">
          <strong class="text-dark">{{ props.room.name }}</strong>
          <small>{{ filters.formatPlural(props.room.numberOfRooms, "Room", "Rooms") }}</small>
          <small>{{ filters.formatOccupancy(props.room.maxOccupancy) }} Occupancy</small>
        </div>
        <div v-if="props.room.priority != 0" class="room-title__priority">
          <b-badge class="room-title__priority__badge bg-danger-subtle text-info-pink">{{ props.room.priority }}</b-badge>
        </div>
      </div>
      <div class="button-area">
        <b-button v-if="!props.hideEdit" variant="soft-primary" pill class="float-end" @click="show = true">Edit</b-button>
      </div>
    </template>

    <template v-slot:bottom>
      <div class="identifier">
        <div class="identifier__title">Wordpress ID</div>
        <div class="identifier__value">
          <IdBadge :display="props.room.wpId"></IdBadge>
        </div>
      </div>
      <div class="identifier">
        <div class="identifier__title">External Identifier</div>
        <div class="identifier__value">
          <IdBadge :display="props.room.externalIdentifier"></IdBadge>
        </div>
      </div>
    </template>
  </ResourceCard>

  <RoomModal v-if="show" title="Edit Room" :data="props.room" :saving="updating" :deleting="deleting" @proceed="submitUpdate" @proceedDelete="submitDelete" @cancel="show = false" enableDelete />
</template>

<style lang="scss" scoped>


.room-title {
  display: flex;
  gap: .5rem;

  &__priority {
    display: flex;

    &__badge {
      height: 1.3rem;
      width: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
  }
}
</style>
