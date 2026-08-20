<script setup lang="ts">
/**
 * @description 更新记录时间线组件
 * 通过 git log 加载 commit 数据，按日期分组渲染时间线卡片
 * @author gxj
 */

import { computed } from 'vue'

interface Commit {
  hash: string
  date: string
  message: string
  author: string
}

interface CommitItem extends Commit {
  type: string | null
  parsedMessage: string
  typeStyle: {
    bg: string
    text: string
    label: string
    accent: string
  }
}

const props = defineProps<{
  /** 原始 commit 列表（来自 .data.ts） */
  commits: Commit[]
}>()

/**
 * 类型配色表（按品牌色派生，深色模式下 :global(.dark) 适配）
 */
const typeStyleMap: Record<
  string,
  { bg: string; text: string; label: string; accent: string }
> = {
  feat: { bg: '#dbeafe', text: '#1d4ed8', label: 'feat', accent: '#3b82f6' },
  feature: { bg: '#dbeafe', text: '#1d4ed8', label: 'feat', accent: '#3b82f6' }, // feat 别名
  fix: { bg: '#fee2e2', text: '#b91c1c', label: 'fix', accent: '#ef4444' },
  docs: { bg: '#dbeafe', text: '#1e40af', label: 'docs', accent: '#2563eb' },
  doc: { bg: '#dbeafe', text: '#1e40af', label: 'docs', accent: '#2563eb' }, // docs 别名
  style: { bg: '#f3e8ff', text: '#7e22ce', label: 'style', accent: '#a855f7' },
  refactor: { bg: '#ede9fe', text: '#6d28d9', label: 'refactor', accent: '#8b5cf6' },
  perf: { bg: '#fce7f3', text: '#9d174d', label: 'perf', accent: '#ec4899' },
  test: { bg: '#e0f2fe', text: '#075985', label: 'test', accent: '#0ea5e9' },
  chore: { bg: '#f3f4f6', text: '#374151', label: 'chore', accent: '#6b7280' },
  build: { bg: '#fef3c7', text: '#92400e', label: 'build', accent: '#f59e0b' },
  ci: { bg: '#cffafe', text: '#155e75', label: 'ci', accent: '#06b6d4' },
  // 中文类型
  新增: { bg: '#dcfce7', text: '#15803d', label: '新增', accent: '#22c55e' },
  修复: { bg: '#fee2e2', text: '#b91c1c', label: '修复', accent: '#ef4444' },
  重构: { bg: '#ede9fe', text: '#6d28d9', label: '重构', accent: '#8b5cf6' },
  代码重构: { bg: '#ede9fe', text: '#6d28d9', label: '重构', accent: '#8b5cf6' },
  优化: { bg: '#f3e8ff', text: '#7e22ce', label: '优化', accent: '#a855f7' },
  移除: { bg: '#f3f4f6', text: '#374151', label: '移除', accent: '#6b7280' },
  整理: { bg: '#dbeafe', text: '#1e40af', label: '整理', accent: '#2563eb' },
  更新: { bg: '#dbeafe', text: '#1e40af', label: '更新', accent: '#2563eb' },
}

const defaultStyle = { bg: '#f3f4f6', text: '#4b5563', label: 'chore', accent: '#6b7280' }

/**
 * 解析 commit 类型
 * 支持 conventional commits（feat/fix/docs...）、中文括号前缀（新增（x）：y）、
 * 中文冒号前缀（新增：y）、emoji 前缀（📃 docs: y）
 */
function parseCommitType(msg: string): { type: string | null; message: string } {
  // 1. conventional commit: feat(scope): xxx / feat: xxx / feat!: xxx
  const ccMatch = msg.match(/^([A-Za-z][A-Za-z0-9_-]*)(\([^)]*\))?!?:\s*(.+)/)
  if (ccMatch && ccMatch[1] && ccMatch[3]) {
    return { type: ccMatch[1].toLowerCase(), message: ccMatch[3] }
  }

  // 2. 中文括号前缀: 新增（xxx）：yyy
  const cnBracketMatch = msg.match(/^([\u4e00-\u9fa5]{1,6})[（(][^()]*?[)）][:：]\s*(.+)/)
  if (cnBracketMatch && cnBracketMatch[1] && cnBracketMatch[2]) {
    return { type: cnBracketMatch[1], message: cnBracketMatch[2] }
  }

  // 3. 中文冒号前缀（无括号）: 新增：yyy / 修复：yyy
  const cnColonMatch = msg.match(/^([\u4e00-\u9fa5]{1,6})[:：]\s*(.+)/)
  if (cnColonMatch && cnColonMatch[1] && cnColonMatch[2]) {
    return { type: cnColonMatch[1], message: cnColonMatch[2] }
  }

  // 4. emoji 前缀: 📃 docs: xxx / ✨ feat: xxx
  const emojiMatch = msg.match(
    /^(?:(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})[\s]?)?([A-Za-z][A-Za-z0-9_-]*):\s*(.+)/u
  )
  if (emojiMatch && emojiMatch[1] && emojiMatch[2]) {
    return { type: emojiMatch[1].toLowerCase(), message: emojiMatch[2] }
  }

  return { type: null, message: msg }
}

function getTypeStyle(type: string | null) {
  if (!type) return defaultStyle
  return typeStyleMap[type] ?? defaultStyle
}

/**
 * 分组数据
 */
const groupedCommits = computed(() => {
  const groups = new Map<string, { author: string; commits: CommitItem[] }>()
  const list: Commit[] = props.commits || []
  list.forEach(commit => {
    const date = commit.date.split(' ')[0] || ''
    let slot = groups.get(date)
    if (!slot) {
      slot = { author: commit.author, commits: [] }
      groups.set(date, slot)
    }
    const parsed = parseCommitType(commit.message)
    const ts = getTypeStyle(parsed.type)
    slot.commits.push({
      ...commit,
      type: parsed.type,
      parsedMessage: parsed.message,
      typeStyle: ts,
    })
  })
  return Array.from(groups.keys())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => ({ date, ...(groups.get(date) as { author: string; commits: CommitItem[] }) }))
})

async function copyHash(hash: string) {
  try {
    await navigator.clipboard.writeText(hash)
  } catch (_) {
    /* noop */
  }
}
</script>

<template>
  <div class="changelog-page">
    <!-- 时间线 -->
    <div class="timeline-list">
      <div v-for="group in groupedCommits" :key="group.date" class="timeline-section">
        <div class="timeline-marker">
          <div class="timeline-dot" />
          <div class="timeline-line" />
        </div>
        <div class="timeline-head">
          <span class="timeline-date">{{ group.date }}</span>
          <span class="timeline-author">{{ group.author }}</span>
        </div>

        <div class="timeline-cards">
          <div
            v-for="commit in group.commits"
            :key="commit.hash"
            class="commit-card"
            :style="{ '--accent': commit.typeStyle.accent }"
          >
            <div class="commit-body">
              <!-- 图标 -->
              <div
                class="commit-icon"
                :style="{ background: commit.typeStyle.bg, color: commit.typeStyle.text }"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="14" y2="17" />
                </svg>
              </div>

              <!-- 内容 -->
              <div class="commit-content">
                <div class="commit-row">
                  <span
                    class="commit-tag"
                    :style="{ background: commit.typeStyle.bg, color: commit.typeStyle.text }"
                  >
                    {{ commit.typeStyle.label }}
                  </span>
                  <span class="commit-message">{{ commit.parsedMessage }}</span>
                </div>
              </div>

              <!-- hash -->
              <button
                type="button"
                class="commit-hash"
                :title="`复制 hash: ${commit.hash}`"
                :aria-label="`复制 commit hash: ${commit.hash}`"
                @click="copyHash(commit.hash)"
              >
                <span>#{{ commit.hash }}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  />
                </svg>
              </button>
            </div>

            <!-- 底部时间区（分割线横跨整卡宽度） -->
            <div class="commit-meta">
              <span class="commit-time">
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {{ (commit.date.split(' ')[1] || '') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.changelog-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 1rem 0 4rem;
}

/* ===== 时间线 ===== */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-section {
  position: relative;
  padding-left: 2.25rem;
  padding-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 0.9rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  /* 总尺寸 = 实心品牌色 + 两侧 padding + 两侧边框 */
  --dot-size: 0.8rem;
  --dot-core: 0.12rem;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  background-clip: content-box;
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 1.5px var(--vp-c-brand-1);
  padding: var(--dot-core);
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.timeline-line {
  flex: 1;
  width: 1px;
  background: var(--vp-c-divider);
  margin-top: 2px;
}

.timeline-section:last-child .timeline-line {
  background: transparent;
}

.timeline-section:last-child {
  padding-bottom: 0.5rem;
}

/* ===== 日期 + 作者 ===== */
.timeline-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.timeline-date {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
}

.timeline-author {
  font-size: 0.78rem;
  font-weight: 500;
  color: #be185d;
  background: #fce7f3;
  padding: 3px 10px;
  border-radius: 999px;
  line-height: 1;
}

:global(.dark) .timeline-author {
  color: #f9a8d4;
  background: rgba(190, 24, 93, 0.18);
}

/* ===== commit 卡片 ===== */
.timeline-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.commit-card {
  --accent: var(--vp-c-brand-1);
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 1rem 1.1rem;
  padding-left: 1.15rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.commit-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    var(--accent),
    color-mix(in srgb, var(--accent) 40%, transparent)
  );
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.commit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  border-color: color-mix(in srgb, var(--accent) 50%, var(--vp-c-divider));
}

:global(.dark) .commit-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.commit-body {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.commit-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:global(.dark) .commit-icon {
  filter: brightness(1.1) saturate(0.95);
}

.commit-content {
  flex: 1;
  min-width: 0;
}

.commit-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.commit-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.4;
  letter-spacing: 0.02em;
}

.commit-message {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
  word-break: break-word;
}

.commit-meta {
  /* 底部独立行：分割线横跨整卡宽度 */
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 0.85rem;
  padding: 0.7rem 0 0 3.2rem;
}

.commit-time {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.commit-time svg {
  opacity: 0.7;
}

/* ===== hash 按钮 ===== */
.commit-hash {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-dimm);
  border: none;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 5px;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 1px;
  transition: background 0.2s ease, color 0.2s ease;
}

.commit-hash:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  color: var(--vp-c-brand-dark);
}

.commit-hash svg {
  opacity: 0.7;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .timeline-section {
    padding-left: 1.75rem;
  }

  .commit-card {
    padding: 0.85rem 0.9rem;
    padding-left: 0.95rem;
  }

  .commit-icon {
    width: 34px;
    height: 34px;
  }

  .commit-message {
    font-size: 0.9rem;
  }

  .commit-body {
    gap: 0.65rem;
  }

  .commit-meta {
    padding-left: 2.85rem;
  }
}
</style>
