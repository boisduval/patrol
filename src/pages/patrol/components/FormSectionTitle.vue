<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="pl-1 flex items-center">
    <div class="mr-3 rounded-full h-5 w-1.5 shadow-sm" style="background-color: var(--color-primary)" />
    <span class="text-h1 tracking-tight">{{ title }}</span>
  </div>
</template>
