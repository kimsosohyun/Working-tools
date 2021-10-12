<template>
  <div class="re-date-pannel">
    <div class="re-date-pannel-title">{{ _("q#arp#Choose Time") }}</div>
    <VDatepickerPanel
      v-show="date"
      class="re-date-pannel-main"
      :active-list="activeDayList"
      v-model="date"
      @change-header="changeDateHeader"
    />
  </div>
</template>

<script>
import VDatepickerPanel from "@/plugins/reasy-ui-src/components/datepicker/v-datepicker-panel";
export default {
  components: {
    VDatepickerPanel
  },
  props: ["activeDayList", "currentDate"],
  computed: {
    date: {
      get() {
        return this.currentDate;
      },
      set(date) {
        this.$emit("change-date", date);
      }
    }
  },
  methods: {
    changeDateHeader(args) {
      this.$emit("change-header", args);
    }
  }
};
</script>
<style lang="scss">
.re-date-pannel {
  &-title {
    color: #262626;
    padding: 16px;
    font-weight: 600;
  }
  &-main {
    margin: 0 14px;
    width: 228px;
  }
  .v-datepicker--panel__header {
    border-top: 1px solid #e9e9e9;
  }
}
</style>
