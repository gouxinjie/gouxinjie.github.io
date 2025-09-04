---
# 显示侧边栏导航
pageClass: site-layout
---

<script setup>
import siteData from "./data/framework.js";
</script>

<MyCard v-for="model in siteData" :key="model.title" :title="model.title" :data="model.items"></MyCard>

<style module>
</style>
