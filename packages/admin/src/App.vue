<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>
<script>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default {
  name: "App",
  components: {
    ElConfigProvider,
  },
  setup() {
    //
    return {
      locale: zhCn,
    };
  },
};
</script>
<style></style>
