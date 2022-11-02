import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import EP from "element-plus";

import "./registerApp";

const app = createApp(App);

app.use(EP);
app.use(router);
app.use(store);
app.mount("#app");
