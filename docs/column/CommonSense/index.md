<script setup>
import { ref,shallowRef } from 'vue'
import { transformCommonSenseList  } from "./list";
const commonSenseList = shallowRef(transformCommonSenseList("/column/CommonSense/", true)); 
</script>

<SearchList title="生活常识" :data="commonSenseList" ></SearchList>
