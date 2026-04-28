/**
 * Single shared 1Hz clock. All countdown UIs derive from this — no per-component intervals,
 * and crucially no re-fetching of school data.
 */
export const clock = $state({ now: Date.now() });

let timer: number | null = null;
let mounted = 0;

export function startClock(): () => void {
  mounted++;
  if (timer === null) {
    timer = window.setInterval(() => {
      clock.now = Date.now();
    }, 1000);
  }
  return () => {
    mounted--;
    if (mounted <= 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
      mounted = 0;
    }
  };
}
