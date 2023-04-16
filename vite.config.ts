import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsx({ enableObjectSlots: true }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        {
          'vue-router': [
            'useLink',
            'useRoute',
            'useRouter',
            'onBeforeRouteLeave',
            'onBeforeRouteUpdate',
            'createRouter',
            'createWebHashHistory',
          ],
        },
        'pinia',
      ],
    }),
    Components({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['tsx'],
      // dirs:['src/components/'],
      resolvers: [IconsResolver()],
      dts: 'src/components.d.ts',
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
})
