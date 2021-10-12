<template>
  <div class="screen-pagination">
    <span class="turn-page">
      <i
        v-tooltip="{
          enterable: false,
          betweenSpace: 0,
          content: _('Previous Screen')
        }"
        :class="[
          'icon-prev',
          'icon-button-status',
          { disabled: currentPage === 1 }
        ]"
        @click="pageCalculator(-1)"
      ></i>
      <span class="pagination-text">
        {{ `${currentPage}/${totalPage}` }}
      </span>
      <i
        v-tooltip="{
          enterable: false,
          betweenSpace: 0,
          content: _('Next Screen')
        }"
        :class="[
          'icon-next',
          'icon-button-status',
          { disabled: currentPage === totalPage }
        ]"
        @click="pageCalculator(1)"
      ></i>
    </span>
    <IconSelect
      class="per-page"
      v-model="perPageValue"
      :options="screenOptions"
      :show-after="true"
      @change="perPageChange"
    />
  </div>
</template>

<script>
import { getEntriesByAttr } from "@/utils/dicts";
import IconSelect from "@/components/iconSelect";

export default {
  name: "pagination",
  components: {
    IconSelect
  },
  inject: ["maxSplitScreenCount"],
  props: {
    perPage: {
      // 当前分屏数
      type: Number,
      default: 4
    },
    currentPage: {
      // 当前分页
      type: Number,
      default: 1
    },
    channelNum: Number
  },
  data() {
    return {
      perPageValue: this.perPage
    };
  },
  computed: {
    screenOptions() {
      const options = getEntriesByAttr("splitScreen", "PREVIEW");
      const retOptions = [],
        { maxSplitScreenCount } = this;

      options.forEach(({ key, value, icon }) => {
        if (key <= maxSplitScreenCount) {
          retOptions.push({
            key,
            icon,
            title: value
          });
        }
      });
      console.log(retOptions);
      return retOptions;
    },
    totalPage() {
      // 分页总数,通道在线数量大于当前分屏数下一页才能使用
      let total = 1;
      console.log(this.channelNum);
      if (this.channelNum > 0) {
        total = Math.ceil(this.channelNum / this.perPageValue);
      }
      return total;
    }
  },
  methods: {
    pageCalculator(num) {
      const newCur = this.currentPage + num;

      if (newCur < 1 || newCur > this.totalPage) {
        return;
      }

      this.$emit("cur-page-change", newCur);
    },
    perPageChange(val) {
      this.$emit("cur-page-change", 1);
      this.$emit("per-page-change", val);
    }
  }
};
</script>

<style lang="scss">
.screen-pagination {
  .turn-page {
    display: inline-flex;
    align-items: center;
    .pagination-text {
      display: inline-block;
      width: 48px;
      text-align: center;
    }
  }
  .per-page {
    margin-left: 16px;
  }
}
</style>
