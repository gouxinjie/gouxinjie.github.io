<script setup>
import { ref,shallowRef } from 'vue'
import { transformAngularList } from "./list";
const AngularList = shallowRef(transformAngularList("/column/Angular/", true)); 
</script>

<SearchList title="Angular相关" :data="AngularList" ></SearchList>
