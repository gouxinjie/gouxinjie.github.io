<script setup lang="ts">
/**
 * @name SearchList
 * @description  搜索列表组件(全局)
 * @author gxj
 * @date 2024/7/18
 */

import { ref, onMounted, computed } from "vue";
import { withBase } from "vitepress";

interface SidebarItem {
  text: string;
  items: {
    text: string;
    link: string;
  }[];
}

interface SearchItem {
  text: string;
  link: string;
}

interface SearchListProps {
  /** 顶部标题 */
  title?: string;
  /** 路由前缀 - 可以不使用 */
  path?: string;
  /** 需要搜索的的列表 */
  data: SidebarItem[];
}

const props = withDefaults(defineProps<SearchListProps>(), {
  title: "",
  path: ""
});

const search = ref<HTMLInputElement | null>(null);
const query = ref<string>("");

// 将字符串转换为小写，并将连字符 - 替换为空格。
const normalize = (s: string): string => s.toLowerCase().replace(/-/g, " ");

/** 搜索功能 */
const filtered = computed<SidebarItem[]>(() => {
  const normalizedQuery = normalize(query.value);
  const results: SidebarItem[] = [];

  props.data.forEach((parent) => {
    const flattened = flattenSidebarItem(parent);
    // 检查子项是否匹配
    const matchingItems = flattened.items.filter((item) => normalize(item.text).includes(normalizedQuery));
    // 如果有匹配项，将匹配的子项和父级一起存储在 results 数组中
    if (matchingItems.length > 0) {
      results.push({
        ...flattened,
        items: matchingItems
      });
    }
  });

  return results;
});

/** 扁平化 SidebarItem 结构 */
function flattenSidebarItem(item: SidebarItem): SidebarItem {
  // 如果子项本身就已经是 link 层（即 items 的每一项都有 link 字段）
  if (item.items.length && "link" in item.items[0]) {
    return item;
  }

  // 否则说明 items 还嵌套着子 items，需要递归展开
  const flatItems: { text: string; link: string }[] = [];

  item.items.forEach((child: any) => {
    if (child.link) {
      flatItems.push({ text: child.text, link: child.link });
    } else if (child.items) {
      // 递归展开
      child.items.forEach((sub: any) => {
        flatItems.push({ text: sub.text, link: sub.link });
      });
    }
  });

  return {
    text: item.text,
    items: flatItems
  };
}

/** 跳转 */
const jumpTo = (value: SearchItem): void => {
  const linkElement = document.createElement("a");
  linkElement.href = withBase(value.link) + ".html#";
  linkElement.click();
};

onMounted(() => {
  search.value?.focus();
});
</script>

<template>
  <div id="js-index">
    <div class="header">
      <p class="header-title">{{ title }} 目录</p>
      <div class="api-filter">
        <label class="label" for="api-filter">过滤</label>
        <input ref="search" type="search" placeholder="请输入关键字" id="api-filter" v-model="query" />
      </div>
    </div>
    <div class="list" v-for="(item, index) of filtered" :key="index">
      <p class="list-title">{{ item.text }}</p>
      <ul>
        <li class="item" v-for="(value, sphinx) of item.items" :key="sphinx" @click="jumpTo(value)">
          <span>{{ sphinx + 1 }}. {{ value.text }}</span>
          <!-- <a :href="withBase(value.link) + '.html#'"> {{ sphinx + 1 }}. {{ value.text }}</a> -->
        </li>
      </ul>
    </div>

    <div v-if="!filtered.length" class="no-match">没有匹配到 "{{ query }}" .</div>
  </div>
</template>

<!-- ★ 普通样式，保留 scss 嵌套 -->
<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  z-index: 100;
  border-bottom: 1px solid #eee;

  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--vp-c-brand-1);
    margin: 0;
  }

  .api-filter {
    display: flex;
    align-items: center;
    gap: 12px;

    .label {
      font-weight: 600;
      color: var(--vp-c-brand-1);
      font-size: 14px;
    }

    #api-filter {
      border: 1px solid var(--vp-c-brand-1);
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 14px;
      transition: all 0.3s ease;
      background-color: #f9f9f9;
      width: 220px;

      &:focus {
        outline: none;
        border-color: var(--vp-c-brand-1);
        background-color: #fff;
        box-shadow: 0 0 0 3px rgba(0, 212, 116, 0.1);
      }
    }
  }
}

.no-match {
  font-size: 1.1em;
  color: var(--vt-c-text-3);
  text-align: center;
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid var(--vt-c-divider-light);
}

.list {
  margin-top: 32px;
  margin-bottom: 32px;

  .list-title {
    font-size: 20px;
    font-weight: 600;
    color: #444;
    margin-bottom: 16px;
    padding-bottom: 8px;
    display: inline-block;
  }

  ul {
    padding-left: 0;
    margin: 0;
  }

  .item {
    position: relative;
    border: 1px solid #eaeaea;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 15px;
    background-color: #fff;
    transition: all 0.3s ease;
    margin-bottom: 12px;
    list-style: none;
    display: block;
    overflow: hidden;

    &:hover {
      cursor: pointer;
      border-color: var(--vp-c-brand-1);
      transform: translateY(-2px);
      color: var(--vp-c-brand-1);
    }
  }
}
</style>

<!-- ★ 暗黑模式专用（无 scoped），直接写 .dark -->
<style scoped>
.dark .header {
  background-color: var(--vt-c-bg);
  border-bottom-color: var(--vt-c-divider-dark);
}

.dark .header .header-title {
  color: var(--vt-c-text-1);
}

.dark .header .label {
  color: var(--vt-c-text-2);
}

.dark #api-filter {
  border-color: var(--vt-c-divider-dark);
  background-color: var(--vt-c-bg-soft);
  color: var(--vt-c-text-1);
}

.dark #api-filter:focus {
  border-color: var(--vt-c-green);
  background-color: var(--vt-c-bg-soft);
}

.dark .list .list-title {
  color: var(--vt-c-text-1);
  border-bottom-color: var(--vt-c-green);
}

.dark .list .item {
  border-color: var(--vt-c-divider-dark);
  background-color: var(--vt-c-bg-soft);
}

.dark .list .item span {
  color: var(--vt-c-text-2);
}

.dark .no-match {
  border-top-color: var(--vt-c-divider-dark);
  color: var(--vt-c-text-3);
}
</style>
