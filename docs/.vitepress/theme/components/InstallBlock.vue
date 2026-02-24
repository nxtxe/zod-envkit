<script setup lang="ts">
import { ref } from "vue";

const pkg = "zod-envkit";
const options = [
  { id: "npm", label: "npm", cmd: `npm install ${pkg}` },
  { id: "yarn", label: "yarn", cmd: `yarn add ${pkg}` },
  { id: "pnpm", label: "pnpm", cmd: `pnpm add ${pkg}` },
  { id: "bun", label: "bun", cmd: `bun add ${pkg}` },
] as const;

const selected = ref<(typeof options)[number]["id"]>("npm");
const current = () => options.find((o) => o.id === selected.value)!;
</script>

<template>
  <div class="install-block">
    <header class="install-block__header">
      <div class="install-block__tabs">
        <button
          v-for="opt in options"
          :key="opt.id"
          type="button"
          class="install-block__tab"
          :class="{ 'install-block__tab--active': selected === opt.id }"
          @click="selected = opt.id"
        >
          {{ opt.label }}
        </button>
      </div>
    </header>
    <div class="install-block__body">
      <pre class="install-block__code"><code>{{ current().cmd }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.install-block {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.install-block__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.install-block__tabs {
  display: flex;
  gap: 4px;
}

.install-block__tab {
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.install-block__tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
}

.install-block__tab--active {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-brand-contrast);
  border-color: var(--vp-c-brand-1);
}

.install-block__body {
  padding: 12px 14px;
}

.install-block__code {
  margin: 0;
  padding: 12px 14px;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-color);
  font-size: 0.9em;
  overflow-x: auto;
}

.install-block__code code {
  padding: 0;
  background: none;
  color: inherit;
}
</style>
