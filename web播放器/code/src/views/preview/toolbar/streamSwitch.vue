<template>
  <IconSelect
    class="stream-switch"
    v-model="streamType"
    :position="position"
    :options="selectOptions"
    :icon-space="iconSpace"
    :popups-space="popupsSpace"
    :inner-icon-space="innerIconSpace"
    :show-after="showAfter"
    @change="iconSelectChange"
  />
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import IconSelect from "@/components/iconSelect";
export default {
  name: "streamSwitch",
  components: {
    IconSelect
  },
  props: {
    value: String,
    position: {
      type: String,
      default: "left-center"
    },
    showAfter: Boolean,
    iconSpace: Number,
    popupsSpace: Number,
    innerIconSpace: Number
  },
  data() {
    return {
      streamType: this.value
    };
  },
  computed: {
    selectOptions() {
      const arr = getEntriesByAttr("codeStream");

      return arr.map(item => ({ ...item, title: item.value }));
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  methods: {
    iconSelectChange(value) {
      this.$emit("change", value);
    }
  },
  watch: {
    value(newVal) {
      this.streamType = newVal;
    }
  }
};
</script>

<style lang="scss"></style>
