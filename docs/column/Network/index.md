<script setup>
import { ref,shallowRef } from 'vue'
import { transformNetworkList } from "./list";
const NetworkList = shallowRef(transformNetworkList("/column/Network/", true));
</script>

<SearchList title="网络相关" :data="NetworkList" ></SearchList>
