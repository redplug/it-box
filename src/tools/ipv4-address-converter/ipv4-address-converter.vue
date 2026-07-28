<script setup lang="ts">
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { useValidation } from '@/composable/validation';

const rawIpAddress = useStorage('ipv4-converter:ip', '192.168.1.1');

const convertedSections = computed(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: 'Decimal: ',
      value: String(ipInDecimal),
    },
    {
      label: 'Hexadecimal: ',
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: 'Binary: ',
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: 'Ipv6: ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: 'Ipv6 (short): ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
  ];
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
    rules: [{ message: '유효하지 않은 IPv4 주소입니다', validator: ip => isValidIpv4({ ip }) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" label="IPv4 주소:" placeholder="IPv4 주소를 입력하세요..." />

    <n-divider />

    <input-copyable
      v-for="{ label, value } of convertedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      placeholder="올바른 IPv4 주소를 입력하세요"
    />
  </div>
</template>
