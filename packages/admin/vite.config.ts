import { resolve } from "path";
import type { AliasOptions } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";

const getAlias = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tsconfig = require(resolve(__dirname, "./tsconfig.json"));
  const aliasValue: AliasOptions = {
    "@": resolve(__dirname, "src"),
  };

  const paths = tsconfig?.compilerOptions?.paths;
  if (!paths) {
    return aliasValue;
  }

  Object.keys(paths).forEach((pathAlias) => {
    const aliasName = pathAlias.replace("/*", "");
    let aliasPath = paths[pathAlias]?.[0]?.replace("/*", "");
    if (aliasPath) {
      aliasPath = resolve(__dirname, aliasPath);
    }
    if (aliasName && aliasPath) {
      aliasValue[aliasName] = aliasPath;
    }
  });

  console.log(aliasValue);
  return aliasValue;
};

export default defineConfig({
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variable.scss";`,
      },
    },
  },
  resolve: {
    alias: getAlias(),
  },
  plugins: [
    vue(),
    vueJsx(),
    Unocss(),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer(),
  ],
});
