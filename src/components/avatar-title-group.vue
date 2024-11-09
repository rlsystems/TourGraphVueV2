<template>
  <div class="avatar-title-group" >
    <div v-if="!props.hideAvatar" class="avatar-sm me-2 d-flex align-items-center justify-content-center">
      <div v-if="!props.image" class="h-100 w-100 rounded-circle d-flex align-items-center justify-content-center bg-light">{{ getInitials(props.title) }}</div>
      <img v-else class="rounded-circle w-100 h-100" :src="props.image" />
    </div>
    <div class="d-flex flex-column" :style="{ maxWidth: props.maxWidth }">
      <strong v-if="props.title">{{ props.title }}</strong>
      <small v-if="props.subtitle || props.subtitle == ''">{{ props.subtitle }}</small>
      <small v-if="props.subtitle2 || props.subtitle2 == ''">{{ props.subtitle2 }}</small>

    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import getInitials from "@/utils/getInitials.js";

const props = defineProps(["title", "subtitle", "subtitle2", "image", "hideAvatar", "maxWidth"]);
</script>

<style lang="scss" scoped>

.avatar-title-group {
  //flex-direction: column;
  display: grid;
  align-items: center;
  gap: 0.5rem;
  grid-template-columns: max-content 1fr;
  min-width: 10rem;
}
</style>
