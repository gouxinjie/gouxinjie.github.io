<script setup>
import { shallowRef } from 'vue'
import { transformAliyunList } from "./list";
const AliyunList = shallowRef(transformAliyunList("/column/Aliyun/", true));
</script>

<SearchList title="阿里云" :data="AliyunList" ></SearchList>
