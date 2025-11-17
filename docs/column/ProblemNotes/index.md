<script setup>
import { ref,shallowRef } from 'vue'
import { transformProblemList } from "./list";
const problemList = shallowRef(transformProblemList("/column/ProblemNotes/", true)); 
</script>

<SearchList title="踩坑记录和日常笔记" :data="problemList" ></SearchList>
