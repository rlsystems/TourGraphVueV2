<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();

const breadcrumbs = computed(() => route.meta?.breadcrumbs || []);
const currentRouteName = computed(() => route.name);
</script>

<template>
  <ul class="breadcrumb m-0 d-none d-sm-flex">
    <template v-if="breadcrumbs.length">   <!-- check if breadcrumbs are added in route's meta -->
      <li v-for="item in breadcrumbs" class="breadcrumb-item" :class="{'active': currentRouteName === item.routerName}">
        <RouterLink v-if="item.routerName" :to="{ name: item.routerName }">{{ item.label }}</RouterLink>
        <span v-else>{{ item.label }}</span>
      </li>
    </template>
    <template v-else>
      <li class="breadcrumb-item">{{ currentRouteName }}</li>
    </template>
  </ul>
</template>
