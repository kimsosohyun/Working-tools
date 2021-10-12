<template>
  <div class="channel-list">
    <ul class="channel-list-ul">
      <li
        class="channel-list-li"
        v-for="(item, key) in channelConfigs"
        :key="key"
      >
        <section
          :class="[
            'channel-list-item',
            { active: activeChannel === item.channel }
          ]"
          @click="setActiveChannelToStore(item.channel)"
          @dblclick="changeAssociated(item.channel)"
        >
          <div class="channel-icon">
            <i class="icon-menu-camera"></i>
            <span v-show="item.windowId !== null" class="channel-online"></span>
          </div>
          <div
            class="channel-name"
            v-tooltip="{
              effect: 'light',
              position: 'bottom-left',
              showOnlyEllipsis: true,
              enterable: false,
              betweenSpace: 12,
              content: item.title
            }"
          >
            {{ item.title }}
          </div>
          <div class="channel-actions">
            <!-- <i
              :class="[
                'channel-record',
                'icon-button-status',
                item.isRecorded ? 'icon-record-stop active' : 'icon-record'
              ]"
              @click="recordVideo(idx)"
            ></i> -->

            <StreamSwitch
              v-model="item.streamType"
              :icon-space="4"
              :popups-space="4"
              :inner-icon-space="4"
              @change="type => switchStream(item.channel, type)"
            />
          </div>
        </section>
        <section
          :class="['disabled-mask', { disabled: item.status !== 2 }]"
        ></section>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import StreamSwitch from "./toolbar/streamSwitch";
export default {
  name: "channelList",
  components: {
    StreamSwitch
  },
  inject: ["liveStop", "livePlay", "switchStream"],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      activeChannel: "activeChannel",
      activeWindowId: "activeWindowId"
    }),
    ...mapGetters({
      channelConfigs: "channelConfigs"
    })
  },
  methods: {
    ...mapMutations([
      "setActiveChannel",
      "setActiveWindowId",
      "setCustomConfigs"
    ]),
    changeAssociated(channel) {
      const channelCfg = this.channelConfigs[channel],
        { activeWindowId } = this;

      if (channelCfg.windowId === activeWindowId) {
        // 当前聚焦窗口与所双击的通道已绑定，则解绑并停止播放
        this.liveStop(channel);
        this.setCustomConfigs({
          channel,
          configs: { windowId: null }
        });
        return;
      }

      if (channelCfg.windowId !== null) {
        // 当前所双击的通道已绑定窗口（非聚焦窗口），设置该通道绑定的窗口为聚焦窗口，
        // 停止播放并跳转至原绑定窗口分页
        this.setActiveWindowId(channelCfg.windowId);
        this.changeAssociated(channel);
        return;
      }

      for (const cfg of Object.values(this.channelConfigs)) {
        // 解除之前与该窗口关联的通道并停止预览该通道画面
        if (cfg.windowId === activeWindowId) {
          this.liveStop(cfg.channel);
          this.setCustomConfigs({
            channel: cfg.channel,
            configs: { windowId: null }
          });
          break;
        }
      }

      this.setCustomConfigs({
        channel,
        configs: { windowId: activeWindowId }
      }); // 通道与播放窗口关联并开始预览该通道画面
      this.setActiveChannelToStore(channel);

      this.$nextTick(() => {
        this.livePlay(channel);
        console.log(`play channel ${channel}`, this.channelConfigs);
      });
    },
    /**
     * 修改当前选选中通道
     * @param {Number} id 通道号
     */
    setActiveChannelToStore(id) {
      const { windowId } = this.channelConfigs[id];

      if (windowId !== null) {
        // 切换当前通道，若通道处于预览状态，聚焦窗口也需要同步修改
        this.$emit("emit-active-window-change", windowId);
      }
      this.setActiveChannel(id);
    }
  }
};
</script>

<style lang="scss">
.channel-list {
  padding-top: 8px;
  height: 100%;

  &-item {
    display: flex;
    align-items: center;
    padding: 0 16px 0 24px;
    height: 40px;
    &.active {
      background-color: #f5f5f5;
    }

    .channel-icon {
      position: relative;
      flex: 0 0 16px;
      margin-right: 8px;
      font-size: $font-size-l;
      color: $title-color;

      .channel-online {
        $channel-online-r: 3px;
        position: absolute;
        top: -1px;
        right: -1px;
        width: $channel-online-r * 2;
        height: $channel-online-r * 2;
        background-color: $success-color;
        border-radius: $channel-online-r;
      }
    }
    .channel-name {
      @include ellipsis;
      padding-right: 8px;
      width: 168px;
      font-size: $font-size-m;
      cursor: initial;
      user-select: none;
    }
    .channel-actions {
      flex: 0 0 24px;
      font-size: 24px;

      .channel-record {
        margin-right: 8px;
      }
    }
  }

  &-li {
    position: relative;
    .disabled-mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: not-allowed;
      &.disabled {
        display: inline-block;
        background-color: $disabled-mask-color;
      }
    }
  }
}
</style>
