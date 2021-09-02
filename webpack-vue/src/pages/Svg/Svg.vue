<template>
  <div id="map" style="width:800px;height:500px;background:#eee;"></div>
</template>

<script>
import  SVG  from "svg.js";
import "./svg.resize.js";
import "svg.select.js"
export default {
  mounted() {
    const draw = SVG("map").size("100%", "100%");
    const constraint = {
      minX: 0,
      minY: 0,
      maxX: document.getElementById("map").offsetWidth,
      maxY: document.getElementById("map").offsetHeight
    };
    const resizeLimits = {
		width: -10,
		height: -10,
	}

   
    const rect = draw
      .rect(100, 50)
      .fill("red")
      .move(30 - 10, 20 - 2.5);

      const line = draw
              .line(100, 100, 200, 300)
              .stroke({ width: 5, color: "#FF801F" });

        rect.selectize().resize({constraint, resizeLimits});
        line.selectize({deepSelect: true}).resize({resizeLimits});
        
        rect.on("resizing.namespace", (e) => {
          //  console.log(e)
        })
  }

};
</script>

<style></style>
