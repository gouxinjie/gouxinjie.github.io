---
pageClass: site-layout
---

<script setup>
import siteData from "./data/html-css.js";
</script>

<MyCard v-for="model in siteData" :key="model.title" :title="model.title" :data="model.items"></MyCard>

<style module>
</style>
