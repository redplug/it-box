<script setup lang="ts">
import {
  type TimelinePoint,
  calculateDistanceKm,
  filterPointsByDate,
  localCalendarDate,
  normalizeTimeline,
  projectTimelinePoints,
} from './timeline.models';

const points = ref<TimelinePoint[]>([]);
const startDate = ref('');
const endDate = ref('');
const error = ref('');
const fileInput = ref<HTMLInputElement>();
const canvas = ref<HTMLCanvasElement>();
let animationFrame: number | undefined;
let previewGeneration = 0;
let selectionGeneration = 0;

const availableStart = computed(() => points.value.length > 0
  ? localCalendarDate(points.value[0].timestamp)
  : '');
const availableEnd = computed(() => points.value.length > 0
  ? localCalendarDate(points.value[points.value.length - 1].timestamp)
  : '');
const startDateMax = computed(() => endDate.value && endDate.value < availableEnd.value
  ? endDate.value
  : availableEnd.value);
const endDateMin = computed(() => startDate.value && startDate.value > availableStart.value
  ? startDate.value
  : availableStart.value);

const selectedPoints = computed(() => {
  if (!startDate.value
    || !endDate.value
    || startDate.value > endDate.value
    || startDate.value < availableStart.value
    || endDate.value > availableEnd.value) {
    return [];
  }
  return filterPointsByDate(points.value, startDate.value, endDate.value);
});

const rangeError = computed(() => {
  if (!startDate.value || !endDate.value) {
    return '시작일과 종료일을 모두 선택해 주세요.';
  }
  if (startDate.value > endDate.value) {
    return '시작일은 종료일보다 늦을 수 없습니다.';
  }
  if (startDate.value < availableStart.value || endDate.value > availableEnd.value) {
    return '선택 기간은 분석 가능 기간 안에서 지정해 주세요.';
  }
  if (selectedPoints.value.length === 0) {
    return '선택한 기간에 위치 정보가 없습니다.';
  }
  return '';
});

const distanceKm = computed(() => calculateDistanceKm(selectedPoints.value));
const visitedDays = computed(() => new Set(
  selectedPoints.value.map(({ timestamp }) => localCalendarDate(timestamp)),
).size);

function cancelPreview() {
  previewGeneration += 1;
  cancelAnimationFrame(animationFrame ?? 0);
  animationFrame = undefined;
}

function drawMarker(context: CanvasRenderingContext2D, x: number, y: number) {
  context.beginPath();
  context.arc(x, y, 4, 0, Math.PI * 2);
  context.fill();
}

function drawPreview() {
  cancelPreview();
  const generation = previewGeneration;
  const previewPoints = selectedPoints.value;

  animationFrame = requestAnimationFrame(() => {
    if (generation !== previewGeneration) {
      return;
    }

    const element = canvas.value;
    const context = element?.getContext('2d');
    if (!element || !context) {
      return;
    }

    context.clearRect(0, 0, element.width, element.height);
    const coordinates = projectTimelinePoints(previewPoints, element.width, element.height);
    if (coordinates.length === 0) {
      return;
    }

    context.strokeStyle = '#3b82f6';
    context.fillStyle = '#2563eb';
    context.lineWidth = 2;
    drawMarker(context, coordinates[0].x, coordinates[0].y);
    if (coordinates.length === 1) {
      animationFrame = undefined;
      return;
    }

    const pointsPerFrame = Math.ceil((coordinates.length - 1) / 60);
    let nextPointIndex = 1;
    const animate = () => {
      if (generation !== previewGeneration) {
        return;
      }

      const frameEnd = Math.min(coordinates.length, nextPointIndex + pointsPerFrame);
      context.beginPath();
      context.moveTo(coordinates[nextPointIndex - 1].x, coordinates[nextPointIndex - 1].y);
      for (; nextPointIndex < frameEnd; nextPointIndex += 1) {
        context.lineTo(coordinates[nextPointIndex].x, coordinates[nextPointIndex].y);
      }
      context.stroke();

      if (nextPointIndex < coordinates.length) {
        animationFrame = requestAnimationFrame(animate);
      }
      else {
        const finalPoint = coordinates[coordinates.length - 1];
        drawMarker(context, finalPoint.x, finalPoint.y);
        animationFrame = undefined;
      }
    };

    animate();
  });
}

async function onFileSelected(file: File) {
  const selection = ++selectionGeneration;
  cancelPreview();
  error.value = '';
  points.value = [];
  startDate.value = '';
  endDate.value = '';

  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    error.value = 'JSON 파일만 선택할 수 있습니다.';
    return;
  }

  try {
    const input = JSON.parse(await file.text());
    if (selection !== selectionGeneration) {
      return;
    }

    const result = normalizeTimeline(input);
    if (selection !== selectionGeneration) {
      return;
    }

    if (result.error) {
      error.value = '읽을 수 있는 Timeline JSON 파일이 아닙니다.';
      return;
    }

    points.value = result.points;
    if (points.value.length === 0) {
      error.value = '표시할 Timeline 위치 정보가 없습니다.';
      return;
    }

    startDate.value = localCalendarDate(points.value[0].timestamp);
    endDate.value = localCalendarDate(points.value[points.value.length - 1].timestamp);
  }
  catch {
    if (selection === selectionGeneration) {
      error.value = '읽을 수 있는 Timeline JSON 파일이 아닙니다.';
    }
  }
}

async function onInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    await onFileSelected(file);
  }
}

function reset() {
  selectionGeneration += 1;
  cancelPreview();
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

onBeforeUnmount(() => cancelPreview());
</script>

<template>
  <div flex flex-col gap-4>
    <c-card data-test-id="timeline-privacy-notice">
      파일과 위치 좌표는 이 브라우저에서만 처리됩니다. 업로드·저장·외부 지도 요청은 하지 않습니다.
      본인 소유이거나 처리 권한이 있는 데이터만 사용하고, 타인의 위치 정보는 허락 없이 처리하지 마세요.
    </c-card>

    <c-card>
      <label flex flex-col gap-2>
        <span font-medium>Google Timeline JSON 파일</span>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          data-test-id="timeline-file-input"
          @change="onInputChange"
        >
      </label>
      <p v-if="error" mt-2 text-red-600 data-test-id="timeline-error">
        {{ error }}
      </p>
    </c-card>

    <c-card v-if="points.length > 0" data-test-id="timeline-summary">
      <div flex flex-wrap items-start justify-between gap-3>
        <div>
          <div font-medium>
            Timeline 분석
          </div>
          <div mt-1 text-sm>
            분석 가능 기간: {{ availableStart }} ~ {{ availableEnd }}
          </div>
        </div>
        <button type="button" data-test-id="timeline-reset" @click="reset">
          초기화
        </button>
      </div>

      <div mt-4 flex flex-wrap gap-3>
        <label flex flex-col gap-1>
          <span>시작일</span>
          <input
            v-model="startDate"
            type="date"
            :min="availableStart"
            :max="startDateMax"
          >
        </label>
        <label flex flex-col gap-1>
          <span>종료일</span>
          <input
            v-model="endDate"
            type="date"
            :min="endDateMin"
            :max="availableEnd"
          >
        </label>
      </div>

      <p
        v-if="rangeError"
        mt-4
        text-red-600
        role="alert"
        data-test-id="timeline-range-error"
      >
        {{ rangeError }}
      </p>

      <template v-else>
        <div mt-4 text-2xl>
          {{ selectedPoints.length }}개 지점 · {{ distanceKm.toFixed(1) }} km
        </div>
        <div mt-1 text-sm>
          방문한 날짜 {{ visitedDays }}일
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
          :aria-label="`선택한 Timeline 경로 미리보기: ${selectedPoints.length}개 지점`"
          data-test-id="timeline-canvas"
        />
      </template>
    </c-card>
  </div>
</template>
