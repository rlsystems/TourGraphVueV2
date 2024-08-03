<script>
import { h, computed } from "vue";
import { createColumnHelper } from "@tanstack/vue-table";
import PolicyLabel from "./policy-label.vue";
import EditItineraryButton from "./edit-itinerary-button.vue";

import AutomationWidget from "./automation-widget.vue";
import RelatedPopover from "./related-itineraries-popover.vue";

import CountDisplay from "@/components/count-display.vue";
import IdBadge from "@/components/id-badge.vue";
import AvatarTitleGroup from "@/components/avatar-title-group.vue";

const columnHelper = createColumnHelper();
export const columns = [
  columnHelper.accessor("name", {
    label: "Name / External Reference",
    enableSorting: true,
    cell: ({ row }) => {
      const subtitle = computed(() => {
        let string;
        if (row.original.enableAutomation) {
          string = row.original.externalIdentifier;
          if (row.original.requireLengthIdentifier) {
            string += " (" + (row.original.lengthInNights + 1) + " Day)";
          }
          if (row.original.requirePortIdentifier) {
            if (row.original.isDisembarkation) {
              string += " (Disembark: " + row.original.portIdentifier + ")";
            } else {
              string += " (Embark: " + row.original.portIdentifier + ")";
            }
          }
        }
        return string;
      });
      return h(AvatarTitleGroup, {
        title: row.original.name,
        subtitle: subtitle.value,
        hideAvatar: true,
        maxWidth: "320px",
      });
    },
  }),
  columnHelper.accessor("lengthDisplay", {
    label: "Length",
    enableSorting: true,
    cell: ({ row }) =>
      h(AvatarTitleGroup, {
        title: row.original.lengthDisplay,
        hideAvatar: true,
      }),
  }),

  columnHelper.accessor("wpId", {
    label: "WpId",
    enableSorting: true,
    cell: ({ row }) =>
      h(IdBadge, {
        display: row.original.wpId,
        idLink: true,
      }),
  }),
  columnHelper.accessor("enableAutomation", {
    label: "Automation Status",
    enableSorting: true,
    cell: ({ row }) =>
      h(AutomationWidget, {
        itinerary: row.original,
      }),
  }),
  columnHelper.accessor("departures", {
    label: "Departures",
    enableSorting: true,
    cell: ({ row }) => {
      const datesItineraryLink = computed(() => {
        return { name: "itinerary-departures", params: { itineraryId: row.original.id } };
      });
      return h(CountDisplay, {
        title: "departures",
        titleSingle: "departure",
        count: row.original.departures.length,
        link: datesItineraryLink,
        minWidth: "100px",
      });
    },
  }),
  columnHelper.accessor("policy", {
    label: "Policy",
    enableSorting: true,
    cell: ({ row }) => {
      const policiesItineraryLink = computed(() => {
        return { name: "itinerary-policies", params: { itineraryId: row.original.id } };
      });
      return h(PolicyLabel, {
        count: row.original.policies.length,
        ratesMissing: row.original.ratesMissing,
        link: policiesItineraryLink,
        minWidth: "100px",
      });
    },
  }),

  columnHelper.accessor("edit", {
    label: "",
    enableSorting: false,
    cell: ({ row }) =>
      h(EditItineraryButton, {
        targetItinerary: row.original,
      }),
  }),
];
</script>
