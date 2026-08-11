<script setup>
import { ref, shallowRef } from 'vue'
import { transformComponentFileList } from "./list";
const componentFileList = shallowRef(transformComponentFileList("/column/ProblemNotes/组件封装与文件处理/", true));
</script>

<SearchList title="组件封装与文件处理" :data="componentFileList" ></SearchList>
