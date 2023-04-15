import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from "ant-design-vue";
import { RouterView } from "vue-router";
export default defineComponent({
  render() {
    return (
      <Layout class="w-[100vw] h-[100vh]">
        <LayoutHeader >Header</LayoutHeader>
        <LayoutContent><RouterView/></LayoutContent>
        <LayoutFooter>Footer</LayoutFooter>
      </Layout>
    );
  },
});
