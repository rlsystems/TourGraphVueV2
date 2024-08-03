<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          {{ year }}
          © {{ layoutStore.title }}
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useLayoutStore } from "@/stores/_core/layoutStore";
const layoutStore = useLayoutStore(); 
const year = new Date().getFullYear();
</script>
