<script setup lang="ts">
const currentDiscount = '10%'
const currentTurnover = '8000\u20BD'

const discountRanges = [
  { turnover: '10000\u20BD-19999\u20BD', discount: '20%' },
  { turnover: '20000\u20BD-50000\u20BD', discount: '30%' },
]

const chartData = [
  { month: 'Янв', value: 4500 },
  { month: 'Фев', value: 13000 },
  { month: 'Мар', value: 23000 },
  { month: 'Апр', value: 5500 },
  { month: 'Май', value: 12500 },
  { month: 'Июнь', value: 26000 },
  { month: 'Июль', value: 18500 },
  { month: 'Авг', value: 11200 },
  { month: 'Сент', value: 9000 },
  { month: 'Окт', value: 23000 },
  { month: 'Ноя', value: 28000 },
  { month: 'Дек', value: 22500 },
]

const chartWidth = 1060
const chartHeight = 320
const maxValue = 40000
const activeIndex = 9
const yLabels = [40000, 30000, 20000, 15000, 10000, 5000, 0]
const linePathRef = ref<SVGPathElement | null>(null)
const markerPoint = ref<{ x: number; y: number } | null>(null)

const points = computed(() => {
  const stepX = chartWidth / (chartData.length - 1)

  return chartData.map((item, index) => ({
    ...item,
    x: Number((index * stepX).toFixed(2)),
    y: Number((chartHeight - (item.value / maxValue) * chartHeight).toFixed(2)),
  }))
})

const linePath = computed(() => {
  const items = points.value

  if (!items.length) {
    return ''
  }

  let path = `M ${items[0].x} ${items[0].y}`

  for (let index = 0; index < items.length - 1; index += 1) {
    const current = items[index]
    const next = items[index + 1]
    const controlX = Number(((current.x + next.x) / 2).toFixed(2))

    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
  }

  return path
})

const areaPath = computed(() => {
  const items = points.value

  if (!items.length) {
    return ''
  }

  const first = items[0]
  const last = items[items.length - 1]

  return `${linePath.value} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`
})

const gridLines = computed(() =>
  yLabels.map((value) => ({
    value,
    y: Number((chartHeight - (value / maxValue) * chartHeight).toFixed(2)),
  })),
)

const activePoint = computed(() => points.value[activeIndex])

const updateMarkerPoint = () => {
  if (!linePathRef.value || !activePoint.value) {
    markerPoint.value = activePoint.value
    return
  }

  const path = linePathRef.value
  const targetX = activePoint.value.x
  const totalLength = path.getTotalLength()
  let closestPoint = path.getPointAtLength(0)
  let closestDistance = Math.abs(closestPoint.x - targetX)

  for (let step = 1; step <= 240; step += 1) {
    const pointAtLength = path.getPointAtLength((totalLength * step) / 240)
    const distance = Math.abs(pointAtLength.x - targetX)

    if (distance < closestDistance) {
      closestPoint = pointAtLength
      closestDistance = distance
    }
  }

  markerPoint.value = {
    x: Number(closestPoint.x.toFixed(2)),
    y: Number(closestPoint.y.toFixed(2)),
  }
}

const tooltipStyle = computed(() => ({
  left: `${(((markerPoint.value?.x ?? activePoint.value.x) / chartWidth) * 100).toFixed(2)}%`,
  top: `${(((markerPoint.value?.y ?? activePoint.value.y) / chartHeight) * 100).toFixed(2)}%`,
}))

const markerStyle = computed(() => ({
  left: `${(((markerPoint.value?.x ?? activePoint.value.x) / chartWidth) * 100).toFixed(2)}%`,
  top: `${(((markerPoint.value?.y ?? activePoint.value.y) / chartHeight) * 100).toFixed(2)}%`,
}))

onMounted(async () => {
  await nextTick()
  updateMarkerPoint()
})

watch(linePath, async () => {
  await nextTick()
  updateMarkerPoint()
})
</script>

<template>
  <section class="discounts-page">
    <div class="discounts-page__top">
      <article class="discount-card">
        <div class="discount-card__main">
          <div class="discount-card__icon">
            <NuxtImg src="/icons/profile/discountIcon.svg" alt="Иконка скидки" />
          </div>

          <div class="discount-card__meta">
            <strong>{{ currentDiscount }}</strong>
            <span>Размер скидки</span>
          </div>
        </div>

        <div class="discount-card__divider" />

        <div class="discount-card__footer">
          <strong>{{ currentTurnover }}</strong>
          <span>Нынешний оборот</span>
        </div>
      </article>

      <article class="discount-scale">
        <div class="discount-scale__header">
          <span class="discount-scale__heading">Оборот</span>
          <span class="discount-scale__heading discount-scale__heading--discount">Размер скидки</span>
        </div>

        <div
          v-for="discountRange in discountRanges"
          :key="discountRange.turnover"
          class="discount-scale__row"
        >
          <span>{{ discountRange.turnover }}</span>
          <div class="discount-scale__line" />
          <strong>{{ discountRange.discount }}</strong>
        </div>
      </article>
    </div>

    <article class="chart-card">
      <div class="chart-card__head">
        <button class="chart-card__period" type="button">
          Оборот за год
          <span class="chart-card__chevron" />
        </button>
      </div>

      <div class="chart-card__body">
        <div class="chart-card__axis chart-card__axis--y">
          <span v-for="gridLine in gridLines" :key="gridLine.value">{{ gridLine.value }}₽</span>
        </div>

        <div class="chart-card__plot">
          <div class="chart-card__canvas">
            <svg
              class="chart-card__svg"
              :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="discount-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ff9b1f" stop-opacity="0.48" />
                  <stop offset="72%" stop-color="#ff9b1f" stop-opacity="0.08" />
                  <stop offset="100%" stop-color="#ff9b1f" stop-opacity="0" />
                </linearGradient>
              </defs>

              <g class="chart-card__grid">
                <line
                  v-for="gridLine in gridLines"
                  :key="`grid-${gridLine.value}`"
                  x1="0"
                  :y1="gridLine.y"
                  :x2="chartWidth"
                  :y2="gridLine.y"
                />

                <line
                  v-for="point in points"
                  :key="`vertical-${point.month}`"
                  :x1="point.x"
                  y1="0"
                  :x2="point.x"
                  :y2="chartHeight"
                />
              </g>

              <path class="chart-card__area" :d="areaPath" />
              <path ref="linePathRef" class="chart-card__line" :d="linePath" />
            </svg>

            <div v-if="activePoint" class="chart-card__marker" :style="markerStyle">
              <span class="chart-card__marker-ring chart-card__marker-ring--outer" />
              <span class="chart-card__marker-ring chart-card__marker-ring--inner" />
              <span class="chart-card__marker-dot" />
            </div>

            <div v-if="activePoint" class="chart-card__tooltip" :style="tooltipStyle">
              <h3>{{ activePoint.month }}, 2026</h3>
              <div class="chart-card__tooltip-grid">
                <div>
                  <strong>{{ activePoint.value }}₽</strong>
                  <span>Оборот</span>
                </div>
                <div>
                  <strong>30%</strong>
                  <span>Скидка</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card__axis chart-card__axis--x">
            <span v-for="point in points" :key="`month-${point.month}`">{{ point.month }}</span>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.discounts-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2.2rem;
  min-width: 0;
}

.discounts-page__top {
  display: grid;
  grid-template-columns: minmax(31rem, 36.8rem) minmax(0, 1fr);
  gap: 2rem;
  align-items: stretch;
}

.discount-card,
.discount-scale,
.chart-card {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 12px 34px rgba(28, 30, 32, 0.04);
}

.discount-card {
  padding: 2rem 2.4rem;
}

.discount-card__main {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.discount-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;

  img {
    width: 4.4rem;
    height: 4.4rem;
  }
}

.discount-card__meta,
.discount-card__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  strong {
    font-size: 2rem;
    font-weight: 500;
    color: #333;
    line-height: 1;
  }

  span {
    font-size: 1.4rem;
    color: #7d7d7d;
    line-height: 1.3;
  }
}

.discount-card__divider {
  width: 100%;
  height: 1px;
  margin: 1.8rem 0 1.6rem;
  background: #ececec;
}

.discount-scale {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.8rem 2.6rem;
}

.discount-scale__header,
.discount-scale__row {
  display: grid;
  grid-template-columns: minmax(22rem, 24rem) minmax(10rem, 1fr) minmax(9rem, 10.5rem);
  column-gap: 2.8rem;
  align-items: center;
}

.discount-scale__header {
  margin-bottom: 1.2rem;

  .discount-scale__heading {
    font-size: 1.4rem;
    color: #6f6f6f;
  }

  .discount-scale__heading--discount {
    grid-column: 3;
    justify-self: start;
    min-width: 0;
    white-space: nowrap;
  }
}

.discount-scale__row + .discount-scale__row {
  margin-top: 1.4rem;
}

.discount-scale__row {
  span,
  strong {
    font-size: 1.6rem;
    font-weight: 400;
    color: #353535;
  }

  strong {
    min-width: 4.8rem;
  }
}

.discount-scale__line {
  width: 100%;
  max-width: 16.4rem;
  height: 1px;
  background: #ececec;
  justify-self: center;
}

.chart-card {
  padding: 2.4rem 2.4rem 2rem;
}

.chart-card__head {
  margin-bottom: 2.8rem;
}

.chart-card__period {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0;
  background: transparent;
  font-size: 1.8rem;
  color: #373737;
  cursor: pointer;
}

.chart-card__chevron {
  width: 0.9rem;
  height: 0.9rem;
  border-right: 1.5px solid #5f5f5f;
  border-bottom: 1.5px solid #5f5f5f;
  transform: rotate(45deg) translateY(-1px);
}

.chart-card__body {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 1.8rem;
}

.chart-card__axis {
  display: flex;
  color: #a4a4a4;
}

.chart-card__axis--y {
  flex-direction: column;
  justify-content: space-between;
  height: 38.4rem;
  padding: 2.4rem 0 5.2rem;

  span {
    font-size: 1.1rem;
    line-height: 1;
    white-space: nowrap;
  }
}

.chart-card__plot {
  position: relative;
  min-width: 0;
  height: 38.4rem;
  padding-bottom: 5.2rem;
}

.chart-card__canvas {
  position: relative;
  height: calc(100% - 5.2rem);
}

.chart-card__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-card__grid {
  line {
    stroke: rgba(228, 228, 228, 0.9);
    stroke-width: 1;
  }
}

.chart-card__area {
  fill: url(#discount-area-gradient);
}

.chart-card__line {
  fill: none;
  stroke: #ff8800;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-card__marker {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.chart-card__marker-ring,
.chart-card__marker-dot {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-card__marker-ring {
  background: #ff8800;
}

.chart-card__marker-ring--outer {
  width: 5.4rem;
  height: 5.4rem;
  opacity: 0.14;
}

.chart-card__marker-ring--inner {
  width: 3.2rem;
  height: 3.2rem;
  opacity: 0.24;
}

.chart-card__marker-dot {
  width: 1.6rem;
  height: 1.6rem;
  background: #ff8800;
  border: 0.6rem solid #fff;
  box-sizing: content-box;
}

.chart-card__tooltip {
  position: absolute;
  z-index: 2;
  width: 18rem;
  padding: 1.6rem 1.4rem 1.2rem;
  background: #fff;
  border-radius: 1.8rem;
  box-shadow: 0 20px 45px rgba(28, 30, 32, 0.12);
  transform: translate(1.8rem, 2.2rem);

  h3 {
    margin-bottom: 1.4rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: #3a3a3a;
  }
}

.chart-card__tooltip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;

  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    font-weight: 400;
    color: #4a4a4a;
  }

  span {
    font-size: 1.1rem;
    color: #8b8b8b;
  }
}

.chart-card__axis--x {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0;

  span {
    justify-self: center;
    font-size: 1.2rem;
    color: #444;
  }
}
</style>
