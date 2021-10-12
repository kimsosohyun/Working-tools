<template>
  <div class="poe-port">
    <div v-for="(item, idx) in portsArr" :key="item.id" class="port-group">
      <span class="port-index">{{ item.id + 1 }}</span>
      <span
        :class="['icon-port', { connected: item.status === connectedStatus }]"
      ></span>
      <span class="port-power">
        {{
          item.status === connectedStatus
            ? `${item.power}W`
            : statusMap[item.status]
        }}
      </span>
      <v-button
        :class="['mode-switch', { 'long-mode': item.mode === longMode }]"
        size="S"
        @click="modeSwitch(idx)"
        >{{ modeMap[item.mode] }}</v-button
      >
    </div>
  </div>
</template>

<script>
import { getKeyById, getEntriesByAttr } from "@/utils/dicts";
import { arrayToObject } from "@/utils/common";
export default {
  name: "poePort",
  props: {
    ports: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.statusAttr = "connection"; // 状态-数据字典中的值
    this.modeAttr = "poePortMode"; // 端口模式
    return {
      portsArr: []
    };
  },
  computed: {
    statusMap() {
      // 端口连接状态映射
      return this.getDictAttrMap(this.statusAttr);
    },
    modeMap() {
      // 端口模式映射
      return this.getDictAttrMap(this.modeAttr, "CONFIG");
    },
    connectedStatus() {
      // poe端口在线状态的key，与后台数据对应
      return getKeyById("connected", this.statusAttr);
    },
    longMode() {
      // poe端口长距模式的key，与后台数据对应
      return getKeyById("long", this.modeAttr, "CONFIG");
    },
    normalMode() {
      // poe端口普通模式的key，与后台数据对应
      return getKeyById("normal", this.modeAttr, "CONFIG");
    }
  },
  methods: {
    /**
     * 获取数据字典数据映射
     * @param {String} attrName 字典属性名称
     * @param {String} modelName 模块名称
     * @returns {Object} { key: value, ... }
     */
    getDictAttrMap(attrName, modelName) {
      const statusArr = getEntriesByAttr(attrName, modelName);
      return arrayToObject(statusArr);
    },
    // 模式切换
    modeSwitch(idx) {
      const port = this.portsArr[idx];

      port.mode = port.mode === this.longMode ? this.normalMode : this.longMode;
    },
    // 暴露出口数据
    getPorts() {
      return this.portsArr;
    }
  },
  watch: {
    ports(newVal) {
      if (this.portsArr.length) {
        this.portsArr.forEach((item, index) => {
          item.power = newVal[index].power;
          item.status = newVal[index].status;
        });
      } else {
        this.portsArr = newVal;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.poe-port {
  @mixin dir-col {
    display: inline-flex;
    flex-direction: column;
  }

  @include dir-col;
  flex-wrap: wrap;
  height: 280px;
  .port-group {
    @include dir-col;
    align-items: center;
    line-height: 1;

    &:nth-of-type(2n) {
      margin-top: 32px;
    }
    &:nth-of-type(n + 3) {
      margin-left: 24px;
    }

    .port-index {
      color: $title-color;
    }
    .icon-port {
      padding: 8px 0;
      font-size: 40px;
      color: $disabled-color;
      &.connected {
        color: $main-active-color;
      }
    }
    .mode-switch {
      margin-top: 16px;
      &.long-mode {
        color: $main-active-color;
        border-color: $main-active-color;
      }
    }
  }
}
</style>
