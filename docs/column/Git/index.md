<script setup>
import { ref,shallowRef } from 'vue'
import { transformGitList } from "./list";
const GitList = shallowRef(transformGitList("/column/Git/", true));
</script>

<SearchList title="Git相关" :data="GitList" ></SearchList>
