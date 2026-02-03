<script setup>
import { ref,shallowRef } from 'vue'
import { transformNoteData } from "../list";
const problemList = shallowRef(transformNoteData("/column/ProblemNotes/", true));
</script>

<SearchList title="日常笔记" :data="problemList" ></SearchList>
