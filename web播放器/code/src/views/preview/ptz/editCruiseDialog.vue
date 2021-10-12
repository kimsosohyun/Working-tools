<template>
  <section v-if="isShow" class="edit-cruise-dialog">
    <header class="cruise-edit-header">
      <span class="cruise-edit-title">{{ _("Set patrol%s", [id + 1]) }}</span>
      <i class="icon-close" @click="closeDialog"></i>
    </header>
    <section class="cruise-edit-table">
      <table class="table-header" border="1">
        <thead>
          <th>{{ _("Preset") }}</th>
          <th>{{ _("Speed") }}</th>
          <th>{{ _("Time(s)") }}</th>
          <th>{{ _("Operation") }}</th>
        </thead>
      </table>
      <div class="table-body-wrapper">
        <v-x-scroll :border="1" :count="8" ref="scroll" overflow="y">
          <table class="table-body" border="1">
            <tr v-for="(item, dataIdx) in tableData" :key="dataIdx">
              <td>
                <v-select v-model="item.id" :options="presetOption"></v-select>
              </td>
              <td>
                <v-select
                  v-model="item.speed"
                  :options="speedOption"
                ></v-select>
              </td>
              <td>
                <v-input v-model.number="item.time" :allow="/^\d*$/"></v-input>
              </td>
              <td>
                <i
                  v-for="(action, actionIdx) in editActions"
                  :key="action.id"
                  v-tooltip="{
                    enterable: false,
                    betweenSpace: 4,
                    content: action.title
                  }"
                  :class="[
                    'icon-button-status',
                    `icon-${action.icon}`,
                    {
                      disabled:
                        (dataIdx === 0 && actionIdx === 0) ||
                        (dataIdx === tableData.length - 1 && actionIdx === 1)
                    }
                  ]"
                  @click="rowActionClick(action.id, item, dataIdx)"
                ></i>
              </td>
            </tr>
          </table>
        </v-x-scroll>
        <span class="table-body-bottom"></span>
      </div>
    </section>
    <footer class="cruise-edit-actions">
      <section class="left-bottons">
        <v-button type="info" size="S" @click="addPreset">{{
          _("Add")
        }}</v-button>
        <v-button type="info" size="S" @click="clearAll">{{
          _("Clear All")
        }}</v-button>
      </section>
      <section class="right-bottons">
        <v-button type="primary" size="S" @click="saveAll">{{
          _("Save")
        }}</v-button>
      </section>
    </footer>
  </section>
</template>

<script>
export default {
  name: "editCruiseDialog",
  inject: ["defaultSpeed", "speedOption"],
  props: ["id", "channel", "isShow"],
  model: {
    prop: "isShow",
    event: "change"
  },
  data() {
    this.getUrl = "/RPC2:ptz.getTourInfo";
    this.setUrl = "/RPC2:ptz.setTourInfo";
    this.getPresetUrl = "/RPC2:ptz.getPresetsList";
    this.editActions = [
      { id: "moveup", icon: "move-up", title: _("Upwards") },
      {
        id: "movedown",
        icon: "move-down",
        title: _("Downwards")
      },
      { id: "delete", icon: "delete", title: _("Delete") }
    ];
    this.maxDataLength = 32; // 一个巡航路径最多添加32个预置点
    return {
      presetSetted: [],
      tableData: [],
      preloaded: false // 前置数据是否已预载完成
    };
  },
  computed: {
    presetOption() {
      return this.presetSetted.map(item => ({
        label: _(`Preset%s`, [item + 1]),
        value: item
      }));
    }
  },
  // async created() {
  //   await this.getData();
  // },
  methods: {
    /**
     * 获取巡航路径n的数据
     * preset路径
     */
    async getData() {
      const getPresetData = await this.$axiosPost(this.getPresetUrl, {
          channel: this.channel
        }),
        getCruiseData = await this.$axiosPost(this.getUrl, {
          id: this.id,
          channel: this.channel
        });

      let [presetResult, cruiseInfo] = await this.$axiosAll([
        getPresetData,
        getCruiseData
      ]);

      presetResult = presetResult.getParams() || {};
      this.presetSetted = presetResult || [];
      this.tableData = cruiseInfo.getParams() || [];
      this.updateScroll();
      //   this.preloaded = true;
    },
    rowActionClick(actionId, rowData, idx) {
      this[`${actionId}Click`](rowData, idx);
    },
    moveupClick(rowData, idx) {
      if (idx === 0) {
        return;
      }

      const tempRow = this.tableData[idx];
      this.$set(this.tableData, idx, this.tableData[idx - 1]);
      this.$set(this.tableData, idx - 1, tempRow);
    },
    movedownClick(rowData, idx) {
      if (idx === this.tableData.length - 1) {
        return;
      }

      const tempRow = this.tableData[idx];
      this.$set(this.tableData, idx, this.tableData[idx + 1]);
      this.$set(this.tableData, idx + 1, tempRow);
    },
    deleteClick(rowData, idx) {
      this.tableData.splice(idx, 1);
    },
    /**
     * 获取默认的行数据
     */
    getDefaultRowData() {
      return {
        id: this.presetSetted[0],
        speed: this.defaultSpeed,
        time: 15
      };
    },
    addPreset() {
      if (this.tableData.length > this.maxDataLength) {
        // 巡航路径添加预置点最大数量
        return;
      }
      const defaultRow = this.getDefaultRowData();

      this.tableData.push(defaultRow);
      this.updateScroll(this.tableData.length - 1);
    },
    clearAll() {
      this.tableData = [];
      this.updateScroll();
    },
    async saveAll() {
      const { setUrl, id, channel, tableData: item } = this,
        reqData = {
          id,
          channel,
          item
        };

      const res = await this.$axiosPost(setUrl, reqData);

      if (res.getResult()) {
        this.$message.success(_(`Successfully set patrol"%s"`, [id + 1]));
      } else {
        let presetIds = res.getParams() || {};
        presetIds = presetIds.id || [];
        this.$message.error(
          _(`Failed to set the preset %s of the patrol %s`, [
            id + 1,
            presetIds.join()
          ])
        );
      }
      this.closeDialog();
      this.$emit("after-submit");
    },
    closeDialog() {
      this.$emit("change", !this.isShow);
    },
    updateScroll(idx) {
      this.$nextTick(() => {
        const {
          $refs: { scroll }
        } = this;
        scroll.update();
        idx !== undefined && scroll.scrollToIndex(idx);
      });
    }
  },
  watch: {
    id() {
      this.tableData = [];
      this.getData();
    }
  }
};
</script>

<style lang="scss">
.edit-cruise-dialog {
  $row-height: 28px;
  position: absolute;
  left: -6px;
  bottom: 4px;
  padding: 8px;
  width: 258px;
  height: 338px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 1px;
  z-index: 10;

  .cruise-edit-header {
    position: relative;
    margin-bottom: 10px;

    .icon-close {
      position: absolute;
      right: 0;
      font-size: 16px;
      cursor: pointer;
    }
  }

  //   .cruise-edit-table {
  //     border-top: 1px solid $border-color;
  //     border-bottom: 1px solid $border-color;
  //   }

  .table-body-wrapper {
    position: relative;
    // max-height: $row-height * 8;
    // border-bottom: 1px solid $border-color;

    .table-body-bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: $border-color;
    }
  }

  table {
    width: 100%;
    // table-layout: fixed;
    border: 1px solid $border-color;
    border-radius: 1px;

    &.table-header {
      margin-bottom: -1px;
    }
    // &.table-body {
    //   border-top: none;
    //   border-bottom: none;
    // }

    .v-select__label,
    .v-select__icon {
      padding: 0 4px 0 0;
      height: $row-height - 2px;
      line-height: $row-height - 2px;
      border: none;
      box-shadow: none;
    }
    .v-select__icon {
      padding: 0 4px;
    }
    .v-select__label--text {
      text-align: left;
      text-indent: 8px;
    }

    .v-input {
      .input-text {
        padding: 0 2px !important;
        height: 24px;
        text-align: center;
        &:hover,
        &:focus {
          border-color: $border-color;
          box-shadow: none;
        }
      }
    }

    th,
    td {
      height: $row-height;
      text-align: center;
      &:nth-of-type(1) {
        $preset-column-width: 96px;
        width: $preset-column-width;
        .v-select {
          width: $preset-column-width - 2px;
        }
      }
      &:nth-of-type(2) {
        $speed-column-width: 38px;
        width: 38px;
        .v-select {
          width: $speed-column-width - 2px;
        }
      }
      &:nth-of-type(3) {
        width: 48px;
        .v-input {
          width: 32px;
          height: 24px;
        }
      }
      &:nth-of-type(4) {
        width: auto;
        font-size: 16px;
      }
    }

    th {
      font-size: 14px;
      font-weight: 400;
      color: $title-color;
    }
  }

  .cruise-edit-actions {
    @include clearfix;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 8px 8px 12px;
    width: 100%;

    .left-bottons {
      float: left;
    }
    .right-bottons {
      float: right;
    }
  }
}
</style>
