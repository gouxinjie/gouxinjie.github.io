const t=`<script setup>
import { shallowRef } from "vue";
import { transformAIFutureList } from "./list";
const aiFutureList = shallowRef(transformAIFutureList("/column/AIFuture/", true));
<\/script>

<SearchList title="AI 专题" :data="aiFutureList"></SearchList>
`;export{t as default};
