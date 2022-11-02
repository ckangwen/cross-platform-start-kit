import type { RouteRecordRaw } from "vue-router";
import { LOGIN_PAGE } from "@/constants/index";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: LOGIN_PAGE,
    component: () => import("./login.vue"),
  },
];

export default routes;
