import type { GlobalStateType } from "./internal/global-state";
import { globalState } from "./internal/global-state";

type DefineAdaptor = (adaptorRegister: {
  registerNotificationAdaptor: GlobalStateType["registerNotificationAdaptor"];
  registerRouteAdaptor: GlobalStateType["registerRouteAdaptor"];
}) => void;

export const defineRootContext = (name: string, define: DefineAdaptor) => {
  if (globalState.contextName !== "default") {
    console.warn(
      `Only one RootContext can be registered in the application. You has register ${globalState.contextName} RootContext`,
    );
    return;
  }

  globalState.registerNamespace(name);

  define({
    registerNotificationAdaptor: globalState.registerNotificationAdaptor,
    registerRouteAdaptor: globalState.registerRouteAdaptor,
  });
};
