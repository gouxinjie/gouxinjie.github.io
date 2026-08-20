const n=`---
layout: doc
title: 更新记录
---

<script setup>
import { data as rawCommits } from './changelog.data'
<\/script>

# 更新记录

<ChangelogTimeline :commits="rawCommits" />
`;export{n as default};
