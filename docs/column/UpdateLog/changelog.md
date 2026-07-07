---
layout: doc
title: 更新记录
---

<script setup>
import { data as rawCommits } from './changelog.data'
import { computed } from 'vue'

// 解析 commit 类型：conventional commit（feat/fix/...）或中文模式（新增/修复/重构...）
function parseCommitType(msg) {
  // 兼容常规格式 feat(scope): 和 emoji 前缀 📃 docs:
  const ccMatch = msg.match(/^([^\s(:]+)(\([^)]*\))?!?:\s*(.+)/)
  if (ccMatch) return { type: ccMatch[1], message: ccMatch[3] }
  const cnMatch = msg.match(/^(.{1,6})[（(].+?[)）][:：]\s*(.+)/)
  if (cnMatch) return { type: cnMatch[1], message: cnMatch[2] }
  return { type: null, message: msg }
}

const typeStyleMap = {
  feat:     { bg: '#d1fae5', text: '#065f46', label: 'feat' },
  fix:      { bg: '#fee2e2', text: '#991b1b', label: 'fix' },
  refactor: { bg: '#e0e7ff', text: '#3730a3', label: 'refactor' },
  docs:     { bg: '#dbeafe', text: '#1e40af', label: 'docs' },
  style:    { bg: '#fef3c7', text: '#92400e', label: 'style' },
  chore:    { bg: '#f3f4f6', text: '#374151', label: 'chore' },
  perf:     { bg: '#fce7f3', text: '#9d174d', label: 'perf' },
  test:     { bg: '#e0f2fe', text: '#075985', label: 'test' },
  新增:     { bg: '#d1fae5', text: '#065f46', label: '新增' },
  修复:     { bg: '#fee2e2', text: '#991b1b', label: '修复' },
  重构:     { bg: '#e0e7ff', text: '#3730a3', label: '重构' },
  代码重构: { bg: '#e0e7ff', text: '#3730a3', label: '重构' },
  优化:     { bg: '#fef3c7', text: '#92400e', label: '优化' },
  移除:     { bg: '#f3f4f6', text: '#374151', label: '移除' },
  整理:     { bg: '#dbeafe', text: '#1e40af', label: '整理' },
  '📃 docs': { bg: '#dbeafe', text: '#1e40af', label: 'docs' },
}

const groupedCommits = computed(() => {
  const groups = {}
  rawCommits.forEach(commit => {
    const date = commit.date.split(' ')[0]
    if (!groups[date]) {
      groups[date] = { author: commit.author, commits: [] }
    }
    const parsed = parseCommitType(commit.message)
    groups[date].commits.push({ ...commit, ...parsed })
  })
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({ date, ...groups[date] }))
})
</script>

# 更新记录

<div class="changelog-page">
  <div v-for="group in groupedCommits" :key="group.date" class="timeline-section">
    <div class="timeline-date">
      <div class="date-dot"></div>
      <span class="date-text">{{ group.date }}</span>
      <span class="date-author">{{ group.author }}</span>
    </div>
    <div class="timeline-content">
      <div v-for="commit in group.commits" :key="commit.hash" class="commit-card">
        <div class="commit-header">
          <span
            v-if="commit.type && typeStyleMap[commit.type]"
            class="commit-tag"
            :style="{ background: typeStyleMap[commit.type].bg, color: typeStyleMap[commit.type].text }"
          >{{ typeStyleMap[commit.type].label }}</span>
          <span class="commit-message">{{ commit.message }}</span>
          <span class="commit-hash">#{{ commit.hash }}</span>
        </div>
        <div class="commit-footer">
          <span class="commit-time">{{ commit.date.split(' ')[1] }}</span>
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
  gap: 0.5rem;
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
  flex-shrink: 0;
}

.date-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  margin-left: 0.5rem;
}

.date-author {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-left: 0.25rem;
  font-weight: 400;
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
  box-shadow: 0 8px 20px var(--vp-c-shadow, rgba(0, 0, 0, 0.08));
  border-color: var(--vp-c-brand-light);
}

.commit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.commit-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.4;
  letter-spacing: 0.02em;
}

.commit-message {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  flex: 1;
  word-break: break-word;
}

.commit-hash {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.commit-footer {
  display: flex;
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
</style>
