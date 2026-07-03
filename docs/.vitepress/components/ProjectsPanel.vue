<script setup lang="ts">
import { PROJECTS_DATA } from "../../utils/homenav-data"
</script>

<template>
  <div class="panel">
    <h2 id="online-projects" tabindex="-1">
      我的在线项目
      <a class="header-anchor" href="#online-projects" aria-hidden="true"></a>
    </h2>
    <div class="projects-grid">
      <a
        v-for="project in PROJECTS_DATA"
        :key="project.name"
        :href="project.url"
        target="_blank"
        rel="noopener noreferrer"
        class="project-card"
      >
        <div class="card-top">
          <div class="card-title-row">
            <span class="project-name">{{ project.name }}</span>
            <span class="status-badge">
              <span class="status-dot"></span>
              在线
            </span>
          </div>
          <p class="project-desc">{{ project.desc }}</p>
        </div>
        <div class="card-bottom">
          <div class="tech-tags">
            <span v-for="tag in project.tech" :key="tag">{{ tag }}</span>
          </div>
          <span class="deploy-info">{{ project.deploy }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.panel {
  margin-top: 36px;
  margin-bottom: 8px;
}

h2 {
  max-width: 1152px;
  margin: 0 auto 20px;
  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  letter-spacing: -0.02em;
}

.projects-grid {
  max-width: 1152px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.project-card {
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 130px;
}

.project-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-next, var(--vp-c-brand-1)));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-soft);
  background: var(--vp-c-bg-soft);
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.card-top {
  padding: 20px 22px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.project-name {
  font-size: 1.05rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #16a34a;
  padding: 2px 9px;
  border-radius: 20px;
  background: rgba(34, 197, 94, 0.08);
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.project-desc {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.card-bottom {
  padding: 14px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 14px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  span {
    font-size: 0.73rem;
    color: var(--vp-c-text-2);
    font-weight: 500;
    display: flex;
    align-items: center;

    &:not(:last-child)::after {
      content: "|";
      margin: 0 4px;
      color: var(--vp-c-text-3);
      font-size: 0.75em;
      font-weight: 300;
      vertical-align: -0.1em;
    }
  }
}

.deploy-info {
  font-size: 0.73rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
