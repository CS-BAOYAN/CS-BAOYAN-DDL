<script lang="ts">
  import { X, ExternalLink, Clock } from 'lucide-svelte';
  import type { DerivedSchool } from '$lib/types';
  import {
    formatCountdown,
    formatDate,
    formatDateTime,
    progressAgainst,
    splitCountdown,
  } from '$lib/time';
  import { getInitials, getLogoUrl } from '$lib/logos';
  import { resolveProvince } from '$data/provinces';

  let { school, onClose }: { school: DerivedSchool; onClose: () => void } = $props();

  const logo = $derived(getLogoUrl(school.name));
  const province = $derived(resolveProvince(school.name, school.province));
  const progress = $derived(progressAgainst(school.remainingMs, 90));
  const parts = $derived(school.remainingMs && school.remainingMs > 0 ? splitCountdown(school.remainingMs) : null);
  const urgeClass = $derived(`urge-${school.urgency}`);
  const urgeBgClass = $derived(`bg-urge-${school.urgency}`);

  let imgFailed = $state(false);
</script>

<div class="fixed inset-0 z-40 fade" role="dialog" aria-modal="true" aria-label="项目详情">
  <button
    class="absolute inset-0 bg-black/50 backdrop-blur-[3px]"
    onclick={onClose}
    aria-label="关闭"
  ></button>

  <div
    class="absolute right-0 top-0 bottom-0 w-full sm:w-[460px] surface-1 border-l border-line shadow-2xl slide-in-right flex flex-col"
  >
    <!-- header bar -->
    <div class="px-5 py-4 border-b border-line flex items-start gap-3">
      <div class="w-12 h-12 shrink-0 rounded-lg surface-2 border border-line grid place-items-center overflow-hidden">
        {#if logo && !imgFailed}
          <img
            src={logo}
            alt=""
            class="w-full h-full object-contain"
            loading="lazy"
            onerror={() => (imgFailed = true)}
          />
        {:else}
          <span class="text-fg-2 text-[12px] font-medium tracking-tight">{getInitials(school.name)}</span>
        {/if}
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-fg-0 font-semibold text-base leading-tight truncate">{school.name}</div>
        <div class="text-fg-2 text-sm mt-0.5 truncate">{school.institute}</div>
        {#if province}
          <div class="text-fg-4 text-xs mt-1">{province}</div>
        {/if}
      </div>
      <button
        onclick={onClose}
        class="shrink-0 p-1.5 rounded text-fg-3 hover:text-fg-1 hover:surface-3 transition"
        aria-label="关闭"
        title="关闭 (Esc)"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- body -->
    <div class="flex-1 overflow-y-auto">
      <!-- countdown -->
      <div class="px-5 py-5 border-b border-line">
        <div class="flex items-center gap-2 text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium mb-3">
          <Clock class="w-3.5 h-3.5" />
          <span>距截止</span>
        </div>

        {#if parts}
          <div class="grid grid-cols-4 gap-2">
            {#each [
              { v: parts.days, label: '天' },
              { v: parts.hours, label: '时' },
              { v: parts.minutes, label: '分' },
              { v: parts.seconds, label: '秒' },
            ] as p}
              <div class="surface-2 border border-line rounded-lg py-3 flex flex-col items-center justify-center">
                <div class="text-fg-0 text-2xl font-semibold tabular leading-none {urgeClass}">
                  {String(p.v).padStart(2, '0')}
                </div>
                <div class="text-fg-3 text-[10.5px] mt-1.5 tracking-wider">{p.label}</div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-2xl font-semibold {urgeClass} tabular">{formatCountdown(school.remainingMs)}</div>
        {/if}

        <!-- progress -->
        <div class="mt-4 h-1.5 surface-2 rounded-full overflow-hidden">
          <div
            class="h-full {urgeBgClass} transition-all"
            style="width: {progress * 100}%"
          ></div>
        </div>
        <div class="mt-2 flex items-center justify-between text-[11px] text-fg-3 tabular">
          <span>截止时间</span>
          <span>{formatDateTime(school.deadlineMs)}</span>
        </div>
      </div>

      <!-- tags -->
      {#if school.tags.length > 0}
        <div class="px-5 py-4 border-b border-line">
          <div class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium mb-2">标签</div>
          <div class="flex flex-wrap gap-1.5">
            {#each school.tags as t}
              <span class="surface-2 border border-line rounded-md px-2 py-1 text-xs text-fg-1">{t}</span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- description -->
      <div class="px-5 py-4 border-b border-line">
        <div class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium mb-2">说明</div>
        <p class="text-fg-1 text-sm leading-relaxed whitespace-pre-line">
          {school.description && school.description !== '_No response_' ? school.description : '（暂无说明）'}
        </p>
      </div>

      <!-- date -->
      <div class="px-5 py-4 border-b border-line">
        <div class="text-fg-3 text-[11px] uppercase tracking-[0.16em] font-medium mb-2">截止日期</div>
        <div class="text-fg-1 text-sm tabular">{formatDate(school.deadlineMs)}</div>
      </div>
    </div>

    <!-- footer cta -->
    <div class="px-5 py-4 border-t border-line">
      <a
        href={school.website}
        target="_blank"
        rel="noopener noreferrer"
        class="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg surface-3 hover:bg-emerald-500/15 hover:text-emerald-200 text-fg-0 text-sm font-medium border border-line-strong transition"
      >
        <span>打开官网</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</div>
