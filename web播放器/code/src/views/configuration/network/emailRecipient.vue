<template>
  <v-table class="email-recipient" :data="tableData">
    <v-table-col :width="100" type="index" :label="_('No.')"></v-table-col>
    <v-table-col :width="360" prop="name" :label="_('Recipient')">
      <template v-slot="{ name, id }">
        <v-input
          :value="name"
          :placeholder="_('Custom recipient name')"
          @change="val => nameChange(id, val)"
        ></v-input>
      </template>
    </v-table-col>
    <v-table-col :width="340" prop="address" :label="_('Recipient Email')">
      <template v-slot="{ address, id, isAddrCheckPassed }">
        <v-input
          :class="{ 'error-input': !isAddrCheckPassed }"
          :value="address"
          :placeholder="_('Recipient Email address')"
          v-tooltip="{
            content: _('Recipient email address is required'),
            position: 'right-center',
            trigger: 'manual',
            value: !isAddrCheckPassed
          }"
          @change="val => addrChange(id, val)"
          @focus="addrInputFocus(id)"
          @blur="addrInputBlur(id)"
        ></v-input>
      </template>
    </v-table-col>
    <v-table-col prop="id" :label="_('Test')">
      <template v-slot="{ id }">
        <span
          v-tooltip="{
            trigger: isNotServe ? 'manual' : 'hover',
            content: _('Test'),
            enterable: false,
            betweenSpace: 8
          }"
          :class="[
            'icon-button-status',
            'icon-send-email',
            { disabled: isNotServe }
          ]"
          @click="emailTest(id)"
        ></span>
      </template>
    </v-table-col>
  </v-table>
</template>

<script>
// isAddrCheckPassed: 收件人地址是否校验通过
export default {
  name: "emailRecipient",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isNotServe: Boolean
  },
  data() {
    return {
      emailTestUrl: "/RPC2:magicBox.testEmail",
      tableData: []
    };
  },
  methods: {
    /**
     * 初始化表格数据（主要添加收件人地址校验判断）
     * @param {Array} data 表格数据
     */
    initTableData(data) {
      this.tableData = data.map(item => ({
        ...item,
        isAddrCheckPassed: true
      }));
    },
    // 向父级暴露获取表格数据出口
    getTableData() {
      return this.tableData.map(({ id, name, address }) => ({
        id,
        name,
        address
      }));
    },
    checktableData() {
      return this.tableData.every(({ isAddrCheckPassed }) => isAddrCheckPassed);
    },
    /**
     * 设置表格行数据
     * @param {String} id 行数据id
     * @param {Object} obj 需要修改的数据
     */
    setTableRowData(id, obj) {
      const { tableData } = this,
        idx = this.tableData.findIndex(item => item.id === id);

      if (idx !== -1) {
        this.$set(tableData, idx, { ...tableData[idx], ...obj });
      }
    },
    // 手动修改收件人名称
    nameChange(id, val) {
      this.setTableRowData(id, {
        name: val
      });
    },
    // 手动修改收件人地址
    addrChange(id, val) {
      this.setTableRowData(id, {
        address: val
      });
    },
    addrInputFocus(id) {
      this.setTableRowData(id, {
        isAddrCheckPassed: true
      });
    },
    addrInputBlur(id) {
      const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        idx = this.tableData.findIndex(item => item.id === id);

      if (idx !== -1) {
        const isAddrCheckPassed =
          emailReg.test(this.tableData[idx].address) ||
          !this.tableData[idx].address;

        this.setTableRowData(id, {
          isAddrCheckPassed
        });
      }
    },

    // 邮箱测试
    async emailTest(id) {
      if (this.isNotServe) {
        // 禁用状态，直接返回
        return;
      }

      const { name, address } =
        this.tableData.find(item => item.id === id) || {};

      const res = await this.$axiosPost(this.emailTestUrl, { name, address });

      if (res.getResult()) {
        this.$message.success(_("Test succeeded"));
      } else {
        // todo 根据错误码显示相关信息，错误码待提供
      }
    }
  },
  watch: {
    data(newVal) {
      this.initTableData(newVal);
    },
    isNotServe(newVal) {
      if (newVal) {
        // 邮箱服务关闭，重新初始化表格数据，主要用于去除“收件人地址”文字提示校验
        this.initTableData(this.tableData);
      } else {
        // 邮箱服务开启，重新校验“收件人地址”格式
        this.tableData.forEach(({ id }) => this.addrInputBlur(id));
      }
    }
  }
};
</script>

<style lang="scss">
.email-recipient {
  .error-input {
    input {
      border-color: $error-color;
    }
  }
  .icon-send-email {
    font-size: 16px;
    color: $light-color;
  }
}
</style>
