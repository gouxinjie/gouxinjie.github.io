<script setup>
import { ref,shallowRef } from 'vue'
import { transformPoetryList  } from "./list";
const poetryList = shallowRef(transformPoetryList("/column/Poetry/", true)); 
</script>

<SearchList title="问题笔记" :data="poetryList" ></SearchList>
