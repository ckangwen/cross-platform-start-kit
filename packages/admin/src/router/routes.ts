import HomeRoutes from "@/modules/home/routes";
import LoginRoutes from "@/modules/account/login/routes";

const routes = [...HomeRoutes, ...LoginRoutes];

export default routes;
