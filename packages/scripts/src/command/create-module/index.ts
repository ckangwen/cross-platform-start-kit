import { existsSync, mkdirSync } from "fs";
import { copySync, writeFile } from "fs-extra";
import { resolve } from "path";
import { readJsonContent } from "../../utils/read-json-content";
const TEMPLATE_PATH = resolve(__dirname, "../.template/module-page");

interface CreateModuleContext {
  root: string;
  moduleName: string;
  moduleDir: string;
}

export const createModuleTemplate = (ctx: CreateModuleContext) => {
  const { moduleDir, moduleName, root } = ctx;

  if (existsSync(moduleDir)) {
    console.warn(`module ${moduleName} has exist.`);
    return;
  }

  mkdirSync(moduleDir, {
    recursive: true,
  });

  copySync(TEMPLATE_PATH, moduleDir);

  const tsconfigPath = resolve(root, "tsconfig.json");
  const contentValue = readJsonContent(tsconfigPath);

  if (contentValue) {
    const originConfigPaths = contentValue.compilerOptions.paths;
    contentValue.compilerOptions.paths = {
      ...originConfigPaths,
      [`~${moduleName}/*`]: [`./src/modules/${moduleName}/*`],
    };

    writeFile(tsconfigPath, JSON.stringify(contentValue, null, 2), {
      encoding: "utf-8",
    });
  }
};
