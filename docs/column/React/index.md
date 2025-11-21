
<script setup>
import { ref,shallowRef } from 'vue'
import { ReactListExport } from "./list";
const ReactList = shallowRef(ReactListExport("/column/React/", true)); 
</script>

<SearchList title="React" :data="ReactList" ></SearchList>
