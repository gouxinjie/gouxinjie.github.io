<script setup>
import { ref,shallowRef } from 'vue'
import { transformAngularList } from "./list";
const AngularList = shallowRef(transformAngularList("/column/Angular/", true)); 
</script>

<SearchList title="Angular" :data="AngularList" ></SearchList>
