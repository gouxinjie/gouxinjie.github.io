<script setup>
import { ref,shallowRef } from 'vue'
import { transformNginxList } from "./list";
const NginxList = shallowRef(transformNginxList("/column/Nginx/", true));
</script>

<SearchList title="Nginx常用" :data="NginxList" ></SearchList>
