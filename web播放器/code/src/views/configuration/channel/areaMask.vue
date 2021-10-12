<template>
  <div>
    <SvgDraw type="playerRect" :drawStyle="drawStyle" :arrow="arrow" />
    <div class="select">
      <v-select
        v-model="select"
        :options="selectOption"
        @change="changeValue"
      ></v-select>
    </div>
  </div>
</template>

<script>
import SvgDraw from "@/components/svgDraw.vue";
export default {
  data() {
    return {
      arrow: "",
      drawStyle: {
        width: "800px",
        height: "500px",
        cursor: "pointer",
        background: "#eee"
      },
      select: "AB",
      selectOption: [
        {
          value: "AB",
          label: "A ↔ B"
        },
        {
          value: "B",
          label: "A -> B"
        },
        {
          value: "A",
          label: "A <- B"
        }
      ]
    };
  },
  components: {
    SvgDraw
  },
  methods: {
    changeValue(val) {
      // console.log(this.$refs.svgDraw.arrowArr[this.$refs.svgDraw.choose -1])
      this.arrow = val;
    },
    changeSelect(data) {
      this.select = data;
    },
    mouseup(data) {
      console.log(data);
    },
    createShape(data) {
      console.log(data);
    }
  }
};
</script>

<style>
.select {
  position: absolute;
  top: 710px;
  left: 382px;
}
</style>
