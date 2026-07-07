<script setup lang="ts">
/**
 * @name FamousDisplay
 * @description 名句展示组件
 * @author gxj
 * @date 2025/9/17
 */

interface PoetryProps {
  /** 诗词内容 */
  content: string[];
  /** 注释信息（可选） */
  notes?: string[];
  /** 主旨 */
  main?: string;
}

withDefaults(defineProps<PoetryProps>(), {
  notes: () => []
});
</script>

<template>
  <div class="poetry-container">
    <!-- 诗词内容 -->
    <div class="poetry-content">
      <p v-for="(line, index) in content" :key="index">{{ line }}</p>
    </div>

    <!-- 注释部分 -->
    <div class="poetry-notes" v-if="notes.length > 0">
      <span class="note">译文：</span>
      <p v-for="(note, index) in notes" :key="index">{{ note }}</p>
    </div>

    <!-- 主旨 -->
    <div v-if="main" class="poetry-main">{{ main }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use "./poetry-base" as pb;

// 最大容器
.poetry-container {
  @include pb.poetry-container($shadow: false);
}

.poetry-content {
  @include pb.poetry-content;
}

// 注释部分
.poetry-notes {
  @include pb.poetry-notes;
}

// 主旨部分
.poetry-main {
  @include pb.poetry-main;
}
</style>
