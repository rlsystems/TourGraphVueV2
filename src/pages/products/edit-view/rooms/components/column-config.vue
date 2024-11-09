<script>
import { h, computed, getCurrentInstance } from "vue";
import { createColumnHelper } from "@tanstack/vue-table";
import EditRoomButton from "./edit-room-button.vue";

import IdBadge from "@/components/id-badge.vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor("name", {
    label: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      const instance = getCurrentInstance();
      const filters = instance?.appContext.config.globalProperties.filters;
      return h(AvatarTitleGroup, {
        title: row.original.name,
        subtitle: filters?.formatOccupancy(row.original.maxOccupancy) + " Occupancy", // Using the formatted value
        subtitle2: filters.formatPlural(row.original.numberOfRooms, "Room", "Rooms"),
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
      h(EditRoomButton, {
        room: row.original,
      }),
  }),
];
</script>
