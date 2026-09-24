const t=`<script setup>
import { shallowRef } from 'vue'
import { transformAliyunList } from "./list";
const AliyunList = shallowRef(transformAliyunList("/column/Aliyun/", true));
<\/script>

<SearchList title="阿里云ECS项目部署" :data="AliyunList" ></SearchList>
`;export{t as default};
