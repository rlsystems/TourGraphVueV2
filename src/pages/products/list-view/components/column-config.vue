<script>
import { createColumnHelper } from "@tanstack/vue-table";
import EditProductButton from "./edit-product-button.vue";
import { h } from "vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";
import CountDisplay from "@/components/count-display.vue";
import IdBadge from "@/components/id-badge.vue";

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor("name", {
    label: "Name",
    enableSorting: true,
    cell: ({ row }) =>
      h(AvatarTitleGroup, {
        title: row.original.name,
        subtitle: row.original.supplierName,
        hideAvatar: true,
      }),
  }),
  columnHelper.accessor("wpIp", {
    label: "Wordpress Id",
    enableSorting: false,
    cell: ({ row }) =>
      h(IdBadge, {
        isLink: true,
        display: row.original.wpId
      }),
  }),
  columnHelper.display({
    id: "rooms",
    label: "Room Types",
    enableSorting: false,
    cell: ({ row }) =>
      h(CountDisplay, {
        title: "Rooms Types",
        titleSingle: "Room Type",
        count: row.original.rooms.length,
        link: `/products/${row.original.id}/rooms`,
      }),
  }),
  columnHelper.display({
    id: "itineraries",
    label: "Itineraries",
    enableSorting: false,
    cell: ({ row }) =>
      h(CountDisplay, {
        title: "Itineraries",
        titleSingle: "Itinerary",
        count: row.original.itineraryCount,
        link: `/suppliers/${row.original.supplierId}/itineraries`,
      }),
  }),
  columnHelper.accessor("edit", {
    label: "",
    enableSorting: false,
    cell: ({ row }) =>
      h(EditProductButton, {
        targetProduct: row.original,
      }),
  }),
];
</script>
