<script lang="ts">
  import SchoolRow from './SchoolRow.svelte';
  import type { DerivedSchool } from '$lib/types';
  import { Inbox } from 'lucide-svelte';

  let { rows, selectedKey, onSelect }: {
    rows: DerivedSchool[];
    selectedKey: string | null;
    onSelect: (key: string) => void;
  } = $props();

  const groups = $derived.by(() => {
    const live: DerivedSchool[] = [];
    const dead: DerivedSchool[] = [];
    const unknown: DerivedSchool[] = [];
    for (const r of rows) {
      if (r.remainingMs === null) unknown.push(r);
      else if (r.remainingMs < 0) dead.push(r);
      else live.push(r);
    }
    return { live, dead, unknown };
  });

  const hasMultiple = $derived(
    [groups.live.length > 0, groups.dead.length > 0, groups.unknown.length > 0].filter(Boolean)
      .length > 1,
  );
</script>

{#snippet head(label: string, count: number, muted: boolean)}
  <div class="px-4 py-2 surface-2 border-b border-line flex items-center justify-between">
    <span class="text-[10.5px] uppercase tracking-[0.18em] font-medium {muted ? 'text-fg-4' : 'text-fg-2'}">{label}</span>
    <span class="text-fg-3 text-[11px] tabular">{count}</span>
  </div>
{/snippet}

{#if rows.length === 0}
  <div class="surface-1 border border-line rounded-xl flex flex-col items-center justify-center py-20 text-center fade">
    <Inbox class="w-8 h-8 text-fg-4 mb-3" />
    <div class="text-fg-1 font-medium">没有匹配的项目</div>
    <div class="text-fg-3 text-sm mt-1">尝试清空一些筛选条件，或换一个数据源</div>
  </div>
{:else}
  <div class="surface-1 border border-line rounded-xl overflow-hidden">
    {#if groups.live.length > 0}
      {#if hasMultiple}
        {@render head('进行中', groups.live.length, false)}
      {/if}
      <div class="divide-line">
        {#each groups.live as r, i (r.name + '|' + r.institute + '|' + (r.deadlineMs ?? i))}
          <SchoolRow school={r} selected={selectedKey === `${r.name}::${r.institute}`} {onSelect} />
        {/each}
      </div>
    {/if}

    {#if groups.unknown.length > 0}
      {@render head('日期未公布', groups.unknown.length, false)}
      <div class="divide-line">
        {#each groups.unknown as r, i (r.name + '|' + r.institute + '|U' + i)}
          <SchoolRow school={r} selected={selectedKey === `${r.name}::${r.institute}`} {onSelect} />
        {/each}
      </div>
    {/if}

    {#if groups.dead.length > 0}
      {@render head('已结束', groups.dead.length, true)}
      <div class="divide-line">
        {#each groups.dead as r, i (r.name + '|' + r.institute + '|' + (r.deadlineMs ?? i) + '|D' + i)}
          <SchoolRow school={r} selected={selectedKey === `${r.name}::${r.institute}`} {onSelect} />
        {/each}
      </div>
    {/if}
  </div>
{/if}
