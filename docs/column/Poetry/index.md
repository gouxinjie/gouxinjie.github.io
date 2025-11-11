<script setup>
import { ref,shallowRef } from 'vue'
import { transformPoetryList  } from "./list";
const poetryList = shallowRef(transformPoetryList("/column/Poetry/", true)); 
</script>

<SearchList title="诗词相关" :data="poetryList" ></SearchList>
