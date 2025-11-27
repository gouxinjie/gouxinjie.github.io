---
layout: doc
title: 更新记录
---

<script setup>
import { data as rawCommits } from './changelog.data'
import { computed } from 'vue'

const groupedCommits = computed(() => {
  const groups = {}
  rawCommits.forEach(commit => {
    const date = commit.date.split(' ')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(commit)
  })
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({
      date,
      commits: groups[date]
    }))
})
</script>

# 更新记录

<div class="changelog-page">
  <div v-for="(group, index) in groupedCommits" :key="group.date" class="timeline-section">
    <div class="timeline-date">
      <div class="date-dot"></div>
      <span class="date-text">{{ group.date }}</span>
    </div>
    <div class="timeline-content">
      <div v-for="commit in group.commits" :key="commit.hash" class="commit-card">
        <div class="commit-header">
          <span class="commit-message">{{ commit.message }}</span>
          <span class="commit-hash">#{{ commit.hash }}</span>
        </div>
        <div class="commit-footer">
          <span class="commit-time">{{ commit.date.split(' ')[1] }}</span>
          <span class="commit-author">by {{ commit.author }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.changelog-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.timeline-section {
  position: relative;
  padding-top: 1rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid var(--vp-c-divider);
}

.timeline-section:last-child {
  border-left-color: transparent;
  padding-bottom: 0;
}

.timeline-date {
  position: absolute;
  left: -9px;
  top: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  line-height: 1;
  z-index: 10;
}

.date-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 4px solid var(--vp-c-bg);
  box-shadow: 0 0 0 1px var(--vp-c-brand);
}

.date-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  margin-left: 0.5rem;
}

.timeline-content {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.commit-card {
  background: var(--vp-c-bg-soft);
  padding: 1.25rem;
  padding-bottom: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.commit-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-light);
}

.commit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.commit-message {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.commit-hash {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.commit-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.commit-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.commit-author {
  font-weight: 500;
}
</style>
