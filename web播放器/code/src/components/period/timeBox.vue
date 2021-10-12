<template>
  <v-box
    :title="_('Arming Sched.')"
    :show="show"
    @cancel="cancel"
    @submit="submit"
    class="time-box"
    @hide="hide"
    @click.native.stop=""
  >
    <v-form :model="ruleForm" :rules="rules">
      <v-form-item prop="event" v-show="events.length > 1">
        <v-select v-model="ruleForm.event" :options="events"></v-select>
      </v-form-item>
      <v-form-item prop="time" ref="time">
        <v-timepicker
          :placeholder="_('Start Time')"
          :end-placeholder="_('End Time')"
          is-range
          isAllDay
          v-model="ruleForm.time"
        ></v-timepicker>
      </v-form-item>
    </v-form>
  </v-box>
</template>

<script>
import vBox from "./box.vue";

export default {
  components: { vBox },
  data() {
    return {
      rules: {
        time: [this.validate]
      }
    };
  },
  props: {
    events: { type: Array },
    ruleForm: { type: Object },
    show: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "show",
    event: "change"
  },
  watch: {
    show(val) {
      if (val === false) {
        this.clear();
      }
    }
  },
  methods: {
    validate(val) {
      let start = val[0].split(":");
      let end = val[1].split(":");

      start = start[0] * 60 + parseInt(start[1]);
      end = end[0] * 60 + parseInt(end[1]);
      if (start >= end) {
        return _("The start time should be earlier than the end time");
      }
    },
    submit() {
      if (this.$refs.time.checkValid()) {
        this.$emit("submit");
      }
    },
    cancel() {
      this.$emit("cancel");
    },
    hide() {
      this.$emit("change", false);
    },
    clear() {
      this.$refs.time.setError("");
    }
  }
};
</script>

<style lang="scss">
.time-box {
  bottom: 100%;
  margin-bottom: 6px;
  transform: translateX(-50%);
  &::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px 7px;
    border-top-color: #fff;
  }
}
</style>
