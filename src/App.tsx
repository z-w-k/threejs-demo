import { ConfigProvider } from "ant-design-vue";
export default defineComponent({
  render() {
    return (
      <ConfigProvider>
        <HelloWorld />
        <Demo1 />
      </ConfigProvider>
    );
  },
});
