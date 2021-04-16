<template>
  <a-layout style="height: 100%">
    <a-layout-header style="-webkit-app-region: drag;">
      <a-menu
        v-model:selectedKey="selectedKeys"
        mode="horizontal"
        theme="dark"
        :style="{ lineHeight: '64px',display:'inline-block' }"
      >
        <a-sub-menu>
          <template #title> 功能 </template>
          <a-menu-item key="features:1">查看所有</a-menu-item>
          <a-menu-item key="features:2">愿望单</a-menu-item>
          <a-menu-item key="features:3">上次制作</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <template #title> 关于 </template>
          <a-menu-item key="about:1">关于作者</a-menu-item>
          <a-menu-item key="about:2">反馈</a-menu-item>
          <a-menu-item key="about:3" disabled title="暂时买不起服务器了/(ㄒoㄒ)/~~">检查更新</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div style="float: right;width: 64px;color: white">
        <MinusOutlined @click="minimize" class="text-base mr-1.5 cursor-pointer" />
        <CloseOutlined @click="close" class="text-base cursor-pointer" />
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer style="text-align: center" class="border-t-2">
      powered by <a href="https://github.com/misakamaiyako">@misakamaiyako</a>
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts">
import { CloseOutlined, MinusOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    CloseOutlined,
    MinusOutlined,
  },
  setup() {
    return {
      selectedKeys: ref<string[]>(["features:1"]),
      minimize(){
        window.api.minimize()
      },
      close(){
        window.api.close()
      }
    };
  },
});
</script>
