import { createRouter, createWebHistory } from "vue-router";
import { allRoutes } from "@/router/routes";
import { useAuthStore } from "@/stores/_core/authStore";
import { useAccountStore } from "@/stores/_core/accountStore";
import { useLayoutStore } from "@/stores/_core/layoutStore";


import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, parent: "body" });

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach(async (routeTo, routeFrom, next) => {
  const accountStore = useAccountStore();
  const authStore = useAuthStore();
  const layoutStore = useLayoutStore();

  document.title = routeTo.name + " - " + layoutStore.title;

  if(routeTo.meta.breadcrumbs){
    document.title = routeTo.meta.breadcrumbs[routeTo.meta.breadcrumbs.length - 1].label + " - " + layoutStore.title;

  }


  // If this isn't an initial page load.
  if (routeTo.name) {
    // Start the route progress bar.
    NProgress.start();
  }

  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);

  // If auth isn't required for the route, just continue.
  if (routeTo.meta?.authRequired === undefined) return next(); // check if authRequired is set in routes or not, like errorPageRoutes,

  // If auth is required and the user is logged in...
  if (authStore.token) {
    if (!authRequired) return next({ path: '/' });  // navigate to default route if user is logged in & tries to access auth pages

    // current user loaded?
    if (accountStore.user == null) {
      await accountStore.getCurrentUser();
    }




    // check if role has access
    if (routeTo.meta.roles?.includes(accountStore.user.roleId) || !routeTo.meta.roles || routeTo.meta.roles?.length == 0) {
      return next();
    } else {
      return next({ path: "/error-401" }); // unauthorized
    }
  }

  // TODO: need to check condition if user is logged in and tries to do to the login page
  if (!routeTo.meta.authRequired) return next();

  // If auth is required and the user is NOT currently logged in, redirect to login.
  // Pass the original route to the login component
  return next({ path: "/login", query: { redirectFrom: routeTo.fullPath } });
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
