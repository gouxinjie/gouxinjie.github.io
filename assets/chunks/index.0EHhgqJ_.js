const t=`<script setup>
import { ref,shallowRef } from 'vue'
import { transformLinuxList } from "./list";
const LinuxList = shallowRef(transformLinuxList("/column/Linux/", true));
<\/script>

<SearchList title="Linux常用" :data="LinuxList" ></SearchList>
`;export{t as default};
