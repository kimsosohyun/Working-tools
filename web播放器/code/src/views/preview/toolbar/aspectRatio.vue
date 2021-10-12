<template>
  <IconSelect
    class="aspect-ratio"
    v-model="ratioValue"
    :options="selectOptions"
    :show-after="true"
    @change="iconSelectChange"
  />
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import IconSelect from "@/components/iconSelect";
export default {
  name: "aspectRatio",
  components: {
    IconSelect
  },
  props: {
    value: {
      type: String,
      default: "full"
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      ratioValue: this.value
    };
  },
  computed: {
    selectOptions() {
      const arr = getEntriesByAttr("aspectRatio", "PREVIEW");

      return arr.map(item => ({ ...item, title: item.value }));
    }
  },
  methods: {
    iconSelectChange(ratio) {
      this.$emit("change", ratio);
    }
  },
  watch: {
    value(newVal) {
      this.ratioValue = newVal;
    }
  }
};
</script>

<style></style>
