<script setup>
import { ref,shallowRef } from 'vue'
import { transformNodeList } from "./list";
const NodeList = shallowRef(transformNodeList("/column/Node/", true)); 
</script>

<SearchList title="Node相关" :data="NodeList" ></SearchList>
