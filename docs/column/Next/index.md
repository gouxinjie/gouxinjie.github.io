<script setup>
import { ref,shallowRef } from 'vue'
import { transformNextList } from "./list";
const NextList = shallowRef(transformNextList("/column/Next/", true)); 
</script>

<SearchList title="Next.js相关" :data="NextList" ></SearchList>
