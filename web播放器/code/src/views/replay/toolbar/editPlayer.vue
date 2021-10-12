<template>
  <div class="edit-player">
    <span
      class="icon-button-status icon-media-edit"
      :class="{ disabled: disabled, active: isEdit }"
      @click="clickEdit"
    ></span>
    <template v-if="isEdit">
      <span class="re-icons-item">
        <v-timepicker
          :width="104"
          format="hh:mm:ss"
          :panel-width="220"
          v-model="startTime"
          @change="changeTime"
        ></v-timepicker>
      </span>
      <span class="edit-player-splitter">-</span>
      <span>
        <v-timepicker
          :width="104"
          format="hh:mm:ss"
          v-model="endTime"
          :panel-width="220"
          @change="changeTime"
        ></v-timepicker>
      </span>
      <span
        class="re-icons-item icon-button-status icon-export"
        @click="saveVideo"
      ></span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    time: Array,
    disabled: Boolean
  },
  data() {
    return {
      isEdit: false,
      startTime: "",
      endTime: ""
    };
  },
  methods: {
    clickEdit() {
      if (this.disabled) return;
      this.isEdit = !this.isEdit;
    },
    saveVideo() {
      // 提交剪切数据
      if (this.startTime === "" || this.endTime === "") {
        this.$message.error(_("Please select a valid time period"));
        return;
      }
      this.$emit("cut-video", {
        startTime: this.startTime,
        endTime: this.endTime,
        callback: () => {
          this.isEdit = false;
          this.$emit("cut-time", {
            startTime: "",
            endTime: ""
          });
        }
      });
    },
    changeTime() {
      if (this.startTime === "" || this.endTime === "") {
        return;
      }

      this.$emit("cut-time", {
        startTime: this.startTime,
        endTime: this.endTime
      });
    }
  },
  watch: {
    time: {
      handler(val) {
        this.startTime = val[0] || "";
        this.endTime = val[0] || "";
      }
    }
  }
};
</script>

<style lang="scss">
.edit-player {
  display: inline-flex;
  align-items: center;
  height: 100%;
  &-splitter {
    padding: 0 4px;
  }
  .v-timepicker {
    &__input {
      width: 100%;
    }
  }
}
</style>
