import type { RouteRecordRaw } from "vue-router";
import { HOME_PAGE } from "@/constants/index";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: HOME_PAGE,
    component: () => import("./home.vue"),
  },
];

export default routes;
