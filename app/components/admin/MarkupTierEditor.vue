<script setup lang="ts">
type MarkupRange = {
  id: string
  from: number
  to: number | null
  markup: number | null
}

const props = withDefaults(
  defineProps<{
    modelValue: MarkupRange[]
    title: string
    subtitle?: string
    helper?: string
  }>(),
  {
    subtitle: '',
    helper: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: MarkupRange[]]
}>()

const SLIDER_MAX = 250000

let rangeCounter = 0

const createRange = (from = 0): MarkupRange => ({
  id: `range-${Date.now()}-${rangeCounter++}`,
  from,
  to: null,
  markup: null,
})

const cloneRanges = (ranges: MarkupRange[]) =>
  ranges.map((range) => ({
    ...range,
  }))

const parseNumber = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

const isFilled = (range: MarkupRange) => range.to !== null && range.markup !== null

const normalizeRanges = (ranges: MarkupRange[]) => {
  const normalized = cloneRanges(ranges.length ? ranges : [createRange(0)])

  if (!normalized.length) {
    normalized.push(createRange(0))
  }

  normalized[0].from = 0

  for (let index = 0; index < normalized.length; index += 1) {
    const current = normalized[index]

    if (index > 0) {
      const previous = normalized[index - 1]
      current.from = Math.min(SLIDER_MAX, previous.to ?? previous.from)
    }

    if (current.to !== null) {
      current.to = Math.min(SLIDER_MAX, Math.max(current.from, Number(current.to)))
    }

    if (current.markup !== null) {
      current.markup = Math.max(0, Number(current.markup))
    }
  }

  while (normalized.length > 1) {
    const last = normalized[normalized.length - 1]
    const prev = normalized[normalized.length - 2]

    if (!isFilled(last) && !isFilled(prev)) {
      normalized.pop()
      continue
    }

    break
  }

  const lastRange = normalized[normalized.length - 1]

  if (isFilled(lastRange) && (lastRange.to ?? lastRange.from) < SLIDER_MAX) {
    normalized.push(createRange(lastRange.to ?? lastRange.from))
  }

  return normalized
}

const localRanges = ref<MarkupRange[]>(normalizeRanges(cloneRanges(props.modelValue)))

const hasTrailingDraft = computed(() => {
  const lastRange = localRanges.value[localRanges.value.length - 1]

  return Boolean(lastRange && !isFilled(lastRange))
})

const isScaleComplete = computed(() => {
  const lastRange = localRanges.value[localRanges.value.length - 1]

  if (!lastRange) {
    return false
  }

  return (lastRange.to ?? lastRange.from) >= SLIDER_MAX
})

const canAddRange = computed(() => {
  const lastRange = localRanges.value[localRanges.value.length - 1]

  if (!lastRange || hasTrailingDraft.value) {
    return false
  }

  return isFilled(lastRange) && (lastRange.to ?? lastRange.from) < SLIDER_MAX
})

watch(
  () => props.modelValue,
  (value) => {
    localRanges.value = normalizeRanges(cloneRanges(value))
  },
  { deep: true },
)

const commit = () => {
  const normalized = normalizeRanges(localRanges.value)
  localRanges.value = normalized
  emit('update:modelValue', cloneRanges(normalized))
}

const updateTo = (index: number, value: string | number) => {
  const parsedValue = parseNumber(value)

  localRanges.value[index].to = parsedValue === null
    ? null
    : Math.min(SLIDER_MAX, Math.max(localRanges.value[index].from, parsedValue))

  commit()
}

const updateMarkup = (index: number, value: string | number) => {
  localRanges.value[index].markup = parseNumber(value)
  commit()
}

const addRange = () => {
  const lastRange = localRanges.value[localRanges.value.length - 1]

  if (!lastRange || !isFilled(lastRange)) {
    return
  }

  const nextStart = Math.min(SLIDER_MAX, lastRange.to ?? lastRange.from)

  if (nextStart >= SLIDER_MAX) {
    return
  }

  localRanges.value = [...localRanges.value, createRange(nextStart)]
  commit()
}

</script>

<template>
  <section class="markup-editor">
    <div class="markup-editor__head">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>

      <div class="markup-editor__head-actions">
        <span class="markup-editor__badge">Градации</span>
        <button
          v-if="canAddRange"
          class="markup-editor__add-button"
          type="button"
          @click="addRange"
        >
          Добавить шкалу
        </button>
        <span v-else-if="hasTrailingDraft" class="markup-editor__hint-pill">Следующая шкала уже добавлена</span>
        <span v-else-if="isScaleComplete" class="markup-editor__hint-pill markup-editor__hint-pill--muted">Шкала завершена до 250 000</span>
      </div>
    </div>

    <div class="markup-editor__rows">
      <article v-for="(range, index) in localRanges" :key="range.id" class="markup-editor__row">
        <div class="markup-editor__row-head">
          <strong>Градация {{ index + 1 }}</strong>
          <span>Максимум: {{ SLIDER_MAX.toLocaleString('ru-RU') }}</span>
        </div>

        <div class="markup-editor__inputs">
          <label class="markup-editor__field markup-editor__field--readonly">
            <span>От</span>
            <input type="number" :value="range.from" readonly>
          </label>

          <label class="markup-editor__field">
            <span>До</span>
            <input
              type="number"
              :value="range.to ?? ''"
              :min="range.from"
              :max="SLIDER_MAX"
              placeholder="Конечная цена"
              @input="updateTo(index, ($event.target as HTMLInputElement).value)"
            >
          </label>

          <label class="markup-editor__field markup-editor__field--markup">
            <span>Наценка</span>
            <input
              type="number"
              :value="range.markup ?? ''"
              min="0"
              placeholder="Размер наценки"
              @input="updateMarkup(index, ($event.target as HTMLInputElement).value)"
            >
            <em>%</em>
          </label>
        </div>
      </article>
    </div>

    <p v-if="helper" class="markup-editor__helper">{{ helper }}</p>
  </section>
</template>

<style scoped lang="scss">
.markup-editor {
  padding: 2rem;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 16px 34px rgba(23, 27, 29, 0.04);
}

.markup-editor__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
  margin-bottom: 1.4rem;

  h2 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #404040;
  }

  p {
    margin-top: 0.6rem;
    font-size: 1.4rem;
    line-height: 1.45;
    color: #8b8b8b;
  }
}

.markup-editor__head-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.markup-editor__add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.4rem;
  padding: 0 1.4rem;
  background: #fff;
  border: 1px solid rgba(24, 181, 54, 0.2);
  border-radius: 999px;
  font-size: 1.25rem;
  color: $green;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(24, 181, 54, 0.06);
  }
}

.markup-editor__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.4rem;
  padding: 0 1.2rem;
  background: rgba(24, 181, 54, 0.08);
  border-radius: 999px;
  font-size: 1.25rem;
  color: $green;
  white-space: nowrap;
}

.markup-editor__hint-pill {
  display: inline-flex;
  align-items: center;
  min-height: 3.4rem;
  padding: 0 1.2rem;
  background: #f5fbf6;
  border-radius: 999px;
  font-size: 1.2rem;
  color: #69a375;
  white-space: nowrap;
}

.markup-editor__hint-pill--muted {
  background: #f7f7f7;
  color: #9c9c9c;
}

.markup-editor__scale {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.6rem;

  span {
    font-size: 1.2rem;
    color: #a1a1a1;
  }

  span:last-child {
    text-align: right;
  }
}

.markup-editor__rows {
  display: grid;
  gap: 2rem;
}

.markup-editor__row {
  padding: 1.8rem;
  background: #fcfcfc;
  border: 1px solid #f0f0f0;
  border-radius: 1.6rem;
}

.markup-editor__row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.4rem;

  strong {
    font-size: 1.45rem;
    font-weight: 600;
    color: #4c4c4c;
  }

  span {
    font-size: 1.2rem;
    color: #9a9a9a;
  }
}

.markup-editor__inputs {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(18rem, 1.15fr);
  gap: 1.2rem;
}

.markup-editor__field {
  position: relative;
  display: grid;
  gap: 0.6rem;

  span {
    font-size: 1.25rem;
    color: #8f8f8f;
  }

  input {
    width: 100%;
    height: 4.8rem;
    padding: 0 1.5rem;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.45rem;
    color: #4a4a4a;

    &::placeholder {
      color: #b0b0b0;
    }
  }
}

.markup-editor__field--readonly input {
  background: #f6f8f7;
  color: #7d7d7d;
}

.markup-editor__field--markup {
  input {
    padding-right: 3rem;
  }

  em {
    position: absolute;
    right: 1.4rem;
    bottom: 1.45rem;
    font-size: 1.45rem;
    color: #858585;
    font-style: normal;
  }
}

.markup-editor__helper {
  margin-top: 1.6rem;
  font-size: 1.3rem;
  line-height: 1.45;
  color: #8e8e8e;
}

@media (max-width: 1180px) {
  .markup-editor__head {
    flex-direction: column;
  }

  .markup-editor__head-actions {
    width: 100%;
    justify-content: space-between;
  }

  .markup-editor__inputs {
    grid-template-columns: 1fr;
  }
}
</style>
