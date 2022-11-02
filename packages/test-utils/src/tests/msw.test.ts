import { test } from "vitest";
import axios from "axios";
import { registerRest } from "../msw/server";

test("basic usage", async () => {
  const res = await axios({
    method: "post",
    url: "http://localhost:8080/api_admin/data_screen/distribution",
  });
  console.log(res.data);
});

test("registerRest", async () => {
  const testData = {
    status: 1,
    message: "",
    data: {
      count: 1,
    },
  };
  registerRest("http://localhost:8080/api_admin/data_screen/distribution", testData);
  const res = await axios({
    method: "post",
    url: "http://localhost:8080/api_admin/data_screen/distribution",
  });

  expect(res.data).toEqual(testData);
});
