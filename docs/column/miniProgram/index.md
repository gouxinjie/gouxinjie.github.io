
<script setup>
import { ref,shallowRef } from 'vue'
import { transformMiniProgramList } from "./list";
const MiniList = shallowRef(transformMiniProgramList("/column/miniProgram/", true));
</script>

<SearchList title="小程序相关" :data="MiniList" ></SearchList>
