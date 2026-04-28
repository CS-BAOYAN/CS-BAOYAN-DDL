<script lang="ts">
  import { filters, toggle } from '$lib/urlState.svelte';
  import { SCHOOL_TAGS, STATUS_TAGS } from '$lib/types';
  import { PROVINCES, resolveProvince } from '$data/provinces';
  import type { DerivedSchool } from '$lib/types';

  let { rows, mode, onDone }: { rows: DerivedSchool[]; mode: 'sidebar' | 'drawer'; onDone?: () => void } = $props();

  const tagCounts = $derived.by(() => {
    const m = new Map<string, number>();
    for (const r of rows) for (const t of r.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  });

  const provinceCounts = $derived.by(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const p = resolveProvince(r.name, r.province);
      if (p) m.set(p, (m.get(p) ?? 0) + 1);
    }
    return m;
  });

  function isOnTag(value: string) {
    return filters.tags.includes(value as never);
  }
  function isOnStatus(value: string) {
    return filters.status.includes(value as never);
  }
  function isOnProv(value: string) {
    return filters.provinces.includes(value);
  }
</script>

<div class="surface-1 border border-line rounded-xl overflow-hidden {mode === 'sidebar' ? 'sticky top-[68px] max-h-[calc(100dvh-84px)] overflow-y-auto' : ''}">
  <!-- 档次 -->
  <div class="px-4 py-3 border-b border-line">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium">档次</h3>
      {#if filters.tags.length > 0}
        <button
          class="text-fg-3 hover:text-fg-1 text-[11px]"
          onclick={() => (filters.tags = [])}
        >清除</button>
      {/if}
    </div>
    <div class="flex flex-wrap gap-1.5">
      {#each SCHOOL_TAGS as t}
        {@const on = isOnTag(t)}
        {@const c = tagCounts.get(t) ?? 0}
        <button
          disabled={c === 0 && !on}
          onclick={() => (filters.tags = toggle(filters.tags, t))}
          class="inline-flex items-center gap-1.5 text-xs rounded-md px-2.5 py-1.5 transition border
            {on
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:text-emerald-200'
              : 'surface-2 hover:surface-3 border-line text-fg-1 disabled:text-fg-4 disabled:hover:surface-2 disabled:cursor-not-allowed'}"
        >
          <span>{t}</span>
          <span class="tabular text-[10px] {on ? 'text-emerald-700/70 dark:text-emerald-300/80' : 'text-fg-3'}">{c}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- 状态 -->
  <div class="px-4 py-3 border-b border-line">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium">状态</h3>
      {#if filters.status.length > 0}
        <button
          class="text-fg-3 hover:text-fg-1 text-[11px]"
          onclick={() => (filters.status = [])}
        >清除</button>
      {/if}
    </div>
    <div class="flex flex-wrap gap-1.5">
      {#each STATUS_TAGS as t}
        {@const on = isOnStatus(t)}
        {@const c = tagCounts.get(t) ?? 0}
        <button
          disabled={c === 0 && !on}
          onclick={() => (filters.status = toggle(filters.status, t))}
          class="inline-flex items-center gap-1.5 text-xs rounded-md px-2.5 py-1.5 transition border
            {on
              ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-200'
              : 'surface-2 hover:surface-3 border-line text-fg-1 disabled:text-fg-4 disabled:hover:surface-2 disabled:cursor-not-allowed'}"
        >
          <span>{t}</span>
          <span class="tabular text-[10px] {on ? 'text-amber-700/70 dark:text-amber-300/80' : 'text-fg-3'}">{c}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- 省份 -->
  <div class="px-4 py-3 {mode === 'drawer' ? '' : 'border-b border-line'}">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium">省份</h3>
      {#if filters.provinces.length > 0}
        <button
          class="text-fg-3 hover:text-fg-1 text-[11px]"
          onclick={() => (filters.provinces = [])}
        >清除</button>
      {/if}
    </div>
    <div class="flex flex-wrap gap-1.5">
      {#each PROVINCES as p}
        {@const on = isOnProv(p)}
        {@const c = provinceCounts.get(p) ?? 0}
        <button
          disabled={c === 0 && !on}
          onclick={() => (filters.provinces = toggle(filters.provinces, p))}
          class="inline-flex items-center gap-1.5 text-xs rounded-md px-2 py-1 transition border
            {on
              ? 'bg-sky-100 border-sky-300 text-sky-800 dark:bg-sky-500/15 dark:border-sky-500/40 dark:text-sky-200'
              : 'surface-2 hover:surface-3 border-line text-fg-1 disabled:text-fg-4 disabled:hover:surface-2 disabled:cursor-not-allowed'}"
        >
          <span>{p}</span>
          <span class="tabular text-[10px] {on ? 'text-sky-700/70 dark:text-sky-300/80' : 'text-fg-3'}">{c}</span>
        </button>
      {/each}
    </div>
  </div>

  {#if mode === 'drawer'}
    <div class="px-4 pb-4 pt-2">
      <button
        onclick={onDone}
        class="w-full surface-3 hover:bg-emerald-500/15 hover:text-emerald-200 text-fg-0 font-medium rounded-md py-2.5 text-sm border border-line-strong transition"
      >
        查看结果
      </button>
    </div>
  {/if}
</div>
