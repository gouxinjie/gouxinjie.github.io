<script setup>
import { shallowRef } from "vue";
import { transformAIFutureList } from "./list";
const aiFutureList = shallowRef(transformAIFutureList("/column/AIFuture/", true));
</script>

<SearchList title="智研前沿" :data="aiFutureList"></SearchList>
