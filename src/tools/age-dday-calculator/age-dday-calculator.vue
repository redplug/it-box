<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  addDays,
  businessDaysBetween,
  dayCount,
  daysBetween,
  daysSinceBirth,
  daysUntilNextBirthday,
  dday,
  internationalAge,
  localDateString,
  weekdayIndex,
  weeksAndDays,
  yearAge,
} from './age-dday-calculator.models';
import { useLocalResult } from '@/tools/_shared/use-local-result';

const { t } = useI18n();
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function startOfToday(): number {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function toDate(value: number | null): string | undefined {
  return value === null ? undefined : localDateString(new Date(value));
}

function weekdayKey(date: string): string {
  return `tools.age-dday-calculator.weekdays.${WEEKDAY_KEYS[weekdayIndex(date)]}`;
}

// 만 나이
const birth = ref<number | null>(null);
const ageReference = ref<number | null>(startOfToday());
const { result: ageResult, error: ageError } = useLocalResult(() => {
  const birthDate = toDate(birth.value);
  const reference = toDate(ageReference.value);
  if (!birthDate || !reference) {
    return undefined;
  }
  return {
    international: internationalAge(birthDate, reference),
    korean: yearAge(birthDate, reference),
    traditional: yearAge(birthDate, reference) + 1,
    untilBirthday: daysUntilNextBirthday(birthDate, reference),
    sinceBirth: daysSinceBirth(birthDate, reference),
  };
});

// D-day
const target = ref<number | null>(null);
const ddayReference = ref<number | null>(startOfToday());
const { result: ddayResult, error: ddayError } = useLocalResult(() => {
  const targetDate = toDate(target.value);
  const reference = toDate(ddayReference.value);
  if (!targetDate || !reference) {
    return undefined;
  }
  const diff = daysBetween(reference, targetDate);
  return {
    label: dday(targetDate, reference),
    past: diff < 0,
    span: weeksAndDays(diff),
    businessDays: businessDaysBetween(reference, targetDate),
  };
});

// 날짜 더하기
const start = ref<number | null>(startOfToday());
const offset = ref<number | null>(100);
const { result: addResult, error: addError } = useLocalResult(() => {
  const startDate = toDate(start.value);
  if (!startDate || offset.value === null) {
    return undefined;
  }
  const date = addDays(startDate, offset.value);
  return { date, weekday: weekdayKey(date) };
});
const { result: nthResult, error: nthError } = useLocalResult(() => {
  const startDate = toDate(start.value);
  if (!startDate || offset.value === null) {
    return undefined;
  }
  const date = dayCount(startDate, offset.value);
  return { date, weekday: weekdayKey(date) };
});
</script>

<template>
  <div>
    <c-card :title="t('tools.age-dday-calculator.ageTitle')" mb-4>
      <div flex flex-col gap-2 md:flex-row>
        <n-form-item :label="t('tools.age-dday-calculator.birthDate')" flex-1>
          <n-date-picker v-model:value="birth" type="date" clearable :placeholder="t('tools.age-dday-calculator.selectDate')" />
        </n-form-item>
        <n-form-item :label="t('tools.age-dday-calculator.referenceDate')" flex-1>
          <n-date-picker v-model:value="ageReference" type="date" />
        </n-form-item>
      </div>
      <n-alert v-if="ageError" type="error">
        {{ ageError }}
      </n-alert>
      <n-table v-else-if="ageResult" :single-line="false">
        <tbody>
          <tr>
            <th>{{ t('tools.age-dday-calculator.internationalAge') }}</th>
            <td>{{ t('tools.age-dday-calculator.years', { n: ageResult.international }) }}</td>
          </tr>
          <tr>
            <th>{{ t('tools.age-dday-calculator.koreanAge') }}</th>
            <td>{{ t('tools.age-dday-calculator.years', { n: ageResult.korean }) }}</td>
          </tr>
          <tr>
            <th>{{ t('tools.age-dday-calculator.traditionalAge') }}</th>
            <td>{{ t('tools.age-dday-calculator.years', { n: ageResult.traditional }) }}</td>
          </tr>
          <tr>
            <th>{{ t('tools.age-dday-calculator.untilBirthday') }}</th>
            <td>{{ t('tools.age-dday-calculator.days', { n: ageResult.untilBirthday }) }}</td>
          </tr>
          <tr>
            <th>{{ t('tools.age-dday-calculator.sinceBirth') }}</th>
            <td>{{ t('tools.age-dday-calculator.dayNumber', { n: ageResult.sinceBirth }) }}</td>
          </tr>
        </tbody>
      </n-table>
    </c-card>

    <c-card :title="t('tools.age-dday-calculator.ddayTitle')" mb-4>
      <div flex flex-col gap-2 md:flex-row>
        <n-form-item :label="t('tools.age-dday-calculator.targetDate')" flex-1>
          <n-date-picker v-model:value="target" type="date" clearable :placeholder="t('tools.age-dday-calculator.selectDate')" />
        </n-form-item>
        <n-form-item :label="t('tools.age-dday-calculator.referenceDate')" flex-1>
          <n-date-picker v-model:value="ddayReference" type="date" />
        </n-form-item>
      </div>
      <n-alert v-if="ddayError" type="error">
        {{ ddayError }}
      </n-alert>
      <div v-else-if="ddayResult" class="result-block">
        <div class="dday-label">
          {{ ddayResult.label }}
        </div>
        <n-table :single-line="false">
          <tbody>
            <tr>
              <th>{{ ddayResult.past ? t('tools.age-dday-calculator.elapsed') : t('tools.age-dday-calculator.remaining') }}</th>
              <td>{{ t('tools.age-dday-calculator.weeksDays', { weeks: ddayResult.span.weeks, days: ddayResult.span.days }) }}</td>
            </tr>
            <tr>
              <th>{{ t('tools.age-dday-calculator.businessDays') }}</th>
              <td>{{ t('tools.age-dday-calculator.days', { n: ddayResult.businessDays }) }}</td>
            </tr>
          </tbody>
        </n-table>
        <p class="note">
          {{ t('tools.age-dday-calculator.businessDaysNote') }}
        </p>
      </div>
    </c-card>

    <c-card :title="t('tools.age-dday-calculator.addTitle')">
      <div flex flex-col gap-2 md:flex-row>
        <n-form-item :label="t('tools.age-dday-calculator.startDate')" flex-1>
          <n-date-picker v-model:value="start" type="date" clearable :placeholder="t('tools.age-dday-calculator.selectDate')" />
        </n-form-item>
        <n-form-item :label="t('tools.age-dday-calculator.dayOffset')" flex-1>
          <n-input-number v-model:value="offset" :precision="0" />
        </n-form-item>
      </div>
      <n-table :single-line="false">
        <tbody>
          <tr>
            <th>{{ t('tools.age-dday-calculator.addResult') }}</th>
            <td>
              <n-alert v-if="addError" type="error">
                {{ addError }}
              </n-alert>
              <template v-else-if="addResult">
                {{ addResult.date }} ({{ t(addResult.weekday) }})
              </template>
            </td>
          </tr>
          <tr>
            <th>{{ t('tools.age-dday-calculator.nthDay') }}</th>
            <td>
              <n-alert v-if="nthError" type="error">
                {{ nthError }}
              </n-alert>
              <template v-else-if="nthResult">
                {{ nthResult.date }} ({{ t(nthResult.weekday) }})
              </template>
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>

<style scoped>
.n-date-picker,
.n-input-number {
  width: 100%;
}
.result-block {
  margin-top: 12px;
  overflow-wrap: anywhere;
}
.dday-label {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.note {
  opacity: 0.7;
  font-size: 0.875rem;
}
</style>
