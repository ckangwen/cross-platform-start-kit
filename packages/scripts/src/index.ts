#!/usr/bin/env node
import prompts from "prompts";
import minimist from "minimist";
import { red } from "kolorist";
import { resolve } from "path";
import { createModuleTemplate } from "./command/create-module";
const cwd = process.cwd();

const init = async () => {
  const argv = minimist(process.argv.slice(2), {});

  const action = argv._[0];
  if (action === "create") {
    const res = await prompts(
      [
        {
          name: "moduleName",
          type: "text",
          message: "Please input new module name",
        },
      ],
      {
        onCancel: () => {
          console.log(`${red("✖")} Operation cancelled`);
        },
      },
    );

    const name = res.moduleName.trim();
    const moduleDir = resolve(cwd, "src/modules", name);

    if (!name) {
      return;
    }
    createModuleTemplate({
      root: cwd,
      moduleName: name,
      moduleDir,
    });
  }
};

init().then(() => {
  //
});
