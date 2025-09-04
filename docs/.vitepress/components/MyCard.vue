<template>
  <!-- 网址分类模块 -->
  <section class="site-section">
    <!-- 瞄点标题 -->
    <h2 class="title" :id="createTitle">
      {{ props.title }}
      <a class="header-anchor" :href="`#${createTitle}`" aria-hidden="true"></a>
    </h2>
    <!-- 生态列表 -->
    <ul class="list" v-if="props.data.length > 0">
      <li class="item" v-for="v in props.data" :key="v.name">
        <a class="link" :href="v.link" target="_blank">
          <h4 class="name">{{ v.name }}</h4>
          <p class="desc">{{ v.desc }}</p>
        </a>
      </li>
    </ul>
  </section>
  <BackTop></BackTop>
</template>

<script setup>
/**
 * @name siteList
 * @description  生态列表导航公用组件
 * @author gxj
 * @date 2024/7/18
 */
import { computed } from "vue";
import { slugify } from "@mdit-vue/shared";

const props = defineProps({
  /** 大标题 */
  title: {
    type: String,
    default: ""
  },

  /** 需要展示的列表 */
  data: {
    type: Array,
    default: []
  }
});

/** 生成markdown的侧边栏目录 */
const createTitle = computed(() => {
  if (!props.title) return "";
  return slugify(props.title);
});
</script>

<style lang="scss" scoped>
/*省略号*/
@mixin single-ellipsis {
  display: -webkit-box; /* 或者 inline-block 等其他需要的display值 */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 设置行数 */
  overflow: hidden;
  word-wrap: break-word; /* 允许长单词或URL地址换行到下一行 */
  white-space: normal; /* 允许内容换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}
.site-section {
  .title {
    color: #222;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding-left: 0;
    .item {
      width: 212px;
      margin: 15px 15px 0 0px;
      border: 1px solid transparent;
      position: relative;
      background-color: #f6f6f7;
      border-radius: 6px;
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: translateY(-6px); /* 轻微上移模拟抬升效果 */
        border: 1px solid var(--vp-c-brand);
        background: #fff;
      }
      .link {
        width: 210px;
        display: block;
        padding-bottom: 8px;
        border-radius: 6px;

        // 去除a链接默认的下划线
        text-decoration: none;
        .name {
          width: 80%;
          height: 26px;
          padding-left: 10px;
          font-size: 16px;
          font-weight: 600;
          margin-top: 15px;
          @include single-ellipsis;
          color: #000;
        }
        .desc {
          font-size: 13px;
          margin: 10px 10px 0;
          color: var(--vp-c-text-2);
          height: 36px;
          line-height: 18px;
          @include single-ellipsis;
        }
      }
    }
  }
}

// -- ★ 暗黑模式专用 使用全局类.dark --
.dark {
  .site-section {
    .title {
      color: var(--vp-c-text-1);
    }
    .list {
      .item {
        background-color: var(--vp-c-bg-alt);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        &:hover {
          transform: translateY(-6px); /* 轻微上移模拟抬升效果 */
          background: var(--vp-c-bg-alt);
        }
        .name {
          color: var(--vp-c-text-1) !important;
        }
        &:hover {
          border: 1px solid var(--vp-c-brand);
        }
      }
    }
  }
}
</style>
