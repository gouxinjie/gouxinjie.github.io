<script setup>
import { ref,shallowRef } from 'vue'
import { transformPythonList } from "./list";
const PythonList = shallowRef(transformPythonList("/column/Python/", true)); 
</script>

<SearchList title="Python" :data="PythonList" ></SearchList>
