<script setup>
import { ref,shallowRef } from 'vue'
import { transformProblemList } from "./list";
const problemList = shallowRef(transformProblemList("/column/ProblemNotes/", true)); 
</script>

<SearchList title="问题笔记" :data="problemList" ></SearchList>
