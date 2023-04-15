import routes from "./routes";

const router= createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

