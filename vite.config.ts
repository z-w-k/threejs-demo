import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({enableObjectSlots:true}),
    AutoImport({
      imports: ["vue"],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts:'src/auto-imports.d.ts',
    }),
    Components({
      include: [
        /\.tsx$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      extensions: ['vue', 'tsx'],
      dirs:['src/components/'],
      dts: 'src/components.d.ts',
      resolvers: [AntDesignVueResolver(),IconsResolver()],
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
});
