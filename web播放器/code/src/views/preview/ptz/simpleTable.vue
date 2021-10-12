<template>
  <div class="simple-table">
    <div class="simple-table-inner">
      <v-scroll
        :height="simpleTableHeight"
        overflow="y"
        @scroll="$emit('scroll')"
      >
        <table ref="table" border="1">
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.id + 1 }}</td>
            <td>{{ `${title}${item.id + 1}` }}</td>
            <td>
              <i
                v-for="action in actions"
                :key="action.icon"
                v-tooltip.single="{
                  enterable: false,
                  betweenSpace: 4,
                  content: action.title
                }"
                :class="[
                  'icon-button-status',
                  `icon-${action.icon}`,
                  {
                    disabled:
                      disableActions.includes(action.icon) && !item.hasData
                  }
                ]"
                @click="e => actionClick(e, action, item)"
              ></i>
            </td>
          </tr>
        </table>
      </v-scroll>
    </div>
  </div>
</template>

<script>
export default {
  name: "simpleTable",
  props: {
    title: String,
    data: Array,
    actions: {
      type: Array,
      default: () => []
    },
    isDisableAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: 0
    };
  },
  computed: {
    simpleTableHeight() {
      const {
        tableHeight,
        $store: {
          state: { simpleTableHeight }
        }
      } = this;

      return simpleTableHeight >= tableHeight ? tableHeight : simpleTableHeight;
    },
    disableActions() {
      return (
        this.actions.length && this.actions.slice(1).map(({ icon }) => icon)
      );
    }
  },
  mounted() {
    this.getTableHeight();
  },
  methods: {
    actionClick(e, action, rowData) {
      const { icon } = action;
      if (this.disableActions.includes(icon) && !rowData.hasData) {
        // 点击禁用按钮，不处理
        return;
      }

      this.$emit("click", e, action, rowData);
    },
    getTableHeight() {
      const { height } = this.$refs.table.getBoundingClientRect();
      this.tableHeight = height;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.simple-table {
  $table-border: 1px solid $border-color;
  position: relative;
  &-inner {
    position: absolute;
    width: 100%;
    border-top: $table-border;
    border-bottom: $table-border;
  }
  .v-scroll {
    margin: -1px 0;
  }
  table {
    width: 100%;
    border: $table-border;
    color: $title-color;
    tr {
      height: 28px;
      td {
        padding: 0 12px;
        &:nth-of-type(1) {
          padding: 0;
          width: 36px;
          text-align: center;
        }
        &:nth-of-type(2) {
          width: auto;
        }
        &:nth-of-type(3) {
          width: 88px;
          font-size: 0;
          text-align: center;
        }
      }
      .icon-button-status {
        font-size: 16px;
        &:nth-of-type(n + 2) {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
