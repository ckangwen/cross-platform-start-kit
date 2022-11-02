import { globalState } from "../internal/global-state";

export const { showToast, showModal } = globalState.getApi("notification");
export const { navigateTo, replaceTo } = globalState.getApi("route");

export const { getRequest } = globalState;
