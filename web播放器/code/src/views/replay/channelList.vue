<template>
  <div class="re-channel-list">
    <div class="re-channel-list-title">{{ _("Select Channel") }}</div>
    <div class="re-channel-list-group">
      <span
        class="re-channel-list-icon"
        :class="{ 're-channel-list-icon--active': group === 1 }"
        @click="changeChannelGroup(1)"
        >1</span
      >
      <span
        class="re-channel-list-icon"
        :class="{ 're-channel-list-icon--active': group === 4 }"
        @click="changeChannelGroup(4)"
        >4</span
      >
    </div>
    <v-scroll ref="scroll" :height="280">
      <ul class="re-channel-list-ul" v-if="group === 1">
        <li
          v-for="(item, key) in channelConfigs"
          :key="key"
          :class="[
            're-channel-list-li',
            { active: activeWindowId === item.windowId }
          ]"
        >
          <ChannelCheckbox
            class="re-channel-list-item"
            :value="activeChannel.includes(item.channel)"
            @click="setActiveChannel(item.channel)"
            :label="item.title"
            :disabled="
              activeChannel.length === maxSplitScreenCount &&
                !activeChannel.includes(item.channel)
            "
          />
        </li>
      </ul>

      <ChannelCheckboxGroup
        v-else
        @resize-height="resizeHeight"
        :active-window-id="activeWindowId"
        :active-channel="activeChannel"
        :channel-configs="channelConfigs"
        @change-channel="changeChannel"
      />
    </v-scroll>
    <slot></slot>
  </div>
</template>

<script>
import ChannelCheckbox from "./toolbar/channelCheckbox";
import ChannelCheckboxGroup from "./toolbar/channelCheckboxGroup";
export default {
  name: "channelList",
  components: {
    ChannelCheckbox,
    ChannelCheckboxGroup
  },
  inject: ["maxSplitScreenCount"],
  data() {
    return {
      group: 1, // 分组号 1&4
      channelGroups: ["", ""]
    };
  },
  props: ["activeChannel", "channelConfigs", "activeWindowId"],
  methods: {
    setActiveChannel(channel) {
      let channels = [...this.activeChannel],
        idx = channels.indexOf(channel);

      if (idx !== -1) {
        channels.splice(idx, 1);
      } else {
        channels.push(channel);
        channels = channels.sort((a, b) => a - b);
      }

      this.changeChannel(channels);
    },
    changeChannel(channel) {
      this.$emit("change-channel", channel);
    },
    //更新高度
    resizeHeight() {
      this.$refs.scroll.update();
    },
    //切换通道
    changeChannelGroup(val) {
      if (this.group === val) {
        return;
      }

      this.group = val;
      this.$emit("change-group", val);

      let list = Object.keys(this.channelConfigs);

      list = list.slice(0, val).map(channel => +channel);

      this.$emit("change-channel", list, true);
    }
  },
  watch: {
    channelConfigs() {
      this.$refs.scroll.update();
    }
  }
};
</script>

<style lang="scss">
.re-channel-list {
  height: 100%;
  &-title {
    margin: 0 16px 8px;
    color: $title-color;
    // margin: 0 14px;
    padding: 16px 0;
    font-weight: 600;
    border-bottom: 1px solid $disabled-border-color;
  }
  &-ul {
    margin-top: 8px;
  }
  &-li {
    &.active {
      background-color: #f5f5f5;
    }
  }
  .v-checkbox__label {
    @include ellipsis;
    line-height: 36px;
  }
  .v-checkbox-group__item {
    height: 36px;
    .v-checkbox__label {
      width: 150px;
    }
  }
  &-item {
    padding-left: 26px;
    height: 36px;
    .v-checkbox__label {
      width: 190px;
    }
  }
  &-date-panel {
    margin: 0 14px;
    width: 228px;
    .v-datepicker--panel__icon {
      font-size: 16px;
    }
    .v-datepicker--info {
      height: 24px;
      line-height: 22px;
    }
    // margin: 0 14px;
  }
  &-group {
    margin: 16px 26px;
  }
  &-icon {
    width: 20px;
    padding: 1px 0;
    text-align: center;
    line-height: 12px;
    font-size: 12px;
    color: $title-color;
    display: inline-block;
    border: 1px solid $title-color;
    cursor: pointer;
    &--active {
      border-color: $main-active-color;
      background: $main-active-color;
      color: #fff;
    }
    & + & {
      margin-left: 16px;
    }
  }
}
</style>
