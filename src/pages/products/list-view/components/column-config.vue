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
  columnHelper.accessor("wpId", {
    label: "WpId",
    enableSorting: true,
    cell: ({ row, table }) => {
      const allData = table.getRowModel().rows.map((r) => r.original);
      const currentWpId = row.original.wpId;
      const isDuplicate = allData.filter((item) => item.wpId === currentWpId).length > 1;
      return h(IdBadge, {
        display: row.original.wpId,
        isLink: true,
        warning: isDuplicate
      });
    },
  }),
  columnHelper.accessor("externalIdentifier", {
    label: "External Identifier",
    enableSorting: true,
    cell: ({ row, table }) => {
      const allData = table.getRowModel().rows.map((r) => r.original);
      const currentExternalIdentifier = row.original.externalIdentifier;
      const isDuplicate = allData.filter((item) => item.externalIdentifier === currentExternalIdentifier).length > 1;
      return h(IdBadge, {
        display: row.original.externalIdentifier,
        isLink: true,
        warning: isDuplicate
      });
    },
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
