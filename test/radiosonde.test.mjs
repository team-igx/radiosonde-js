// @ts-check

import test from "node:test";
import assert from "node:assert/strict";
import { RadiosondeApi } from "../dist/radiosonde-api.js";

test("Listing test", async () => {
  const result = await RadiosondeApi.listModels();
  assert.ok(result.length > 0);
});

test("Statistics test", async () => {
  const result = await RadiosondeApi.statistics();
  assert.ok(result.size > 0);
});

test("Listing + Model statistics test", async () => {
  const result = await RadiosondeApi.statisticsOf((await RadiosondeApi.listModels())[0]);
  assert.ok(result.length > 0);
});

test("Simple statistics test", async () => {
  await RadiosondeApi.simpleStatisticsOf((await RadiosondeApi.listModels())[0]);
});
