---
title: JSON 파싱 오류를 빠르게 찾는 방법
description: JSON.parse 오류 메시지의 위치를 읽는 법부터 끝 쉼표, 작은따옴표, NaN, 큰 정수, 중복 키, BOM까지 원인별로 정리하고, JSON5와의 차이와 로그 데이터 마스킹을 설명합니다.
date: 2026-11-10
tools: ['/json-prettify', '/json-minify', '/json-diff', '/json-pointer']
---

## 오류 메시지의 위치부터 읽습니다

`JSON.parse`는 입력이 올바르지 않으면 `SyntaxError`를 던집니다. 메시지에는 파서가 더 이상 진행하지 못한 위치가 들어 있는 경우가 많습니다. 다음은 Node.js v26.3.1에서 실행한 결과입니다.

```js
JSON.parse('{"a":1,}');
// SyntaxError: Expected double-quoted property name in JSON at position 7 (line 1 column 8)
```

위치 7은 쉼표(인덱스 6) 바로 다음의 `}`입니다. 파서는 쉼표 뒤에 키가 와야 한다고 기대했는데 닫는 괄호를 만났다는 뜻입니다. 그래서 위치 숫자가 가리키는 문자보다 한두 칸 앞을 보는 습관이 중요합니다.

여러 줄로 된 JSON에서는 다음 파일이 같은 오류를 냅니다.

```json
{
  "a": 1,
}
```

Node.js는 `Expected double-quoted property name in JSON at position 12 (line 3 column 1)`라고 알려 줍니다. 위치는 3번째 줄의 `}`를 가리키지만, 실제 원인은 2번째 줄 끝의 쉼표입니다. 위치 숫자를 줄과 열로 바꾸고 싶다면 다음 함수를 쓸 수 있습니다. 줄과 열을 함께 보여 주지 않는 런타임에서 유용합니다.

```js
function locate(src, pos) {
  const before = src.slice(0, pos);
  return { line: before.split('\n').length, column: pos - before.lastIndexOf('\n') };
}

locate('{\n  "a": 1,\n}', 12); // { line: 3, column: 1 }
```

메시지 문구와 위치 표기는 엔진과 버전마다 다릅니다. 이 글의 메시지는 모두 Node.js v26.3.1에서 실제로 출력된 것만 옮겼습니다. 브라우저나 다른 Node.js 버전에서는 같은 입력에 다른 문구가 나올 수 있으니, 문구보다는 위치 숫자와 입력 구조를 기준으로 판단하세요. 메시지가 입력 전체를 잘라 보여 주는 경우도 있는데, 이때는 `...` 앞뒤의 문자를 보면 됩니다.

## 끝 쉼표와 작은따옴표

JSON은 마지막 항목 뒤에 쉼표를 허용하지 않습니다. 배열도 마찬가지입니다.

```js
JSON.parse('[1,2,]');
// SyntaxError: Unexpected token ']', "[1,2,]" is not valid JSON
```

JSON 문자열은 큰따옴표만 사용합니다. 작은따옴표는 JavaScript 문자열 문법이므로 JSON에서는 실패합니다.

```js
JSON.parse("{'a':1}");
// SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
```

작은따옴표를 큰따옴표로 일괄 치환하면 `"it's"` 같은 값의 아포스트로피까지 깨집니다. 파일을 손으로 고칠 때는 키와 값을 하나씩 확인하는 편이 안전합니다. 생성 코드라면 `JSON.stringify`로 다시 만드는 것이 가장 확실합니다.

## 따옴표 없는 키와 주석

키에 따옴표가 없으면 작은따옴표와 같은 위치에서 같은 메시지가 나옵니다.

```js
JSON.parse('{a:1}');
// SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
```

주석도 JSON에는 없습니다. 설정 파일에서 복사한 내용이라면 `//` 주석이 섞여 있을 가능성이 큽니다.

```js
JSON.parse('{"a":1 // 설명\n}');
// SyntaxError: Expected ',' or '}' after property value in JSON at position 7 (line 1 column 8)
```

위치 7은 `1` 뒤 공백 다음의 `/`입니다. 주석을 지우고 나면 대부분 해결됩니다.

## 이스케이프: 줄바꿈과 역슬래시

문자열 안에 실제 줄바꿈 문자가 들어가면 JSON 위반입니다. 로그나 메모에서 여러 줄을 그대로 복사했을 때 자주 생깁니다.

```js
JSON.parse('{"a":"x\ny"}');
// SyntaxError: Bad control character in string literal in JSON at position 7 (line 1 column 8)
```

줄바꿈은 `\n`으로 바꿔야 합니다. 역슬래시도 주의해야 합니다. Windows 경로를 그대로 넣으면 `\u`가 유니코드 이스케이프로 해석됩니다.

```js
JSON.parse('{"p":"C:\\users"}');
// SyntaxError: Bad Unicode escape in JSON at position 10 (line 1 column 11)

JSON.parse('{"p":"\\x41"}');
// SyntaxError: Bad escaped character in JSON at position 7 (line 1 column 8)
```

더 위험한 경우는 오류가 나지 않는 경우입니다. `\t`는 유효한 이스케이프이므로 `"C:\temp"`는 파싱에 성공합니다. 다만 값은 `C:`, 탭 문자, `emp`로 바뀝니다. 길이는 6이고, 세 번째 문자의 코드는 9입니다. 파싱이 성공했다고 값이 맞는 것은 아닙니다. 경로나 정규식을 JSON에 넣을 때는 역슬래시를 `\\`로 한 번 더 써야 합니다.

## NaN, undefined, Infinity

JavaScript 값을 손으로 옮기다 보면 `NaN`, `undefined`, `Infinity`가 그대로 들어가기 쉽습니다. 세 값 모두 JSON에 없습니다.

```js
JSON.parse('{"a":NaN}');
// SyntaxError: Unexpected token 'N', "{"a":NaN}" is not valid JSON

JSON.parse('{"a":undefined}');
// SyntaxError: Unexpected token 'u', "{"a":undefined}" is not valid JSON

JSON.parse('{"a":Infinity}');
// SyntaxError: Unexpected token 'I', "{"a":Infinity}" is not valid JSON
```

이 값을 만든 코드 쪽도 확인해야 합니다. `JSON.stringify({ a: NaN, b: undefined, c: Infinity })`의 결과는 `{"a":null,"c":null}`입니다. `NaN`과 `Infinity`는 `null`이 되고, `undefined` 속성은 아예 사라집니다. 에러가 없어서 데이터가 조용히 바뀌는 대표적인 경로입니다.

## 큰 정수와 2^53 정밀도

JavaScript의 `Number`는 안전하게 표현할 수 있는 정수가 `Number.MAX_SAFE_INTEGER`인 9007199254740991까지입니다. 그 이상의 정수는 가까운 값으로 반올림됩니다.

```js
JSON.parse('{"id":9007199254740993}').id;
// 9007199254740992

JSON.stringify(JSON.parse('{"id":9007199254740993}'));
// {"id":9007199254740992}
```

오류는 나지 않지만 ID 값이 바뀝니다. 64비트 정수 ID나 금액을 최소 단위 정수로 저장한 값에서 특히 문제가 됩니다. 가장 확실한 해결은 서버가 이런 값을 문자열로 내려 주는 것입니다. 이 값을 [JSON 포맷터](/json-prettify)나 [JSON 최소화](/json-minify)에 넣으면 정리된 결과에도 같은 반올림이 적용됩니다. 두 도구 모두 입력을 JavaScript 값으로 읽은 뒤 다시 쓰기 때문입니다.

## 중복 키

같은 객체 안에 키가 두 번 나오면 오류가 없습니다. 마지막 값이 이깁니다.

```js
JSON.parse('{"a":1,"a":2}');
// { a: 2 }
```

JSON 명세(RFC 8259)는 객체의 이름이 고유해야 한다고 권고만 할 뿐 강제하지 않습니다. 그래서 파서들은 경고를 주지 않으며, 이 사이트의 JSON5 기반 도구들도 같은 방식으로 마지막 값만 남깁니다. 설정 파일이 여러 번 병합된 뒤 생긴 값이라면 `grep`으로 같은 키가 여러 번 나오는지 확인하세요. 단순한 `grep`으로는 중첩된 객체 안의 중복을 놓치기 쉬우므로, 긴 파일이라면 중복 키를 검사하는 린터나 스크립트를 따로 쓰는 것이 낫습니다.

## BOM과 보이지 않는 문자

Windows 메모장이나 일부 편집기로 저장한 파일은 맨 앞에 BOM(`\uFEFF`)이 붙을 수 있습니다. 화면에서는 보이지 않지만 `JSON.parse`는 이를 허용하지 않습니다.

```js
JSON.parse('\uFEFF{"a":1}');
// SyntaxError: Unexpected token '﻿', "﻿{"a":1}" is not valid JSON
```

메시지에서 토큰이 공백처럼 보이면 BOM을 의심하세요. 읽은 텍스트에서 앞부분만 제거하면 됩니다.

```js
const text = '\uFEFF{"a":1}';
JSON.parse(text.replace(/^\uFEFF/, '')); // { a: 1 }
```

## JSON, JSON5, JS 객체 리터럴의 차이

세 형식은 비슷해 보이지만 허용하는 문법이 다릅니다. 엄격한 JSON은 큰따옴표 문자열, 따옴표가 있는 키, 쉼표 없는 마지막 항목, 주석 없음, `NaN`과 `undefined` 없음을 요구합니다. JSON5는 사람이 손으로 쓰기 쉽도록 몇 가지를 허용합니다. 이 사이트의 [JSON 포맷터](/json-prettify), [JSON 최소화](/json-minify), [JSON 비교 도구](/json-diff)는 입력을 JSON5로 읽습니다. 그래서 다음 입력도 정상으로 처리됩니다.

```js
const JSON5 = require('json5');

JSON5.parse("{'a':1, b:[1,2,], // 주석\n c:0x10}");
// { a: 1, b: [ 1, 2 ], c: 16 }
```

JSON5에서도 `undefined`는 오류입니다. 메시지 형식은 `JSON5: invalid character 'u' at 1:6`처럼 다릅니다. JSON5는 `NaN`과 `Infinity`를 읽지만, 다시 JSON 문자열로 만들면 `null`이 됩니다. 이 점은 위에서 본 것과 같습니다.

반면 [JSON Pointer 조회](/json-pointer)는 표준 `JSON.parse`를 사용합니다. 그래서 같은 텍스트라도 포맷터에서는 통과하고 포인터 조회에서는 실패할 수 있습니다. 이 경우 입력의 문법을 먼저 JSON으로 바로잡아야 합니다.

## 두 JSON 비교하기

두 응답의 차이를 찾을 때는 텍스트 비교보다 값 비교가 낫습니다. 키 순서나 들여쓰기만 다른 두 문서를 텍스트 비교 도구에 넣으면 전부 다르다고 나오기 때문입니다. [JSON 비교 도구](/json-diff)는 파싱한 값을 키 단위로 비교합니다. 그래서 키 순서만 바뀐 경우는 변경으로 보지 않습니다. 같은 이유로 `1`과 `1.0`도 같은 값으로 처리됩니다. JavaScript에서 두 숫자는 같기 때문입니다.

이 도구는 양쪽이 모두 유효할 때만 결과를 보여 줍니다. 한쪽에 오류가 있으면 결과 영역이 비고, 입력란 아래에 "JSON 형식이 유효하지 않습니다"라는 검증 메시지가 나옵니다. 어느 쪽인지 확인하려면 입력란의 메시지를 보면 됩니다.

텍스트 차이가 필요하다면 먼저 두 문서를 같은 형식으로 정리하세요. [JSON 포맷터](/json-prettify)에서 키 정렬 옵션(Sort keys, 기본값 켜짐)을 켜고 같은 들여쓰기로 출력한 뒤 비교하면 줄 단위 차이가 의미 있는 값 차이만 남습니다. 다만 포맷터는 중복 키를 경고하지 않으므로, 중복 키는 이 단계에서도 사라집니다.

## 로그에서 복사한 JSON 마스킹

운영 로그에서 복사한 JSON에는 이메일, 전화번호, 토큰, 인증 헤더 값이 섞여 있는 경우가 많습니다. 질문이나 이슈에 붙이기 전에 반드시 지워야 합니다. 붙여 넣은 뒤에 지우는 방식은 충분하지 않습니다. 클립보드 기록, 화면 캡처, 채팅 기록에 남을 수 있기 때문입니다.

키 이름을 기준으로 값을 가리는 방법은 간단합니다. 파싱한 뒤 민감한 키의 값을 바꾸고 다시 출력하면 됩니다.

```js
const SENSITIVE = /^(password|token|authorization|email|phone)$/i;

function mask(value) {
  if (Array.isArray(value)) return value.map(mask);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SENSITIVE.test(k) ? '***' : mask(v)]),
    );
  }
  return value;
}

mask(JSON.parse('{"user":{"email":"kim@example.com"},"note":"ok"}'));
// { user: { email: '***' }, note: 'ok' }
```

이 방법에는 한계가 있습니다. 키 이름이 기준이므로 `"message": "문의: 010-1234-5678"`처럼 자유 텍스트 안의 개인정보는 잡지 못합니다. 마스킹한 결과도 한 번 훑어 보고, 남은 문자열에 사람 이름이나 번호가 없는지 확인하세요. 또한 파싱이 실패하는 로그는 먼저 위의 방법으로 문법을 고쳐야 마스킹 코드를 쓸 수 있습니다. 그 과정에서 원본을 고치지 말고 복사본에서 작업하세요.

## 점검 순서

오류가 났을 때는 다음 순서로 보면 대부분 빠르게 끝납니다.

1. 메시지의 위치 숫자를 줄과 열로 바꾸고, 그 바로 앞 문자를 확인합니다.
2. 쉼표, 작은따옴표, 주석, 따옴표 없는 키 순서로 문법을 확인합니다.
3. 문자열 안의 실제 줄바꿈과 역슬래시를 확인합니다.
4. 파일 맨 앞의 BOM과 `NaN`, `undefined`, `Infinity`를 확인합니다.
5. 값이 바뀌었을 가능성이 있는 큰 정수와 중복 키를 확인합니다.
6. 두 문서를 비교하기 전에 같은 형식으로 정리하고, 공유하기 전에 민감한 값을 가립니다.

문법이 맞아도 값이 틀릴 수 있습니다. 파싱 성공은 시작점일 뿐이므로, 결과를 기대값과 비교하는 단계까지 확인해야 합니다.
