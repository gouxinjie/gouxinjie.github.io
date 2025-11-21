<script setup>
import { ref,shallowRef } from 'vue'
import { transformTSList } from "./list";
const TSList = shallowRef(transformTSList("/column/TS/", true)); 
</script>

<SearchList title="TS进阶" :data="TSList" ></SearchList>
