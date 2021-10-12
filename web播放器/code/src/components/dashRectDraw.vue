<template>
  <section
    v-show="isShow"
    class="operate-area-wrapper"
    @dblclick.stop
    @mousedown.stop="e => $emit('mousedown', e)"
  >
    <SvgDraw
      v-show="canDraw"
      type="playerRect"
      @after-create-shape="position => $emit('after-drawed', position)"
    />
  </section>
</template>

<script>
import SvgDraw from "@/components/svgDraw";
export default {
  name: "dashRectDraw",
  components: {
    SvgDraw
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    canDraw: {
      // 是否能绘画矩形
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.operate-area-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
