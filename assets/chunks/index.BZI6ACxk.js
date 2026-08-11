const t=`<script setup>
import { shallowRef } from 'vue'
import { transformDatabaseList } from "./list";
const DatabaseList = shallowRef(transformDatabaseList("/column/数据库/", true));
<\/script>

<SearchList title="数据库" :data="DatabaseList" ></SearchList>
`;export{t as default};
