import { faker } from "@faker-js/faker";
import SwaggerParser from "@apidevtools/swagger-parser";
import type {
  Swagger,
  SwaggerHttpEndpoint,
  SwaggerSchema,
  SwaggerPropertyDefinition,
} from "./swagger.type";

interface SwaggerOptions {
  defaultMethod: "get" | "post" | "put" | "delete";
}

const defaultSwaggerOptions: SwaggerOptions = {
  defaultMethod: "post",
};

const fakerDataGenerator = {
  string: (_propertyDefinition: SwaggerPropertyDefinition) => {
    return faker.random.word();
  },
  integer: (_propertyDefinition: SwaggerPropertyDefinition) => {
    return faker.random.numeric();
  },
};

export const getPropertyValue = (schema: SwaggerPropertyDefinition): any => {
  const {
    type = "string",
    default: defaultValue,
    properties,
    minLength = 1,
    maxLength = 10,
    items,
  } = schema;

  if (defaultValue !== undefined && defaultValue !== null) return defaultValue;

  if (type === "string") {
    return fakerDataGenerator.string(schema);
  }

  if (type === "integer" || type === "number") {
    return parseInt(fakerDataGenerator.integer(schema), 10);
  }

  if (type === "object") {
    if (!properties) return {};
    return Object.keys(properties).reduce((acc, k) => {
      acc[k] = getPropertyValue(properties[k]);
      return acc;
    }, {} as Record<string, any>);
  }

  if (type === "array") {
    if (!items) return [];
    return Array.from({
      length: faker.datatype.number({
        min: minLength,
        max: maxLength,
      }),
    }).map((_) => {
      return getPropertyValue(items || {});
    });
  }

  return "";
};

export const parse = async (
  inputPath: string,
  url: string,
  swaggerOption: Partial<SwaggerOptions> = {},
) => {
  const parser = new SwaggerParser();
  const api = (await parser.dereference(inputPath)) as Swagger;

  if (!api) return null;

  const swaggerOptionWithDefaults = Object.assign(defaultSwaggerOptions, swaggerOption);

  const { paths = {} } = api;
  const { defaultMethod } = swaggerOptionWithDefaults;

  if (!paths[url]) {
    console.log(`${url} not exist.`);
    return null;
  }

  if (!paths[url][defaultMethod]) {
    console.log(`${url} not exist ${defaultMethod} method`);
    return null;
  }

  const { responses } = paths[url][defaultMethod] as SwaggerHttpEndpoint;

  return getPropertyValue(responses["200"].schema as SwaggerSchema);
};
