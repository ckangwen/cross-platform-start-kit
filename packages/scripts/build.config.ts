import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  rollup: {
    emitCJS: true,
  },
  failOnWarn: false,
});
