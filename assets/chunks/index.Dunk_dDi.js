const t=`<script setup>
import { ref,shallowRef } from 'vue'
import { transformFrontendAdvanceList } from "./list";
const FrontendAdvanceList = shallowRef(transformFrontendAdvanceList("/column/前端进阶/", true));
<\/script>

<SearchList title="前端进阶" :data="FrontendAdvanceList" ></SearchList>
`;export{t as default};
