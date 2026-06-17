<template>
  <div class="copy-md-container">
    <button @click="copyMarkdown" class="copy-md-btn" :class="{ copied, loading: isLoading }">
      <svg
        v-if="isLoading"
        class="spinner"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
          opacity="0.5"
        />
        <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
          <animateTransform
            attributeName="transform"
            dur="1s"
            from="0 12 12"
            repeatCount="indefinite"
            to="360 12 12"
            type="rotate"
          />
        </path>
      </svg>
      <svg
        v-else-if="!copied"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
      </svg>
      <span>{{ isLoading ? '正在获取...' : copied ? '已复制成功' : '复制完整 Markdown' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useData } from 'vitepress';

const { page } = useData();
const copied = ref(false);
const isLoading = ref(false);

const copyMarkdown = async () => {
  if (isLoading.value || copied.value) return;

  isLoading.value = true;
  try {
    const relativePath = page.value.relativePath;

    // 使用 Vite 的 import.meta.glob 动态导入所有的 markdown 文件原始内容
    // 注意: { as: 'raw' } 是 Vite 特有的功能，用于将文件作为字符串导入
    const modules = import.meta.glob('../../**/*.md', { query: '?raw', import: 'default' });

    // 构建匹配当前页面的键名
    const moduleKey = `../../${relativePath}`;

    if (modules[moduleKey]) {
      // 执行导入函数获取内容
      const text = (await modules[moduleKey]()) as string;

      await navigator.clipboard.writeText(text);
      copied.value = true;

      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } else {
      throw new Error(`找不到文件: ${moduleKey}`);
    }
  } catch (e) {
    console.error('复制 Markdown 失败:', e);
    alert('获取内容失败，请查看控制台');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.copy-md-container {
  display: flex;
  justify-content: flex-end;
  margin-top: -46px; /* 向上偏移，使其停靠在标题右侧 */
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
}

.copy-md-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.copy-md-btn:hover:not(.loading) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft-up);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.copy-md-btn:active:not(.loading) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.copy-md-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.copy-md-btn.copied {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-dimm);
}

.copy-md-btn svg {
  font-size: 15px;
  transition: transform 0.2s ease;
}

.copy-md-btn:hover:not(.loading) svg {
  transform: scale(1.05);
}
</style>
