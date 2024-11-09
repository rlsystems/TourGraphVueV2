<script>
import { h  } from "vue";
import { createColumnHelper } from "@tanstack/vue-table";
import EditPromotionButton from "./edit-promotion-button.vue";


import IdBadge from "@/components/id-badge.vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor("name", {
    label: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      return h(AvatarTitleGroup, {
        title: row.original.name,
        hideAvatar: true,
      });
    },
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
  columnHelper.accessor("edit", {
    label: "",
    enableSorting: false,
    cell: ({ row }) =>
      h(EditPromotionButton, {
        promotion: row.original,
      }),
  }),
];
</script>
