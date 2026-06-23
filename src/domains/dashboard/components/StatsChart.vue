<template>
  <div class="chart-container">
    <div class="chart-header">
      <h4 class="chart-title">Cashflow Trends</h4>
      <div class="chart-legend">
        <span class="legend-item legend-income">
          <span class="legend-dot"></span> Income
        </span>
        <span class="legend-item legend-expense">
          <span class="legend-dot"></span> Expenses
        </span>
      </div>
    </div>

    <!-- Custom SVG Chart -->
    <div class="svg-wrapper">
      <svg
        viewBox="0 0 500 220"
        class="chart-svg"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      >
        <!-- Gradients -->
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#34d399" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#34d399" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f87171" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#f87171" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines -->
        <g class="grid-lines">
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
        <g class="axis-labels y-axis-labels">
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
        <g class="axis-labels x-axis-labels">
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
          stroke="#34d399"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line-path animate-path"
        />
        <path
          :d="expenseLinePath"
          fill="none"
          stroke="#f87171"
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
            stroke="#34d399"
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
            stroke="#f87171"
            stroke-width="2.5"
            class="chart-dot"
          />
        </g>
      </svg>
    </div>

    <!-- Tooltip Overlay -->
    <div
      v-if="hoverIndex !== null"
      class="chart-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <p class="tooltip-month">{{ trends[hoverIndex].month }} 2026</p>
      <p class="tooltip-value income-val">
        Income: <span>{{ formatCurrency(trends[hoverIndex].income) }}</span>
      </p>
      <p class="tooltip-value expense-val">
        Expense: <span>{{ formatCurrency(trends[hoverIndex].expense) }}</span>
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
.chart-container {
  position: relative;
  background: var(--surface-bg-card, rgba(30, 41, 59, 0.45));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-md, 12px);
  padding: 1.5rem;
  backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-base);
}

.chart-legend {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
}

.legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.legend-income .legend-dot {
  background-color: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.4);
}

.legend-expense .legend-dot {
  background-color: #f87171;
  box-shadow: 0 0 8px rgba(248, 113, 113, 0.4);
}

.svg-wrapper {
  position: relative;
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Animations */
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

/* Tooltip Overlay */
.chart-tooltip {
  position: absolute;
  background: var(--surface-bg-tooltip, rgba(15, 23, 42, 0.85));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  pointer-events: none;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 8rem;
  text-align: left;
  transform: translateY(-5px);
  animation: tooltipFade 0.15s ease-out;
}

.tooltip-month {
  margin: 0;
  font-size: 0.725rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.tooltip-value {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.tooltip-value span {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.income-val {
  color: #a7f3d0;
}

.income-val span {
  color: #34d399;
}

.expense-val {
  color: #fecaca;
}

.expense-val span {
  color: #f87171;
}

@keyframes tooltipFade {
  from { opacity: 0; transform: translateY(0); }
  to { opacity: 1; transform: translateY(-5px); }
}
</style>
