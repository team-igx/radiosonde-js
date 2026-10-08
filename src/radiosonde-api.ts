import { ModelState, ModelStatistics, ProviderStatistics, RadiosondeResponse, RawSimplifiedStatistics, RawStatisticsLog, SimplifiedStatistics, StatisticsLog } from "./types.js";

export interface StatisticsOptions {
  /**
   * Statistics max limit. Max at 1024.
   */
  limit: number;
}
const BASE_API_URL = "https://rs.igx.kr/api/v2";

export class RadiosondeApi {
  /**
   * Returns the list of models supported by IGX Radiosonde service.
   * @returns IGX Radiosonde supported model list
   */
  static async listModels(): Promise<string[]> {
    const result = await fetch(`${BASE_API_URL}/models`);
    if (result.ok) {
      const data = (await result.json()) as RadiosondeResponse<string[]>;
      if (!data.success) throw new Error(`Radiosonde request failed (${data.message})`);
      return data.data;
    }
    throw new Error(`HTTP request failed (${result.status})`);
  }

  /**
   * Get model statistics data from IGX Radiosonde server.
   * Returned data is identical to the data used by the frontend of IGX Radiosonde service panel.
   * @returns Model statistics
   */
  static async statistics(): Promise<Map<string, ProviderStatistics<StatisticsLog>>> {
    const result = await fetch(`${BASE_API_URL}/statistics`);
    if (result.ok) {
      const data = (await result.json()) as RadiosondeResponse<ProviderStatistics<RawStatisticsLog>[]>;
      if (!data.success) throw new Error(`Radiosonde request failed (${data.message})`);
      const map = new Map<string, ProviderStatistics<StatisticsLog>>();
      for (const log of data.data) {
        map.set(log.provider, {
          provider: log.provider,
          models: log.models.map((it) => {
            return {
              model: it.model,
              display: it.display,
              statistics: it.statistics.map((logElement) => {
                return {
                  time: new Date(logElement.time),
                  latency: logElement.latency,
                  tps: logElement.tps,
                  failure: logElement.failure,
                } satisfies StatisticsLog;
              }),
            } satisfies ModelStatistics<StatisticsLog>;
          }),
        });
      }
      return map;
    }
    throw new Error(`HTTP request failed (${result.status})`);
  }

  /**
   * Get model statistics data from IGX Radiosonde server.
   * Returned data is identical to the data used by the frontend of IGX Radiosonde service panel.
   * @param model Model name to get statistics
   * @param options Request option.
   * @returns Statistics of selected model
   */
  static async statisticsOf(model: string, options: StatisticsOptions = { limit: 512 }): Promise<StatisticsLog[]> {
    const result = await fetch(`${BASE_API_URL}/statistics/${model}?limit=${options.limit}`);
    if (result.ok) {
      const data = (await result.json()) as RadiosondeResponse<RawStatisticsLog[]>;
      if (!data.success) throw new Error(`Radiosonde request failed (${data.message})`);
      return data.data.map((it) => {
        return { time: new Date(it.time), latency: it.latency, tps: it.tps, failure: it.failure };
      });
    }
    throw new Error(`HTTP request failed (${result.status})`);
  }

  /**
   * Get 15-minute compressed statistics log.
   * Note that score value and model state is not precise value - Just computed from prescribed formula.
   * @param model Model name to get statistics
   * @returns Compressed simple statistics of selected model
   */
  static async simpleStatisticsOf(model: string): Promise<SimplifiedStatistics> {
    const result = await fetch(`${BASE_API_URL}/simple/${model}`);
    if (result.ok) {
      const data = (await result.json()) as RadiosondeResponse<RawSimplifiedStatistics>;
      if (!data.success) throw new Error(`Radiosonde request failed (${data.message})`);
      return {
        status: ModelState[data.data.status],
        measuredAt: new Date(data.data.measuredAt),
        latency: data.data.latency,
        tps: data.data.tps,
        score: data.data.score,
        failureCount: data.data.failureCount,
      };
    }
    throw new Error(`HTTP request failed (${result.status})`);
  }

  /**
   * Get 15-minute compressed statistics log of models.
   * Note that score value and model state is not precise value - Just computed from prescribed formula.
   * @param models Model names to get statistics (Max 20)
   * @returns Bulk result of Compressed simple statistics of selected model
   */
  static async bulkSimpleStatisticsOf(models: string[]): Promise<Map<string, SimplifiedStatistics>> {
    const result = await fetch(`${BASE_API_URL}/simple/bulk?models=${models.join(",")}`);
    if (result.ok) {
      const data = (await result.json()) as RadiosondeResponse<Record<string, RawSimplifiedStatistics>>;
      if (!data.success) throw new Error(`Radiosonde request failed (${data.message})`);
      const map = new Map<string, SimplifiedStatistics>();
      for (const model of models) {
        if (data.data[model]) {
          const statistics = data.data[model];
          map.set(model, {
            status: ModelState[statistics.status],
            measuredAt: new Date(statistics.measuredAt),
            latency: statistics.latency,
            tps: statistics.tps,
            score: statistics.score,
            failureCount: statistics.failureCount,
          });
        }
      }
      return map;
    }
    throw new Error(`HTTP request failed (${result.status})`);
  }
}
