<template>
  <v-box
    :title="_('m#cTE#Sync to')"
    :cancel-text="_('Cancel')"
    class="copy-box"
    :show="show"
    @cancel="$emit('cancel')"
    @submit="$emit('submit')"
    :width="368"
    @hide="$emit('change', false)"
  >
    <v-form :model="ruleForm">
      <v-form-item prop="weekday">
        <v-checkbox-group
          is-select-all
          v-model="ruleForm.weekday"
          :options="weekday"
        ></v-checkbox-group>
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
      weekday: [
        {
          label: _("Mon."),
          disabled: false,
          value: 0
        },
        {
          label: _("Tues."),
          disabled: false,
          value: 1
        },
        {
          label: _("Wed."),
          disabled: false,
          value: 2
        },
        {
          label: _("Thur."),
          disabled: false,
          value: 3
        },
        {
          label: _("Fri."),
          disabled: false,
          value: 4
        },
        {
          label: _("Sat."),
          disabled: false,
          value: 5
        },
        {
          label: _("Sun."),
          disabled: false,
          value: 6
        }
      ]
    };
  },
  props: {
    disabled: { type: [String, Number] },
    ruleForm: { weekday: Array },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    disabled(val) {
      this.weekday.forEach(day => {
        day.disabled = day.value === val;
      });
    }
  },
  model: {
    prop: "show",
    event: "change"
  }
};
</script>

<style lang="scss">
.copy-box {
  // position: fixed;
  transform: translate(-100%, -30px);
  margin-left: -8px;

  &:after {
    top: 40px;
    left: 100%;
    border-width: 6px 7px;
    border-left-color: #fff;
  }
  .v-checkbox {
    width: 90px;
    .v-checkbox__item {
      margin: 0;
    }
  }
  .v-checkbox:nth-child(4n + 1) {
    width: auto;
  }
  .v-checkbox-group__item:first-child {
    width: 100%;
  }
}
</style>
