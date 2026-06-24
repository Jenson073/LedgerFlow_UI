<template>
  <div class="relative bg-bg-card/45 border border-border rounded-md p-6 backdrop-blur-xl saturate-[180%] flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h4 class="m-0 text-[1.05rem] font-semibold text-text-base">Cashflow Trends</h4>
      <div class="flex gap-4 text-[0.8rem] font-medium">
        <span class="flex items-center gap-1.5 text-text-muted">
          <span class="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span> Income
        </span>
        <span class="flex items-center gap-1.5 text-text-muted">
          <span class="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(248,113,113,0.4)]"></span> Expenses
        </span>
      </div>
    </div>

    <!-- Custom SVG Chart -->
    <div class="relative w-full">
      <svg
        viewBox="0 0 500 220"
        class="w-full h-auto overflow-visible"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      >
        <!-- Gradients -->
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-success)" stop-opacity="0.25" />
            <stop offset="100%" stop-color="var(--color-success)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-danger)" stop-opacity="0.25" />
            <stop offset="100%" stop-color="var(--color-danger)" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <g>
          <line
            v-for="y in yGridLines"
            :key="y"
            x1="45"
            :y1="y"
            x2="480"
            :y2="y"
            stroke="rgba(255, 255, 255, 0.05)"
            stroke-width="1"
          />
        </g>

        <!-- Y Axis Labels -->
        <g>
          <text
            v-for="(label, idx) in yLabels"
            :key="idx"
            x="35"
            :y="label.y + 4"
            text-anchor="end"
            fill="rgba(255, 255, 255, 0.4)"
            font-size="9"
          >
            {{ label.text }}
          </text>
        </g>

        <!-- X Axis Labels -->
        <g>
          <text
            v-for="(pt, idx) in points"
            :key="idx"
            :x="pt.x"
            y="205"
            text-anchor="middle"
            fill="rgba(255, 255, 255, 0.4)"
            font-size="10"
            font-weight="500"
          >
            {{ pt.month }}
          </text>
        </g>

        <!-- Area Paths -->
        <path :d="incomeAreaPath" fill="url(#income-grad)" />
        <path :d="expenseAreaPath" fill="url(#expense-grad)" />

        <!-- Line Paths -->
        <path
          :d="incomeLinePath"
          fill="none"
          stroke="var(--color-success)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line-path animate-path"
        />
        <path
          :d="expenseLinePath"
          fill="none"
          stroke="var(--color-danger)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line-path animate-path"
        />

        <!-- Active Hover Line -->
        <line
          v-if="hoverIndex !== null"
          :x1="points[hoverIndex].x"
          y1="20"
          :x2="points[hoverIndex].x"
          y2="185"
          stroke="rgba(255, 255, 255, 0.15)"
          stroke-width="1.5"
          stroke-dasharray="4,4"
        />

        <!-- Data Dots -->
        <g>
          <circle
            v-for="(pt, idx) in points"
            :key="'in-dot-' + idx"
            :cx="pt.x"
            :cy="pt.incomeY"
            :r="hoverIndex === idx ? 6 : 4"
            fill="#0f172a"
            stroke="var(--color-success)"
            stroke-width="2.5"
            class="chart-dot"
          />
          <circle
            v-for="(pt, idx) in points"
            :key="'ex-dot-' + idx"
            :cx="pt.x"
            :cy="pt.expenseY"
            :r="hoverIndex === idx ? 6 : 4"
            fill="#0f172a"
            stroke="var(--color-danger)"
            stroke-width="2.5"
            class="chart-dot"
          />
        </g>
      </svg>
    </div>

    <!-- Tooltip Overlay -->
    <div
      v-if="hoverIndex !== null"
      class="chart-tooltip absolute bg-[var(--surface-bg-tooltip)] border border-white/10 rounded-md p-3 shadow-lg backdrop-blur-md pointer-events-none z-50 flex flex-col gap-1.5 min-w-[8rem] text-left -translate-y-1 select-none"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <p class="m-0 text-[0.725rem] font-semibold text-text-muted uppercase">{{ trends[hoverIndex].month }} 2026</p>
      <p class="m-0 text-[0.8rem] font-medium flex justify-between gap-2 text-emerald-300">
        Income: <span class="font-bold text-success tabular-nums">{{ formatCurrency(trends[hoverIndex].income) }}</span>
      </p>
      <p class="m-0 text-[0.8rem] font-medium flex justify-between gap-2 text-red-300">
        Expense: <span class="font-bold text-danger tabular-nums">{{ formatCurrency(trends[hoverIndex].expense) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency } from '~/shared/utils/formatters';

interface TrendData {
  month: string;
  income: number;
  expense: number;
}

interface Props {
  trends: TrendData[];
}

const props = defineProps<Props>();

const hoverIndex = ref<number | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);

// Coordinates bounds
const paddingLeft = 60;
const paddingRight = 30;
const paddingTop = 25;
const paddingBottom = 40;
const width = 500;
const height = 220;

const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = height - paddingTop - paddingBottom;

// Find maximum value to scale Y axis
const maxValue = computed(() => {
  const allValues = props.trends.flatMap((t) => [t.income, t.expense]);
  const max = Math.max(...allValues, 1000); // Baseline max
  return Math.ceil(max / 2000) * 2000; // Round to nearest 2000
});

// Calculate points position
const points = computed(() => {
  const count = props.trends.length;
  return props.trends.map((t, idx) => {
    const x = paddingLeft + (idx / Math.max(count - 1, 1)) * chartWidth;
    // Y points scaled inversely (SVG 0,0 is top left)
    const incomeY = height - paddingBottom - (t.income / maxValue.value) * chartHeight;
    const expenseY = height - paddingBottom - (t.expense / maxValue.value) * chartHeight;

    return {
      month: t.month,
      x,
      incomeY,
      expenseY,
    };
  });
});

// Y axis labels & grid lines
const yLabels = computed(() => {
  const steps = 4;
  const labels = [];
  for (let i = 0; i <= steps; i++) {
    const value = (maxValue.value / steps) * i;
    const y = height - paddingBottom - (value / maxValue.value) * chartHeight;
    
    // Formatting shorthand (e.g. 5K)
    let text = '$0';
    if (value >= 1000) {
      text = `$${(value / 1000).toFixed(0)}K`;
    } else if (value > 0) {
      text = `$${value}`;
    }

    labels.push({ y, text });
  }
  return labels;
});

const yGridLines = computed(() => {
  return yLabels.value.map((l) => l.y);
});

// Draw Line SVG Path DSL
const incomeLinePath = computed(() => {
  if (points.value.length === 0) return '';
  return points.value.reduce(
    (path, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.incomeY}` : `${path} L ${pt.x} ${pt.incomeY}`),
    ''
  );
});

const expenseLinePath = computed(() => {
  if (points.value.length === 0) return '';
  return points.value.reduce(
    (path, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.expenseY}` : `${path} L ${pt.x} ${pt.expenseY}`),
    ''
  );
});

// Draw Area Fill SVG Path DSL (needs to loop back to bottom axis)
const incomeAreaPath = computed(() => {
  if (points.value.length === 0) return '';
  const baselineY = height - paddingBottom;
  const startPt = points.value[0];
  const endPt = points.value[points.value.length - 1];
  return `${incomeLinePath.value} L ${endPt.x} ${baselineY} L ${startPt.x} ${baselineY} Z`;
});

const expenseAreaPath = computed(() => {
  if (points.value.length === 0) return '';
  const baselineY = height - paddingBottom;
  const startPt = points.value[0];
  const endPt = points.value[points.value.length - 1];
  return `${expenseLinePath.value} L ${endPt.x} ${baselineY} L ${startPt.x} ${baselineY} Z`;
});

// Hover Handler
const onMouseMove = (event: MouseEvent) => {
  const svg = event.currentTarget as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;

  // Convert client space mouseX back to SVG coordinates scale
  const svgMouseX = (mouseX / rect.width) * width;

  // Find closest point
  let closestIdx = 0;
  let minDiff = Infinity;

  points.value.forEach((pt, idx) => {
    const diff = Math.abs(pt.x - svgMouseX);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });

  hoverIndex.value = closestIdx;

  // Position tooltip relative to SVG wrapper box
  const targetPt = points.value[closestIdx];
  const scaleX = rect.width / width;
  
  tooltipX.value = targetPt.x * scaleX - 60; // Offset by half tooltip width
  tooltipY.value = Math.min(targetPt.incomeY, targetPt.expenseY) * (rect.height / height) - 75;
};

const onMouseLeave = () => {
  hoverIndex.value = null;
};
</script>

<style scoped>
.animate-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chart-tooltip {
  animation: tooltipFade 0.15s ease-out forwards;
}

@keyframes tooltipFade {
  from { opacity: 0; transform: translateY(0); }
  to { opacity: 1; transform: translateY(-4px); }
}
</style>

