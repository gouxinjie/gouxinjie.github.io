<script setup lang="ts">
/**
 * @name PoetryDisplay
 * @description 诗词展示组件
 * @author gxj
 * @date 2025/9/10
 */

interface PoetryProps {
  /** 诗词标题 */
  title: string;
  /** 作者信息 */
  author: string;
  /** 朝代 */
  dynasty: string;
  /** 诗词内容 */
  content: string[];
  /** 注释信息（可选） */
  notes?: string[];
  /** 主旨 */
  main: string;
  /** 寓意 */
  moral?: string;
}

withDefaults(defineProps<PoetryProps>(), {
  notes: () => [],
  moral: ""
});
</script>

<template>
  <div class="poetry-container">
    <!-- 标题部分 -->
    <h3 class="poetry-title">{{ title }}</h3>

    <!-- 作者信息 -->
    <div class="poetry-author">
      <div class="author-avatar">
        <span>{{ author.charAt(0) }}</span>
      </div>
      <span>{{ author }}〔{{ dynasty }}〕</span>
    </div>

    <!-- 诗词内容 -->
    <div class="poetry-content">
      <p v-for="(line, index) in content" :key="index">{{ line }}</p>
    </div>

    <!-- 注释部分 -->
    <div class="poetry-notes" v-if="notes.length > 0">
      <span class="note">译文：</span>
      <p v-for="(note, index) in notes" :key="index">{{ note }}</p>
    </div>

    <!-- 寓意 -->
    <div class="poetry-notes" v-if="moral">
      <span class="note">寓意：</span>
      <p>{{ moral }}</p>
    </div>

    <!-- 主旨 -->
    <div class="poetry-main">{{ main }}</div>
  </div>
</template>

<style lang="scss" scoped>
@use "./poetry-base" as pb;

// 最大容器
.poetry-container {
  @include pb.poetry-container(0 0 20px, 24px);
}

.poetry-title {
  margin: 0;
  padding-top: 0;
  border: none;
}

.poetry-author {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .author-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-bg-soft);
    span {
      font-size: 13px;
      font-weight: 500;
      color: var(--vp-c-brand-1);
    }
  }

  span {
    font-size: 13px;
    color: var(--vp-c-text-2);
  }
}

.poetry-content {
  @include pb.poetry-content(6px 0);
}

// 注释部分
.poetry-notes {
  @include pb.poetry-notes(15px);
}

// 主旨部分
.poetry-main {
  @include pb.poetry-main;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .poetry-container {
    padding: 40px 20px 20px 20px;
  }
}
</style>
