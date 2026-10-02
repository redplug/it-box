<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useObjectUrl } from '@vueuse/core';
import type { ImageFormat } from './image';
import { loadRasterImage, renderRasterImage, resizeDimensions } from './image';
import { downloadBlob } from './local-tool';

const props = defineProps<{ mode: 'resize' | 'convert' }>();
const { t } = useI18n();
const file = ref<File>();
const width = ref(200);
const height = ref(200);
const keepRatio = ref(true);
const format = ref<ImageFormat>('image/webp');
const quality = ref(0.85);
const output = ref<Blob>();
const info = ref('');
const errorKey = ref('');
const busy = ref(false);
const fileInput = ref<HTMLInputElement>();
const preview = useObjectUrl(output);
const error = computed(() => errorKey.value ? t(errorKey.value) : '');
let generation = 0;

function invalidate() {
  generation++;
  output.value = undefined;
  info.value = '';
  errorKey.value = '';
  busy.value = false;
}
watch([file, width, height, keepRatio, format, quality], invalidate, { flush: 'sync' });
onBeforeUnmount(invalidate);

function selectFile(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0];
}
function reset() {
  file.value = undefined;
  width.value = 200;
  height.value = 200;
  keepRatio.value = true;
  format.value = 'image/webp';
  quality.value = 0.85;
  invalidate();
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
async function sample() {
  invalidate();
  const ticket = generation;
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  if (!context) {
    errorKey.value = 'tools.local.errors.unsupported';
    return;
  }
  context.fillStyle = '#0000ff';
  context.fillRect(0, 0, 1, 1);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (ticket === generation && blob) {
    file.value = new File([blob], 'example.png', { type: 'image/png' });
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
}
async function convert() {
  if (!file.value) {
    return;
  }
  invalidate();
  const ticket = generation;
  const selectedFile = file.value;
  const selectedWidth = width.value;
  const selectedHeight = height.value;
  const selectedRatio = keepRatio.value;
  const selectedFormat = props.mode === 'resize' ? 'image/png' : format.value;
  const selectedQuality = quality.value;
  busy.value = true;
  try {
    const image = await loadRasterImage(selectedFile);
    if (ticket !== generation) {
      return;
    }
    const dimensions = props.mode === 'resize'
      ? resizeDimensions(image.naturalWidth, image.naturalHeight, selectedWidth, selectedHeight, selectedRatio)
      : { width: image.naturalWidth, height: image.naturalHeight };
    const blob = await renderRasterImage(image, dimensions.width, dimensions.height, selectedFormat, selectedQuality);
    if (ticket !== generation) {
      return;
    }
    output.value = blob;
    info.value = `${dimensions.width} × ${dimensions.height} · ${blob.type} · ${blob.size} B`;
  }
  catch (error) {
    if (ticket === generation) {
      errorKey.value = error instanceof Error && error.message.startsWith('tools.') ? error.message : 'tools.local.errors.invalidInput';
    }
  }
  finally {
    if (ticket === generation) {
      busy.value = false;
    }
  }
}
function download() {
  if (output.value) {
    const extension = output.value.type === 'image/jpeg' ? 'jpg' : output.value.type.split('/')[1];
    downloadBlob(output.value, `it-box-image.${extension}`);
  }
}
</script>

<template>
  <div class="raster-tool">
    <p>{{ t('tools.local.localNotice') }}</p>
    <c-card>
      <label class="field">{{ t('tools.local.file') }}<input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp" data-test-id="file" @change="selectFile"></label>
      <p>{{ t('tools.image-converter.limit') }}</p>
      <template v-if="mode === 'resize'">
        <label class="field">{{ t('tools.image-resizer.width') }}<input v-model.number="width" type="number" min="1" step="1" data-test-id="width"></label>
        <label class="field">{{ t('tools.image-resizer.height') }}<input v-model.number="height" type="number" min="1" step="1" :disabled="keepRatio" data-test-id="height"></label>
        <label class="field inline"><input v-model="keepRatio" type="checkbox">{{ t('tools.image-resizer.keepRatio') }}</label>
      </template>
      <template v-else>
        <label class="field">{{ t('tools.image-converter.format') }}<select v-model="format" data-test-id="format"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select></label>
        <label class="field">{{ t('tools.image-converter.quality') }}<input v-model.number="quality" type="number" min="0" max="1" step="0.05" :disabled="format === 'image/png'" data-test-id="quality"></label>
      </template>
      <div class="actions">
        <c-button data-test-id="sample" @click="sample">
          {{ t('tools.local.sample') }}
        </c-button>
        <c-button :disabled="!file || busy" data-test-id="convert" @click="convert">
          {{ busy ? t('tools.local.loading') : t('tools.local.convert') }}
        </c-button>
        <c-button data-test-id="reset" @click="reset">
          {{ t('tools.local.reset') }}
        </c-button>
        <c-button :disabled="!output" data-test-id="download" @click="download">
          {{ t('tools.local.download') }}
        </c-button>
      </div>
    </c-card>
    <p v-if="error" role="alert" data-test-id="tool-error">
      {{ error }}
    </p>
    <p data-test-id="area-content" aria-live="polite">
      {{ info }}
    </p>
    <img v-if="preview" :src="preview" :alt="t('tools.image-converter.preview')" data-test-id="image-preview">
  </div>
</template>

<style scoped>
.raster-tool { width: 100%; max-width: 760px; min-width: 0; }
.field { display: flex; flex-direction: column; gap: 6px; margin: 14px 0; }
.inline { flex-direction: row; align-items: center; }
input, select { padding: 8px; max-width: 100%; box-sizing: border-box; color: inherit; background: transparent; border: 1px solid #8888; border-radius: 4px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
img { max-width: 100%; max-height: 480px; object-fit: contain; }
[role=alert] { color: #c2410c; }
</style>
