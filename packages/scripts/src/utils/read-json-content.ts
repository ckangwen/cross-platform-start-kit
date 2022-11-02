import { readFileSync, existsSync } from "fs";
import { red } from "kolorist";

export const readJsonContent = (filePath: string) => {
  if (!existsSync(filePath)) {
    console.log(red(`${filePath} not found.`));
    return null;
  }

  const fileContent = readFileSync(filePath, {
    encoding: "utf-8",
  });

  try {
    return JSON.parse(fileContent.trim());
  } catch (error) {
    console.log(red(`parse file  error with ${(error as any).message}`));
    return null;
  }
};
