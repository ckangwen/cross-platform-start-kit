import { describe, expect, test } from "vitest";
import { getPropertyValue, parse } from "./swagger";
import { resolve } from "path";
const SWAGGER_PATH = resolve(__dirname, "../../swaggerApi.json");

describe("getPropertyValue", () => {
  test("string without default", () => {
    const stringProperty = {
      type: "string",
    };

    expect(typeof getPropertyValue(stringProperty)).toBe("string");
  });

  test("string with default", () => {
    const stringProperty = {
      type: "string",
      default: "获取成功",
      "x-go-name": "Message",
    };

    expect(getPropertyValue(stringProperty)).toBe("获取成功");
  });

  test("integer without default", () => {
    const integerProperty = {
      type: "integer",
    };

    expect(typeof getPropertyValue(integerProperty)).toBe("number");
  });

  test("integer with default", () => {
    const integerProperty = {
      type: "integer",
      default: 0,
    };

    expect(getPropertyValue(integerProperty)).toBe(0);
  });

  test("object with default", () => {
    const objectProperty = {
      type: "object",
      properties: {
        foo: {
          type: "string",
          default: 100,
        },
        bar: {
          type: "integer",
          default: "bar",
        },
      },
    };

    expect(getPropertyValue(objectProperty)).toEqual({
      foo: 100,
      bar: "bar",
    });
  });

  test("object without default", () => {
    const objectProperty = {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
        bar: {
          type: "integer",
        },
      },
    };

    const val = getPropertyValue(objectProperty);
    expect(typeof val.foo).toBe("string");
    expect(typeof val.bar).toBe("number");
  });

  test("array with default", () => {
    const arrayProperty = {
      type: "array",
      items: {
        type: "integer",
      },
    };

    const val = getPropertyValue(arrayProperty);
    expect(val.length).toBeLessThanOrEqual(10);
  });

  test("array without default", () => {
    const arrayProperty = {
      type: "array",
      items: {
        type: "integer",
        default: 100,
      },
    };

    const val = getPropertyValue(arrayProperty);
    expect(val.every((item: number) => item === 100)).toBe(true);
  });
});

describe.only("parse", () => {
  test("basic usage", async () => {
    const data = await parse(SWAGGER_PATH, "/api_admin/data_screen/distribution");
    console.log(JSON.stringify(data, null, 2));
  });
});
