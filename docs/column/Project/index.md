<script setup>
import { ref,shallowRef } from 'vue'
import { transformProjectList } from "./list";
const ProjectList = shallowRef(transformProjectList("/column/Project/", true));
</script>

<SearchList title="项目相关" :data="ProjectList" ></SearchList>
