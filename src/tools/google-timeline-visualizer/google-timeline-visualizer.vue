<script setup lang="ts">
import { type TimelinePoint, calculateDistanceKm, filterPointsByDate, normalizeTimeline } from './timeline.models';

const points = ref<TimelinePoint[]>([]);
const startDate = ref('');
const endDate = ref('');
const error = ref('');
const fileInput = ref<HTMLInputElement>();
const canvas = ref<HTMLCanvasElement>();
let animationFrame: number | undefined;

const selectedPoints = computed(() => {
  if (!startDate.value || !endDate.value) {
    return points.value;
  }
  return filterPointsByDate(points.value, startDate.value, endDate.value);
});
const distanceKm = computed(() => calculateDistanceKm(selectedPoints.value));

function localDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function drawPreview() {
  cancelAnimationFrame(animationFrame ?? 0);
  animationFrame = requestAnimationFrame(() => {
    const element = canvas.value;
    const context = element?.getContext('2d');
    if (!element || !context) {
      return;
    }

    context.clearRect(0, 0, element.width, element.height);
    if (selectedPoints.value.length === 0) {
      return;
    }

    const latitudes = selectedPoints.value.map(({ latitude }) => latitude);
    const longitudes = selectedPoints.value.map(({ longitude }) => longitude);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);
    const margin = 24;
    const width = element.width - margin * 2;
    const height = element.height - margin * 2;
    const latitudeRange = maxLatitude - minLatitude || 1;
    const longitudeRange = maxLongitude - minLongitude || 1;

    context.strokeStyle = '#3b82f6';
    context.lineWidth = 2;
    context.beginPath();
    selectedPoints.value.forEach(({ latitude, longitude }, index) => {
      const x = margin + ((longitude - minLongitude) / longitudeRange) * width;
      const y = margin + (1 - (latitude - minLatitude) / latitudeRange) * height;
      if (index === 0) {
        context.moveTo(x, y);
      }
      else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  });
}

async function onFileSelected(file: File) {
  error.value = '';
  points.value = [];
  startDate.value = '';
  endDate.value = '';

  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    error.value = 'JSON 파일만 선택할 수 있습니다.';
    return;
  }

  try {
    const result = normalizeTimeline(JSON.parse(await file.text()));
    if (result.error) {
      error.value = '읽을 수 있는 Timeline JSON 파일이 아닙니다.';
      return;
    }

    points.value = result.points;
    if (points.value.length === 0) {
      error.value = '표시할 Timeline 위치 정보가 없습니다.';
      return;
    }

    startDate.value = localDate(points.value[0].timestamp);
    endDate.value = localDate(points.value[points.value.length - 1].timestamp);
  }
  catch {
    error.value = '읽을 수 있는 Timeline JSON 파일이 아닙니다.';
  }
}

async function onInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    await onFileSelected(file);
  }
}

function reset() {
  points.value = [];
  startDate.value = '';
  endDate.value = '';
  error.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

watch(selectedPoints, async () => {
  await nextTick();
  drawPreview();
});

onBeforeUnmount(() => cancelAnimationFrame(animationFrame ?? 0));
</script>

<template>
  <div flex flex-col gap-4>
    <c-card data-test-id="timeline-privacy-notice" data-testid="timeline-privacy-notice">
      이 도구는 선택한 Timeline 파일을 브라우저에서만 처리하며, 파일이나 위치 정보는 외부로 전송하거나 저장하지 않습니다.
    </c-card>

    <c-card>
      <label flex flex-col gap-2>
        <span font-medium>Google Timeline JSON 파일</span>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          data-test-id="timeline-file-input"
          data-testid="timeline-file-input"
          @change="onInputChange"
        >
      </label>
      <p v-if="error" mt-2 text-red-600 data-test-id="timeline-error" data-testid="timeline-error">
        {{ error }}
      </p>
    </c-card>

    <c-card v-if="points.length > 0" data-test-id="timeline-summary" data-testid="timeline-summary">
      <div flex flex-wrap items-end justify-between gap-3>
        <div>
          <div font-medium>
            선택한 기간의 위치 기록
          </div>
          <div text-2xl>
            {{ selectedPoints.length }}개 지점 · {{ distanceKm.toFixed(1) }} km
          </div>
        </div>
        <button type="button" data-test-id="timeline-reset" data-testid="timeline-reset" @click="reset">
          초기화
        </button>
      </div>
      <div mt-4 flex flex-wrap gap-3>
        <label flex flex-col gap-1>
          <span>시작일</span>
          <input v-model="startDate" type="date" :max="endDate || undefined">
        </label>
        <label flex flex-col gap-1>
          <span>종료일</span>
          <input v-model="endDate" type="date" :min="startDate || undefined">
        </label>
      </div>
      <canvas
        ref="canvas"
        mt-4
        block
        h-64
        w-full
        rounded
        bg-slate-50
        width="640"
        height="256"
        role="img"
        aria-label="선택한 Timeline 경로 미리보기"
        data-test-id="timeline-canvas"
        data-testid="timeline-canvas"
      />
    </c-card>
  </div>
</template>
