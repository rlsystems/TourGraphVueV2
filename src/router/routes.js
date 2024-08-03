const mainRoutes = [
  // products ---------------------------------------------------------------------------------------------------
  { 
    path: "/",
    redirect: "/products",
    meta: { authRequired: true },
  },
  {
    name: "products",
    path: "/products",
    component: () => import("@/pages/products/list-view/product-list.vue"),
    meta: { 
      authRequired: true,
      breadcrumbs: [
      {
        label: "Products"
      }]
    },
  },
  {
    name: "product-edit",
    path: "/products/:productId",
    component: () => import("@/pages/products/edit-view/product-edit.vue"),
    props: true,
    meta: {
      authRequired: true,
    },
    redirect: { name: "product-configuration" },
    children: [
      {
        name: "product-configuration",
        path: "configuration",
        props: true,
        meta: {
          activeTab: 0,
          breadcrumbs: [{
            routerName: "products",
            label: "Products"
          },
          {
            label: "Product Configuration"
          }]
        },
        component: () => import("@/pages/products/edit-view/configuration/product-configuration.vue"),
      },

      {
        name: "product-rooms",
        path: "rooms",
        props: true,
        meta: {
          activeTab: 2,
          breadcrumbs: [{
            routerName: "products",
            label: "Products"
          },
          {
            label: "Product Room Types"
          }]
        },
        component: () => import("@/pages/products/edit-view/rooms/product-rooms.vue"),
      },
    ],
  }, 
  // itineraries ---------------------------------------------------------------------------------------------------
  { 
    path: "/itineraries/:itineraryId",
    name: "itinerary-edit",
    component: () => import("@/pages/itineraries/itinerary-edit.vue"),
    meta: {
      authRequired: true,
    },
    props: true,
    redirect: { name: "itinerary-configuration" },
    children: [
      {
        name: "itinerary-configuration",
        path: "configuration",
        props: true,
        meta: {
          activeTab: 0,
          breadcrumbs: [
          {
            label: "Itinerary Configuration"
          }]
        },
        component: () => import("@/pages/itineraries/configuration/itinerary-configuration.vue"),
      },
      {
        name: "itinerary-automation",
        path: "automation",
        props: true,
        meta: {
          activeTab: 1,
          breadcrumbs: [
          {
            label: "Itinerary Automation"
          }]
        },
        component: () => import("@/pages/itineraries/automation/itinerary-automation.vue"),
      },
      {
        name: "itinerary-departures",
        path: "departures",
        props: true,
        meta: {
          activeTab: 2,
          breadcrumbs: [
          {
            label: "Itinerary Departures"
          }]
        },
        component: () => import("@/pages/itineraries/departures/itinerary-departures.vue"),
      },
      {
        name: "itinerary-policies",
        path: "policies",
        props: true,
        meta: {
          activeTab: 3,
          breadcrumbs: [
          {
            label: "Itinerary Policies"
          }]
        },
        component: () => import("@/pages/itineraries/policies/itinerary-policies.vue"),
      },
    ],
  },
  // suppliers ---------------------------------------------------------------------------------------------------
  { 
    path: "/suppliers",
    name: "suppliers",
    component: () => import("@/pages/suppliers/list-view/suppliers-list.vue"),
    meta: { 
      authRequired: true, 
      breadcrumbs: [
      {
        label: "Suppliers"
      }]
    },
  },
  {
    name: "supplier-edit",
    path: "/suppliers/:supplierId",
    component: () => import("@/pages/suppliers/edit-view/supplier-edit.vue"),
    props: true,
    meta: {
      authRequired: true,
    },
    redirect: { name: "supplier-configuration" },
    children: [
      {
        name: "supplier-configuration",
        path: "configuration",
        props: true,
        meta: {
          activeTab: 0,
          breadcrumbs: [{
            routerName: "suppliers",
            label: "Suppliers"
          },
          {
            label: "Supplier Configuration"
          }]
        },
        component: () => import("@/pages/suppliers/edit-view/configuration/supplier-configuration.vue"),
      },
      {
        name: "supplier-products",
        path: "products",
        props: true,
        meta: {
          activeTab: 1,
          breadcrumbs: [{
            routerName: "suppliers",
            label: "Suppliers"
          },
          {
            label: "Supplier Products"
          }]
        },
        component: () => import("@/pages/suppliers/edit-view/products/supplier-products.vue"),
      },
      {
        name: "supplier-itineraries",
        path: "itineraries",
        props: true,
        meta: {
          activeTab: 2,
          breadcrumbs: [{
            routerName: "suppliers",
            label: "Suppliers"
          },
          {
            label: "Supplier Itineraries"
          }]
        },
        component: () => import("@/pages/suppliers/edit-view/itineraries/supplier-itineraries.vue"),
      },
      {
        name: "supplier-promotions",
        path: "promotions",
        props: true,
        meta: {
          activeTab: 3,
          breadcrumbs: [{
            routerName: "suppliers",
            label: "Suppliers"
          },
          {
            label: "Supplier Promotions"
          }]
        },
        component: () => import("@/pages/suppliers/edit-view/promotions/supplier-promotions.vue"),
      }
      
    ],
  },
  // settings ---------------------------------------------------------------------------------------------------
  { 
    path: "/settings",
    name: "settings",
    component: () => import("@/pages/settings/settings.vue"),
    meta: { 
      authRequired: true, 
      roles: ["root", "admin"],
      breadcrumbs: [
      {
        label: "Application Settings"
      }]
    },
  },
];

// boilerplate routes ---------------------------------------------------------------------------------------------------

const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/_core/authentication/login.vue"),
    meta: { authRequired: false },
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    component: () => import("@/pages/_core/authentication/forgot-password.vue"),
    meta: { authRequired: false },
  },
  {
    path: "/resetpassword",
    name: "Reset Password",
    component: () => import("@/pages/_core/authentication/reset-password.vue"),
    meta: { authRequired: false },
  },
];

const errorPageRoutes = [
  {
    path: "/error-401",
    name: "error-401",
    component: () => import("@/pages/_core/error/error-401.vue"),
  },
  {
    path: "/error-404",
    name: "error-404",
    component: () => import("@/pages/_core/error/error-404.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "error-404",
  },
];

const managementRoutes = [
  {
    path: "/users",
    name: "Users",
    component: () => import("@/pages/_core/users/users-list.vue"),
    meta: { authRequired: true, roles: ["root", "admin"] },
  },
];

const accountRoutes = [
  {
    path: "/account",
    meta: { authRequired: true },
    redirect: "/account/profile",
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/pages/_core/account/profile.vue"),
      },
      {
        path: "preferences",
        name: "Preferences",
        component: () => import("@/pages/_core/account/preferences.vue"),
      },
      {
        path: "change-password",
        name: "Change Password",
        component: () => import("@/pages/_core/account/change-password.vue"),
      },
    ],
  },
];

const boilerplateRoutes = [...authRoutes, ...errorPageRoutes, ...mainRoutes, ...accountRoutes, ...managementRoutes];

// template resources

// base ui routes

const baseUiRoutes = [
  {
    path: "/ui",
    name: "Base UI",
    header: "Components",
    icon: "uil-box",
    meta: { authRequired: true },
    children: [
      {
        path: "accordions",
        name: "Accordions",
        component: () => import("@/template-resources/base-ui/accordions.vue"),
      },
      {
        path: "alerts",
        name: "Alerts",
        component: () => import("@/template-resources/base-ui/alerts.vue"),
      },
      {
        path: "avatars",
        name: "Avatars",
        component: () => import("@/template-resources/base-ui/avatars.vue"),
      },
      {
        path: "badges",
        name: "Badges",
        component: () => import("@/template-resources/base-ui/badges.vue"),
      },
      {
        path: "buttons",
        name: "Buttons",
        component: () => import("@/template-resources/base-ui/buttons.vue"),
      },
      {
        path: "cards",
        name: "Cards",
        component: () => import("@/template-resources/base-ui/cards.vue"),
      },
      {
        path: "dropdowns",
        name: "Dropdowns",
        component: () => import("@/template-resources/base-ui/dropdowns.vue"),
      },
      {
        path: "form-basic",
        name: "Form Basic",
        component: () => import("@/template-resources/base-ui/form/form-basic.vue"),
      },
      {
        path: "form-advanced",
        name: "Form Advanced",
        component: () => import("@/template-resources/base-ui/form/form-advanced.vue"),
      },
      {
        path: "list-group",
        name: "List Group",
        component: () => import("@/template-resources/base-ui/list-group.vue"),
      },
      {
        path: "modals",
        name: "Modals",
        component: () => import("@/template-resources/base-ui/modals.vue"),
      },
      {
        path: "offcanvas",
        name: "offcanvas",
        component: () => import("@/template-resources/base-ui/offcanvas.vue"),
      },
      {
        path: "pagination",
        name: "Pagination",
        component: () => import("@/template-resources/base-ui/pagination.vue"),
      },
      {
        path: "popovers",
        name: "Popovers",
        component: () => import("@/template-resources/base-ui/popovers.vue"),
      },
      {
        path: "progress",
        name: "Progress",
        component: () => import("@/template-resources/base-ui/progress.vue"),
      },
      {
        path: "spinners",
        name: "Spinners",
        component: () => import("@/template-resources/base-ui/spinners.vue"),
      },
      {
        path: "tables",
        name: "Tables",
        component: () => import("@/template-resources/base-ui/tables.vue"),
      },
      {
        path: "tabs",
        name: "Tabs",
        component: () => import("@/template-resources/base-ui/tabs.vue"),
      },
      {
        path: "tooltips",
        name: "Tooltips",
        component: () => import("@/template-resources/base-ui/tooltips.vue"),
      },
      {
        path: "typography",
        name: "Typography",
        component: () => import("@/template-resources/base-ui/typography.vue"),
      },
    ],
  },
];

// extended ui rotues

const extendedUiRoutes = [
  {
    path: "/extended",
    name: "Extended UI",
    icon: "uil-package",
    meta: { authRequired: true },
    children: [
      {
        path: "charts",
        name: "Charts",
        component: () => import("@/template-resources/extended-ui/charts/apex-charts.vue"),
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/template-resources/extended-ui/dashboard/sample-dashboard.vue"),
      },
      {
        path: "dragula",
        name: "Dragula",
        component: () => import("@/template-resources/extended-ui/dragula/dragula.vue"),
      },
      {
        path: "icons",
        name: "Icons",
        children: [
          {
            path: "remix-icons",
            name: "Remix Icons",
            component: () => import("@/template-resources/extended-ui/icons/remix-icon.vue"),
          },
          {
            path: "mdi",
            name: "Material Design",
            component: () => import("@/template-resources/extended-ui/icons/material-design-icon.vue"),
          },
          {
            path: "unicons",
            name: "Unicons",
            component: () => import("@/template-resources/extended-ui/icons/unicon-icon.vue"),
          },
        ],
      },
      {
        path: "range-slider",
        name: "Range Slider",
        component: () => import("@/template-resources/extended-ui/range-slider/range-slider.vue"),
      },
    ],
  },
];

const templateResourcesRoutes = [...baseUiRoutes, ...extendedUiRoutes];

// all routes

export const allRoutes = [...boilerplateRoutes, ...templateResourcesRoutes];
