<script>
import { createColumnHelper } from "@tanstack/vue-table";
import EditSupplierButton from "./edit-supplier-button.vue";
import CountDisplay from "@/components/count-display.vue";
import { h } from "vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";
import { useSuppliersStore } from "@/stores/suppliersStore.js";

const suppliersStore = useSuppliersStore();

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor("name", {
    label: "Name",
    enableSorting: true,
    cell: ({ row }) =>
      h(AvatarTitleGroup, {
        title: row.original.name,
        hideAvatar: true,
      }),
  }),
  columnHelper.display({
    id: "productCount",
    label: "Products",
    enableSorting: false,
    cell: ({ row }) =>
      h(CountDisplay, {
        title: "Products",
        titleSingle: "Product",
        count: row.original.products.length,
        link: `/suppliers/${row.original.id}/products`, 
      }),
  }),
  columnHelper.display({
    id: "promotions",
    label: "Promotions",
    enableSorting: false,
    cell: ({ row }) =>
      h(CountDisplay, {
        title: "Promotions",
        titleSingle: "Promotion",
        count: row.original.promotions.length,
        link: `/suppliers/${row.original.id}/promotions`
      }),
  }),
  columnHelper.accessor("edit", {
    label: "",
    enableSorting: false,
    cell: ({ row }) =>
      h(EditSupplierButton, {
        targetSupplier: row.original,
      }),
  }),
];
</script>
