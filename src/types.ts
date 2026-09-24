export enum ModelState {
  OPERATIONAL = "OPERATIONAL",
  DEGRADED = "DEGRADED",
  IMPACTED = "IMPACTED",
  CRITICAL = "CRITICAL",
  UNSTABLE = "UNSTABLE",
  INACTIVE = "INACTIVE",
}

export type RadiosondeResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export type ProviderStatistics<T extends RawStatisticsLog | StatisticsLog> = {
  provider: string;
  models: ModelStatistics<T>[];
};

export type ModelStatistics<T extends RawStatisticsLog | StatisticsLog> = {
  model: string;
  display: string;
  statistics: T[];
};

export type RawStatisticsLog = {
  time: string;
  latency: number;
  tps: number;
  failure: number;
};

export type StatisticsLog = {
  time: Date;
  latency: number;
  tps: number;
  failure: number;
};

export type RawSimplifiedStatistics = {
  status: ModelState;
  measuredAt: Date;
  latency: number;
  tps: number;
  score: number;
  failureCount: number;
};


export type SimplifiedStatistics = {
  status: ModelState;
  measuredAt: Date;
  latency: number;
  tps: number;
  score: number;
  failureCount: number;
};
