<template>
  <div id="map" style="width:800px;height:500px;background:#eee;"></div>
</template>

<script>
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
export default {
  mounted() {
    const draw = SVG()
      .addTo("#map")
      .size("100%", "100%");
    const constraint = {
      minX: 0,
      minY: 0,
      maxX: document.getElementById("map").offsetWidth,
      maxY: document.getElementById("map").offsetHeight
    };

    var nested = draw.nested();
    // nested.line(100, 100, 300, 300).stroke({ width: 1, color: "yellow" });
    const rect = nested
      .rect(100, 50)
      .fill("red")
      .move(30 - 10, 20 - 2.5);

    nested.draggable();

    // const constraints = new SVG.Box(100, 100, 400, 400);

    nested.on("dragmove.namespace", (e) => {
      const { handler, box } = e.detail;
      // e.preventDefault();

      let { x, y } = box;

      // In case your dragged element is a nested element,
      // you are better off using the rbox() instead of bbox()
      console.log(x);
      if (x<0 ) {
        handler.move(0 , y );
      }

      // if (y < constraints.y) {
      //   y = constraints.y;
      // }

      // if (box.x2 > constraints.x2) {
      //   x = constraints.x2 - box.w;
      // }

      // if (box.y2 > constraints.y2) {
      //   y = constraints.y2 - box.h;
      // }

      
    });
  }
};
</script>

<style></style>
