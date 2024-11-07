<script setup>
import CountDisplay from "@/components/count-display.vue";
import ResourceCard from "@/components/resource-card.vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";
import { ref, computed, onMounted } from "vue";
import IdBadge from "@/components/id-badge.vue";

const props = defineProps(["product"]);

const editProductLink = computed(() => {
  return { name: "product-edit", params: { productId: props.product.id } };
});

// const itinerariesProductLink = computed(() => {
//   return { name: "product-itineraries", params: { productId: props.product.id } };
// });

const roomsProductLink = computed(() => {
  return { name: "product-rooms", params: { productId: props.product.id } };
});

onMounted(async () => {
  console.log(props.product);
});
</script>

<template>
  <ResourceCard>
    <template v-slot:default>
      <!-- Title / Stats -->
      <div class="d-flex flex-column">
        <strong class="text-dark">{{ props.product.name }}</strong>
        <small>{{ props.product.supplierName }}</small>
        <div class="mt-1">Wordpress Id:<IdBadge :display="props.product.wpId" class="m-1" :isLink="true"></IdBadge></div>
        <div class="mt-1">External Id:<IdBadge :display="props.product.externalIdentifier" class="m-1" :isLink="true"></IdBadge></div>

      </div>
      <!-- Edit -->
      <router-link :to="editProductLink">
        <b-button variant="soft-primary" pill class="float-end">Edit</b-button>
      </router-link>
    </template>
    <!-- Bottom props.product.itineraries.length-->
    <template v-slot:bottom>
      <CountDisplay class="mt-2" title="Rooms" titleSingle="Room" :count="props.product.rooms.length" :link="roomsProductLink" minWidth="100%"></CountDisplay>
    </template>
  </ResourceCard>
</template>

<style scoped lang="scss">
.card {
  width: 350px;
  margin-bottom: 0;
}

.card-body {
  display: grid;
  grid-template-columns: 1fr min-content;
  row-gap: 1.5rem;
}
</style>
