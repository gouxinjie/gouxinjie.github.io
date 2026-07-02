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
        <div class="card-accent"></div>
        <div class="card-body">
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
              <span v-for="tag in project.tech" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <span class="deploy-info">{{ project.deploy }}</span>
          </div>
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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.project-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  overflow: hidden;
  display: flex;
  min-height: 120px;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px -10px rgba(0, 0, 0, 0.12);
}

.project-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.card-accent {
  width: 3px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--vp-c-brand-1), var(--vp-c-brand-next));
  border-radius: 0;
  transition: width 0.25s ease;
}

.project-card:hover .card-accent {
  width: 4px;
}

.card-body {
  flex: 1;
  padding: 14px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}

.card-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  font-size: 0.72rem;
  color: #16a34a;
  padding: 3px 10px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.project-desc {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.card-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.72rem;
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
  font-weight: 500;
}

.deploy-info {
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .card-body {
    padding: 16px 18px;
  }
}
</style>
