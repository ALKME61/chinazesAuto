<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: { label: string; value: number }[]
    height?: number
    color?: string
    gradientId?: string
    ySuffix?: string
    valueLabel?: string
  }>(),
  {
    height: 290,
    color: '#ff8800',
    gradientId: 'admin-chart-gradient',
    ySuffix: '',
    valueLabel: 'Значение',
  },
)

const chartWidth = 980
const chartHeight = props.height

function ceilNice(max: number): number {
  if (max <= 0) return 10
  const mag = Math.pow(10, Math.floor(Math.log10(max)))
  const norm = max / mag
  if (norm <= 1) return mag
  if (norm <= 2) return 2 * mag
  if (norm <= 5) return 5 * mag
  return 10 * mag
}

const maxValue = computed(() => {
  const max = Math.max(...props.data.map((d) => d.value), 1)
  return ceilNice(max)
})

const yLabels = computed(() => {
  const raw = maxValue.value
  const step = Math.ceil(raw / 5)
  const labels: number[] = []
  for (let v = 0; v <= raw; v += step) {
    labels.unshift(v)
  }
  return labels
})

const linePathRef = ref<SVGPathElement | null>(null)
const chartRef = ref<HTMLElement | null>(null)
const hoverIndex = ref(-1)

const activeIndex = computed(() => hoverIndex.value >= 0 ? hoverIndex.value : -1)
const markerPoint = ref<{ x: number; y: number } | null>(null)

const points = computed(() => {
  const len = props.data.length
  const stepX = len > 1 ? chartWidth / (len - 1) : chartWidth / 2
  return props.data.map((item, index) => ({
    label: item.label,
    value: item.value,
    x: Number((index * stepX).toFixed(2)),
    y: Number((chartHeight - (item.value / maxValue.value) * chartHeight).toFixed(2)),
  }))
})

const linePath = computed(() => {
  const items = points.value
  if (!items.length) return ''
  let path = `M ${items[0]!.x} ${items[0]!.y}`
  for (let i = 0; i < items.length - 1; i++) {
    const cur = items[i]!
    const next = items[i + 1]!
    const cx = Number(((cur.x + next.x) / 2).toFixed(2))
    path += ` C ${cx} ${cur.y}, ${cx} ${next.y}, ${next.x} ${next.y}`
  }
  return path
})

const areaPath = computed(() => {
  const items = points.value
  if (!items.length) return ''
  const first = items[0]!
  const last = items[items.length - 1]!
  return `${linePath.value} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`
})

const gridLines = computed(() =>
  yLabels.value.map((v) => ({
    value: v,
    y: Number((chartHeight - (v / maxValue.value) * chartHeight).toFixed(2)),
  })),
)

const activePoint = computed(() => points.value[activeIndex.value] || null)

const tooltipStyle = computed(() => ({
  left: `${(((markerPoint.value?.x ?? activePoint.value?.x ?? 0) / chartWidth) * 100).toFixed(2)}%`,
  top: `${(((markerPoint.value?.y ?? activePoint.value?.y ?? 0) / chartHeight) * 100).toFixed(2)}%`,
}))

const markerStyle = computed(() => ({
  left: `${(((markerPoint.value?.x ?? activePoint.value?.x ?? 0) / chartWidth) * 100).toFixed(2)}%`,
  top: `${(((markerPoint.value?.y ?? activePoint.value?.y ?? 0) / chartHeight) * 100).toFixed(2)}%`,
}))

function updateMarkerPoint() {
  if (!linePathRef.value || !activePoint.value) {
    markerPoint.value = activePoint.value ? { x: activePoint.value.x, y: activePoint.value.y } : null
    return
  }
  const path = linePathRef.value as SVGPathElement
  const targetX = activePoint.value.x
  const totalLength = path.getTotalLength()
  let closest = path.getPointAtLength(0)
  let closestDist = Math.abs(closest.x - targetX)
  for (let step = 1; step <= 240; step++) {
    const p = path.getPointAtLength((totalLength * step) / 240)
    const d = Math.abs(p.x - targetX)
    if (d < closestDist) { closest = p; closestDist = d }
  }
  markerPoint.value = { x: Number(closest.x.toFixed(2)), y: Number(closest.y.toFixed(2)) }
}

function onChartMouseMove(event: MouseEvent) {
  const rect = chartRef.value?.getBoundingClientRect()
  if (!rect) return
  const relX = event.clientX - rect.left
  const pctX = relX / rect.width
  const svgX = pctX * chartWidth
  let nearest = 0
  let nearestDist = Infinity
  for (let i = 0; i < points.value.length; i++) {
    const d = Math.abs(points.value[i]!.x - svgX)
    if (d < nearestDist) { nearestDist = d; nearest = i }
  }
  hoverIndex.value = nearest
}

function onChartMouseLeave() {
  hoverIndex.value = -1
}

watch(activeIndex, async () => {
  if (activeIndex.value < 0) { markerPoint.value = null; return }
  await nextTick()
  updateMarkerPoint()
})
</script>

<template>
  <div class="admin-chart">
    <div class="admin-chart__body">
      <div class="admin-chart__axis-y">
        <span v-for="gl in gridLines" :key="gl.value">{{ gl.value }}{{ ySuffix }}</span>
      </div>
      <div class="admin-chart__plot">
        <div
          ref="chartRef"
          class="admin-chart__canvas"
          @mousemove="onChartMouseMove"
          @mouseleave="onChartMouseLeave"
        >
          <svg
            class="admin-chart__svg"
            :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="color" stop-opacity="0.48" />
                <stop offset="72%" :stop-color="color" stop-opacity="0.08" />
                <stop offset="100%" :stop-color="color" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g class="admin-chart__grid">
              <line
                v-for="gl in gridLines"
                :key="`grid-${gl.value}`"
                x1="0" :y1="gl.y" :x2="chartWidth" :y2="gl.y"
              />
              <line
                v-for="p in points"
                :key="`v-${p.label}`"
                :x1="p.x" y1="0" :x2="p.x" :y2="chartHeight"
              />
            </g>
            <path class="admin-chart__area" :d="areaPath" :fill="`url(#${gradientId})`" />
            <path
              ref="linePathRef"
              class="admin-chart__line"
              :d="linePath"
              :stroke="color"
            />
            <g class="admin-chart__dots">
              <circle
                v-for="(p, i) in points"
                :key="`dot-${i}`"
                :cx="p.x"
                :cy="p.y"
                r="5"
                fill="#fff"
                :stroke="color"
                stroke-width="2"
                class="admin-chart__dot"
                :class="{ 'admin-chart__dot--active': i === activeIndex }"
              />
            </g>
          </svg>
          <div v-if="hoverIndex >= 0 && activePoint" class="admin-chart__marker" :style="markerStyle">
            <span class="admin-chart__marker-ring admin-chart__marker-ring--outer" />
            <span class="admin-chart__marker-ring admin-chart__marker-ring--inner" />
            <span class="admin-chart__marker-dot" />
          </div>
          <div v-if="hoverIndex >= 0 && activePoint" class="admin-chart__tooltip" :style="tooltipStyle">
            <h3>{{ activePoint.label }}</h3>
            <div class="admin-chart__tooltip-grid">
              <div>
                <strong>{{ activePoint.value }}{{ ySuffix }}</strong>
                <span>{{ valueLabel }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="admin-chart__axis-x">
          <span
            v-for="p in points"
            :key="`x-${p.label}`"
            :style="{ left: (p.x / chartWidth * 100).toFixed(2) + '%' }"
          >{{ p.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-chart__body {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
}

.admin-chart__axis-y {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 35rem;
  padding: 0rem 0 9rem;
  color: #a4a4a4;
  span { font-size: 1.1rem; line-height: 1; white-space: nowrap; }
}

.admin-chart__plot {
  position: relative;
  min-width: 0;
  height: 35rem;
  padding-bottom: 4.8rem;
}

.admin-chart__canvas {
  position: relative;
  height: calc(100% - 4.8rem);
  cursor: crosshair;
}

.admin-chart__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.admin-chart__grid line {
  stroke: rgba(228, 228, 228, 0.9);
  stroke-width: 1;
}

.admin-chart__line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.admin-chart__dots {
  pointer-events: none;
}

.admin-chart__dot {
  transition: r 0.15s, opacity 0.15s;
  opacity: 0.6;
}

.admin-chart__dot--active {
  r: 6;
  opacity: 1;
}

.admin-chart__marker {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.admin-chart__marker-ring,
.admin-chart__marker-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.admin-chart__marker-ring { background: v-bind(color); }

.admin-chart__marker-ring--outer {
  width: 2.8rem; height: 2.8rem; opacity: 0.14;
}

.admin-chart__marker-ring--inner {
  width: 1.8rem; height: 1.8rem; opacity: 0.24;
}

.admin-chart__marker-dot {
  width: 1rem; height: 1rem;
  background: v-bind(color);
  border: 0.4rem solid #fff;
  box-sizing: content-box;
}

.admin-chart__tooltip {
  position: absolute;
  z-index: 2;
  width: 18rem;
  padding: 1.6rem 1.4rem 1.2rem;
  background: #fff;
  border-radius: 1.8rem;
  box-shadow: 0 20px 45px rgba(28, 30, 32, 0.12);
  transform: translate(1.8rem, 2.2rem);
  h3 { margin-bottom: 1.4rem; font-size: 1.6rem; font-weight: 500; color: #3a3a3a; }
}

.admin-chart__tooltip-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  strong { display: block; margin-bottom: 0.5rem; font-size: 1.4rem; font-weight: 400; color: #4a4a4a; }
  span { font-size: 1.1rem; color: #8b8b8b; }
}

.admin-chart__axis-x {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 4.8rem;
  span {
    position: absolute;
    transform: translateX(-50%);
    font-size: 1.2rem;
    color: #444;
    white-space: nowrap;
  }
}
</style>
