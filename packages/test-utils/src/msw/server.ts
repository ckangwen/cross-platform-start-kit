import type { RestHandler } from "msw";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { parse as queryStringParse } from "qs";
import SwaggerParser from "@apidevtools/swagger-parser";
import { afterAll, afterEach, beforeAll } from "vitest";
import type { Swagger } from "./swagger.type";
import { getPropertyValue } from "./swagger";

class MSWServer {
  server: ReturnType<typeof setupServer> | null = null;
  baseUrl = "";

  startServer = async (swaggerPath: string, baseUrl: string) => {
    this.baseUrl = baseUrl;
    if (swaggerPath) {
      const parser = new SwaggerParser();
      const api = (await parser.dereference(swaggerPath)) as Swagger;

      if (api) {
        const { paths = {} } = api;

        const handlers: RestHandler[] = [];
        Object.keys(paths).map((endpointPath) => {
          const responses = paths[endpointPath].post?.responses;

          if (responses) {
            handlers.push(
              rest.all(`${baseUrl}${endpointPath}`, (req, res, ctx) => {
                return res(ctx.json(getPropertyValue(responses["200"].schema)));
              }),
            );
          }
        });

        this.server = setupServer(...handlers);
      }
    } else {
      this.server = setupServer();
    }

    if (!this.server) {
      return;
    }

    beforeAll(() => {
      this.server!.listen();
    });

    afterEach(() => {
      this.server!.resetHandlers();
    });

    afterAll(() => {
      this.server!.close();
    });
  };

  registerRest = (
    url: string,
    response:
      | any
      | ((params: Record<string, any>, status: { error: boolean; fail: boolean }) => any),
  ) => {
    if (!this.server) {
      console.warn("you should start msw server first.");
      return;
    }

    const requestUrl = url.startsWith(this.baseUrl) ? url : this.baseUrl + url;

    this.server.use(
      rest.all(requestUrl, async (req, res, ctx) => {
        const {
          error = false,
          fail = false,
          ...body
        } = queryStringParse(await req.text()) as Record<string, any>;

        const data = typeof response === "function" ? response(body, { error, fail }) : response;

        return res(ctx.status(error ? 500 : 200), ctx.json(data));
      }),
    );
  };
}

const { startServer, registerRest } = new MSWServer();

export { startServer, registerRest };
