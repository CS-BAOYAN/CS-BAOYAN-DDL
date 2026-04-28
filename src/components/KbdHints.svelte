<script lang="ts">
  import { X } from 'lucide-svelte';
  let { onClose }: { onClose: () => void } = $props();

  const items: { keys: string[]; desc: string }[] = [
    { keys: ['/'], desc: '聚焦搜索框' },
    { keys: ['j', '↓'], desc: '下一项' },
    { keys: ['k', '↑'], desc: '上一项' },
    { keys: ['Enter'], desc: '打开详情' },
    { keys: ['Esc'], desc: '关闭弹层 / 取消选中' },
    { keys: ['?'], desc: '显示 / 隐藏快捷键' },
  ];
</script>

<div class="fixed inset-0 z-50 fade grid place-items-center" role="dialog" aria-modal="true" aria-label="键盘快捷键">
  <button class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick={onClose} aria-label="关闭"></button>
  <div class="relative surface-1 border border-line rounded-xl p-5 w-[320px] slide-up">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-fg-0 font-medium">键盘快捷键</h2>
      <button onclick={onClose} class="p-1 rounded text-fg-3 hover:text-fg-1 hover:surface-3 transition" aria-label="关闭">
        <X class="w-4 h-4" />
      </button>
    </div>
    <div class="flex flex-col gap-2.5">
      {#each items as it}
        <div class="flex items-center justify-between text-sm">
          <span class="text-fg-1">{it.desc}</span>
          <span class="flex items-center gap-1">
            {#each it.keys as k, i}
              {#if i > 0}<span class="text-fg-4 text-xs mx-0.5">/</span>{/if}
              <kbd>{k}</kbd>
            {/each}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>
