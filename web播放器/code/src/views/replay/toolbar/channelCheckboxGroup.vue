<template>
  <ul class="channel-checkbox-group">
    <li
      class="channel-checkbox-group-li"
      v-for="(item, key, index) in channelGroup"
      :class="{ 'channel-checkbox-group-right': !expandGroup[key] }"
      :key="index + 1"
    >
      <i
        class="channel-checkbox-group-icon icon-arrow-down"
        @click="clickExpand(key)"
      ></i>
      <v-checkbox-group
        is-select-all
        :active-value="activeValue"
        :select-text="key"
        v-model="groupValue[key]"
        :ref="key"
        @click-all="clickGroup(groupValue[key], key)"
        @click="clickCheckbox"
        :options="item.options"
        :disabled-check-all="groupDisabled[key]"
        :tooltip="{
          effect: 'light',
          position: 'bottom-left',
          showOnlyEllipsis: true,
          enterable: false,
          betweenSpace: 0
        }"
      ></v-checkbox-group>
    </li>
  </ul>
</template>

<script>
import { isEmpty } from "@/utils/common";
//取交集
function mixinArr(a, b) {
  return a.filter(v => {
    return b.indexOf(v) !== -1;
  });
}

export default {
  props: {
    channelConfigs: Object,
    activeChannel: Array,
    activeWindowId: [String, Number]
  },
  inject: ["maxSplitScreenCount"],
  computed: {
    channelGroup() {
      const activeChannel = this.activeChannel;
      let list = Object.values(this.channelConfigs),
        channelObj = {},
        keyIndex = 0;

      list.forEach((item, index) => {
        if (index % 4 === 0) {
          keyIndex = `${index + 1}-${index + 4}`;
          if (index + 4 > list.length) {
            keyIndex = `${index + 1}-${list.length}`;
          }
          if (index + 1 === list.length) {
            keyIndex = `${index + 1}`;
          }
          channelObj[keyIndex] = {
            key: keyIndex,
            options: []
          };
          //复选框组赋值
          if (!this.groupValue[keyIndex]) {
            const disabled = !isEmpty(this.groupDisabled);
            this.$set(this.groupValue, keyIndex, []);
            this.$set(this.groupDisabled, keyIndex, disabled);
            this.$set(this.expandGroup, keyIndex, false);
          }
        }

        //复选框组选项
        channelObj[keyIndex].options.push({
          value: item.channel,
          label: item.title,
          disabled:
            activeChannel.length === this.maxSplitScreenCount &&
            !activeChannel.includes(item.channel)
        });
      });
      return channelObj;
    },
    channelGroupOptionsMap() {
      const map = {};

      Object.values(this.channelGroup).forEach(({ key, options }) => {
        map[key] = options.map(({ value }) => value);
      });

      return map;
    },
    activeList: {
      get() {
        return [...this.activeChannel];
      },
      set(val) {
        this.$emit(
          "change-channel",
          val.sort((a, b) => a - b)
        );
      }
    },
    activeValue() {
      const cfg =
        Object.values(this.channelConfigs).find(
          ({ windowId }) => windowId === this.activeWindowId
        ) || {};

      return cfg.channel;
    }
  },
  data() {
    return {
      expandGroup: {},
      groupValue: {},
      groupDisabled: {}
    };
  },
  mounted() {
    let firstGroup = Object.values(this.channelGroup)[0],
      activeArr = firstGroup.options,
      list = [];
    activeArr.forEach(item => {
      list.push(item.value);
    });
    // this.activeList = list;
    this.setGroupValue();
    this.expandGroup[firstGroup.key] = true;
  },
  methods: {
    clickCheckbox(val) {
      let list = this.activeList;
      if (list.indexOf(val) !== -1) {
        list = this.activeList.filter(item => item !== val);
      } else {
        list.push(val);
      }
      this.activeList = list.slice(-4);
    },
    //点击组
    clickGroup(val, key) {
      let list = this.activeList,
        selectAll = this.$refs[key][0].selectAllValue,
        isSelect = val.length !== selectAll.length;

      if (isSelect) {
        list = selectAll; //minusArr(this.activeChannel, selectAll);
        if (!this.expandGroup[key]) {
          this.clickExpand(key);
        }
      } else {
        list = [];
      }
      this.activeList = list.slice(-4);
    },
    clickExpand(key) {
      this.expandGroup[key] = !this.expandGroup[key];
      this.$nextTick(() => {
        this.$emit("resize-height");
      });
    },
    setGroupValue() {
      const channels = this.activeChannel;
      let groupList = Object.keys(this.groupValue);
      groupList.forEach(item => {
        let selectAll = this.$refs[item][0].selectAllValue;
        let list = mixinArr(selectAll, channels);
        //当前值 & 选中值取交集 当交集长度不等于当前值的长度时 取交集
        if (list.length !== this.groupValue[item].length) {
          this.groupValue[item] = list;
        }
      });
    }
  },
  watch: {
    activeChannel(val) {
      if (val.length > 0) {
        // 所选通道数量大于1
        const channelMap = this.channelGroupOptionsMap;
        const firstChannel = val[0];

        let groupName,
          channels = [];
        for (groupName in channelMap) {
          const item = channelMap[groupName];

          if (item.includes(firstChannel)) {
            // 找到已勾选通道第一位所在的分组
            channels = item;
            break;
          }
        }

        const isAllInGroup = val.every(channel => channels.includes(channel));

        Object.keys(this.groupDisabled).forEach(key => {
          this.groupDisabled[key] = true;
        });
        if (isAllInGroup) {
          this.groupDisabled[groupName] = false;
        }
      } else {
        Object.keys(this.groupDisabled).forEach(key => {
          this.groupDisabled[key] = false;
        });
      }
    }
  }
};
</script>

<style lang="scss">
.channel-checkbox-group {
  &-li {
    position: relative;
    //padding-left: 30px;
  }

  &-icon {
    position: absolute;
    top: 10px;
    left: 28px;
    z-index: 4;
    cursor: pointer;
  }

  .v-checkbox-group {
    display: block;
  }
  .v-checkbox-group__item {
    display: block;
    padding-left: 66px;
    margin-right: 0;
    &:first-child {
      padding-left: 48px;
    }
    &--active {
      background: #f5f5f5;
    }
  }
  &-right {
    .channel-checkbox-group-icon {
      transform: rotateZ(270deg);
    }
    .v-checkbox-group__item {
      display: none;
      &:first-child {
        display: block;
      }
    }
  }
}
</style>
