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
}

const props = withDefaults(defineProps<PoetryProps>(), {
  notes: () => []
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
      <p v-for="(note, index) in notes" :key="index">{{ note }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.poetry-container {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

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
      color: var(--vp-c-text-2);
    }
  }

  span {
    font-size: 13px;
    color: var(--vp-c-text-2);
  }
}

.poetry-content {
  margin-bottom: 8px;
  p {
    font-size: 16px;
    line-height: 1;
    margin-bottom: 12px;
    white-space: pre-line;
    color: var(--vp-c-text-1);
  }
}
// 注释部分
.poetry-notes {
  margin-top: 22px;
  border-top: 1px solid var(--vp-c-divider);
  p {
    font-size: 14px;
    //  line-height: 1;
    // font-style: italic;
    color: var(--vp-c-text-3);
    margin: 0;
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .poetry-container {
    padding: 40px 20px;
  }

  .poetry-title {
    font-size: 20px;
  }

  .poetry-content p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .poetry-container {
    padding: 30px 16px;
  }

  .poetry-title {
    font-size: 18px;
  }

  .poetry-content p {
    font-size: 15px;
  }
}
</style>
