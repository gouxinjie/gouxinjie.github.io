<script setup lang="ts">
/**
 * @name update
 * @description 标题下添加时间  TODO: 暂未使用
 * 后面参考：http://localhost:5173/layout.html#frontmatter 进行实现
 */

import { useData } from "vitepress";
import { computed } from "vue";

const { page } = useData();

const date = computed(() => new Date(page.value.lastUpdated!));
console.log("date:", date.value);
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
