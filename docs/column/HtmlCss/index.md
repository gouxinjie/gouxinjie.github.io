
<script setup>
import { ref,shallowRef } from 'vue'
import { HtmlCssListExport } from "./list";
const HtmlCssList = shallowRef(HtmlCssListExport("/column/HtmlCss/", true));
</script>

<SearchList title="HTML/CSS相关" :data="HtmlCssList" ></SearchList>
