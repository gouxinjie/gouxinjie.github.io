<script setup>
import { ref,shallowRef } from 'vue'
import { transformDockerList } from "./list";
const DockerList = shallowRef(transformDockerList("/column/Docker/", true));
</script>

<SearchList title="Docker常用" :data="DockerList" ></SearchList>
