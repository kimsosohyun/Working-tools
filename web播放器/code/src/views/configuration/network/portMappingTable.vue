<template>
  <div class="port-mapping-table">
    <v-table :data="tableData">
      <v-table-col prop="descript" :label="_('Port Description')"></v-table-col>
      <v-table-col prop="innerPort" :label="_('Internal Port')"></v-table-col>
      <v-table-col prop="outerPort" :label="_('External Port')"></v-table-col>
      <v-table-col prop="ip" :label="_('External IP Address')"></v-table-col>
      <v-table-col prop="status" :label="_('Status')">
        <template v-slot="{ status }">
          <span :class="['upnp-status', statusClassMap[status]]">{{
            statusMap[status]
          }}</span>
        </template>
      </v-table-col>
      <v-table-col :label="_('Operation')">
        <template v-slot="{ descript }">
          <span
            v-tooltip="{
              betweenSpace: 8,
              content: _('Edit'),
              enterable: false,
              trigger: editDisabled ? 'manual' : 'hover'
            }"
            :class="[
              'icon-button-status',
              'icon-track-record',
              { disabled: editDisabled }
            ]"
            @click="edit(descript)"
          ></span>
        </template>
      </v-table-col>
    </v-table>

    <v-dialog
      v-model="showEditDialog"
      :title="_('Edit')"
      @confirm="handleConfirm"
      :confirm-button-text="_('Save')"
    >
      <v-form ref="form" :rules="rules" :model="formData" @submit="submitData">
        <v-form-item
          :label="_('Port Description')"
          prop="descript"
          :disabled="true"
        >
          <v-input v-model="formData.descript"></v-input>
        </v-form-item>
        <v-form-item :label="_('External Port')" prop="outerPort">
          <v-input
            :allow="/\d/g"
            v-model="formData.outerPort"
            :auto-correction="[1, 65535]"
          ></v-input>
        </v-form-item>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import { arrayToObject } from "@/utils/common";
export default {
  name: "portMappingTable",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    editDisabled: Boolean
  },
  model: {
    prop: "data",
    event: "change"
  },
  data() {
    this.statusAttr = "upnpStatus";
    this.MODULE = "CONFIG";
    return {
      showEditDialog: false,
      tableData: [],
      formData: {},
      rules: {
        outerPort: { type: "num", args: [0, 65535], msg: _("Range: 0 - 65535") }
      }
    };
  },
  computed: {
    statusArr() {
      return getEntriesByAttr(this.statusAttr, this.MODULE);
    },
    statusMap() {
      // 端口状态映射，与后台数据对应
      return arrayToObject(this.statusArr);
    },
    statusClassMap() {
      // 端口状态映射，与后台数据对应
      return arrayToObject(this.statusArr, "key", "clazz");
    }
  },
  methods: {
    /**
     * @param {String} descript - 描述（行数据唯一标识符）
     */
    edit(descript) {
      if (this.editDisabled) {
        // mode为“默认”不可编辑
        return;
      }

      this.showEditDialog = true;
      this.formData = {
        ...this.tableData.find(item => item.descript === descript)
      };
    },
    handleConfirm() {
      this.$refs.form.submitForm();
    },
    submitData(data) {
      const { descript } = this.formData,
        idx = this.tableData.findIndex(item => item.descript === descript);

      data.outerPort = +data.outerPort;

      this.$set(this.tableData, idx, { ...this.formData, ...data });
      this.$emit("change", this.tableData);
      this.showEditDialog = false;
    }
  },
  watch: {
    data(newVal) {
      const tableData = this.tableData,
        tableLen = tableData.length;

      if (tableLen === 0) {
        this.tableData = [...newVal];
      }
    }
  }
};
</script>

<style lang="scss">
.port-mapping-table {
  margin-bottom: 32px;
  .icon-track-record {
    font-size: 16px;
    color: $light-color;
  }
  .v-dialog__main {
    padding-bottom: 0;
  }

  .upnp-status {
    &.upnp-mapping {
      color: $main-active-color;
    }
    &.upnp-succeded {
      color: $success-color;
    }
    &.not-opened,
    &.upnp-disabled,
    &.upnp-failed,
    &.upnp-error {
      color: #f7421e;
    }
  }
}
</style>
