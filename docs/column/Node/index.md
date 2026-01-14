<script setup>
import { ref,shallowRef } from 'vue'
import { transformNodeList } from "./list";
const NodeList = shallowRef(transformNodeList("/column/Node/", true)); 
</script>

<SearchList title="Node.js" :data="NodeList" ></SearchList>
