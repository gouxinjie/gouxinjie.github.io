
<script setup>
import { ref,shallowRef } from 'vue'
import { transformVueList } from "./list";
const vueList = shallowRef(transformVueList("/column/Vue/", true)); // 获取JS相关列表
</script>

<SearchList title="Vue相关" :data="vueList" ></SearchList>
