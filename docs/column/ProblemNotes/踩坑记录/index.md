<script setup>
import { ref,shallowRef } from 'vue'
import { transformProblemData } from "../list";
const problemList = shallowRef(transformProblemData("/column/ProblemNotes/", true));
</script>

<SearchList title="踩坑记录" :data="problemList" ></SearchList>
