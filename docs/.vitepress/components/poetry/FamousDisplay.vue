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

const props = withDefaults(defineProps<PoetryProps>(), {
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
// 最大容器
.poetry-container {
  position: relative;
  margin: 40px 0 20px;
  border-radius: 8px;
  padding: 18px 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid var(--vp-c-divider);
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    // transform: translateY(-6px);
  }

  // 深色模式样式
  :deep(.dark) & {
    background-color: rgba(30, 30, 30, 0.9);
    border-color: var(--vp-c-divider-dark);
  }
}

.poetry-content {
  margin-bottom: 8px;
  p {
    font-size: 16px;
    line-height: 1.5;
    margin: 8px 0;
    white-space: pre-line;
    color: var(--vp-c-text-1);
  }
}
// 注释部分
.poetry-notes {
  .note {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin: 10px 0;
  }
  margin-top: 22px;
  border-top: 1px solid var(--vp-c-divider);
  p {
    font-size: 14px;
    line-height: 1.5;
    // font-style: italic;
    color: var(--vp-c-text-3);
    margin: 5px 0;
  }
}
// 主旨部分
.poetry-main {
  position: absolute;
  top: 5px;
  right: 5px;
  border: 1px solid var(--vp-badge-info-border);
  border-radius: 12px;
  padding: 0px 10px;
  font-size: 13px;
  // color: var(--vp-badge-info-text);
  color: var(--vp-c-brand-1);
  background-color: var(--vp-badge-info-bg);
}
</style>
