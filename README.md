<p align="center">
  <img src="./images/logo.png" alt="IGX Radiosonde Logo">
</p>

# IGX :: Radiosonde API
[IGX Radiosonde](https://rs.igx.kr) 서비스의 TypeScript API 클라이언트입니다.

IGX Radiosonde에서 제공하는 모델 목록 및 통계 데이터를 TypeScript/JavaScript 환경에서 간단하게 조회할 수 있습니다.

## IGX Radiosonde
<b>[IGX Radiosonde](https://rs.igx.kr)</b>는 모델별 상태 및 통계 정보를 무료로 제공하는 비영리성 서비스입니다.

일반적인 외부 상태 정보에 의존하지 않고, 일정 주기로 직접 모델 상태를 확인하여 통계 데이터를 제공합니다.

---

## 설치

Node / NPM 기반 패키지는 NPM Repository를 통해 설치해야 합니다.

```bash
npm install @team-igx/radiosonde-api
```

---

## 사용 방법

### 지원 모델 조회

IGX Radiosonde에서 현재 지원하는 모델 목록을 반환합니다.

```ts
import { RadiosondeApi } from "@team-igx/radiosonde-api";
// string[]
const models = await RadiosondeApi.listModels();
console.log(models);
```

---

### 전체 모델 통계 조회

IGX Radiosonde 서비스에서 모델 통계 데이터를 조회합니다.
해당 데이터는 IGX Radiosonde 서비스의 프론트 패널에서 사용되는 데이터와 동일합니다.

맵의 키는 제공자(Google, Anthropic..)로 사용됩니다. 

```ts
import { RadiosondeApi } from "@team-igx/radiosonde-api";
// Map<string, ProviderStatistics<StatisticsLog>>
const statistics = await RadiosondeApi.statistics();

for (const [provider, data] of statistics) {
  console.log(provider, data);
}
```
---

### 특정 모델 통계 조회

특정 모델의 통계 기록을 조회합니다.

최대 1024개의 로그를 가져올 수 있습니다. 하나의 로그는 이전 로그와 최소 5분 이상 떨어져 있습니다.

```ts
// Promise<StatisticsLog[]>
const statistics = await RadiosondeApi.statisticsOf("gpt-6-sol", { limit: 512 });

console.log(statistics);
```

---

### 간략 통계 조회

특정 모델의 압축된 통계 정보를 조회합니다.

반환되는 정보는 IGX Radiosonde 프론트엔드 패널에서 제공되는 데이터와 동일하며, 15분 통계입니다.

```ts
const statistics =await RadiosondeApi.simpleStatisticsOf("RS41");

console.log(statistics);
```

---

## 오류 처리

API 요청이 실패하는 경우 오류가 발생합니다.

모든 HTTP 혹은 서버 요청은 `Error`로 throw되니 모든 API에 오류 핸들링을 작성하는 것이 권장됩니다.


```ts
try {
  const models = await RadiosondeApi.listModels();

  console.log(models);
} catch (error) {
  console.error(error);
}
```
---

## License

IGX Radiosonde API는 MIT 라이선스로 배포됩니다.