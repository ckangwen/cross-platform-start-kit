/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line init-declarations
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
