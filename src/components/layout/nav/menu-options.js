
export const menuOptions = [
  {
    path: "/suppliers",
    name: "Suppliers",
    icon: true,
    iconClassList: ["uil-box"]
  },
  {
    path: "/products",
    name: "Products",
    icon: true,
    iconClassList: ["ri-sailboat-line"]
  },
  {
    path: "/users",
    name: "User Management",
    icon: true,
    roles: ['root', 'admin'],
    iconClassList: ["mdi", "mdi-account-outline"]
  },
  {
    path: "/settings",
    name: "Settings",
    icon: true,
    roles: ['root', 'admin'],
    iconClassList: ["mdi", "mdi-cog-outline"]
  },
];
