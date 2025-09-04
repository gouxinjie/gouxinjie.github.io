
<script setup>
import { ref,shallowRef } from 'vue'
import { transformJSList } from "./list";
const JSList = shallowRef(transformJSList("/column/JS/", true)); // 获取JS相关列表
</script>

<SearchList title="JS相关" :data="JSList" ></SearchList>
