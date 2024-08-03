<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useLayoutStore } from "@/stores/_core/layoutStore";

const layoutStore = useLayoutStore();


onMounted(async () => {
  layoutStore.init();
});

</script>
