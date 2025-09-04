<script setup>
import { ref,shallowRef } from 'vue'
import { transformTSList } from "./list";
const TSList = shallowRef(transformTSList("/column/TS/", true)); 
</script>

<SearchList title="TS相关" :data="TSList" ></SearchList>
