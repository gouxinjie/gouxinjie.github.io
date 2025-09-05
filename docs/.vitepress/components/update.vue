<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

/**
 * @description 标题下添加时间
 */

const { page } = useData();

const date = computed(() => new Date(page.value.lastUpdated!));
console.log("date:",date.value);

</script>

<template>
  <div class="LastUpdated">
    <p>更新时间: {{ date.toLocaleString() }}</p>
  </div>
</template>

<style>
.LastUpdated {
  color: var(--vp-c-text-2);
}
</style>
