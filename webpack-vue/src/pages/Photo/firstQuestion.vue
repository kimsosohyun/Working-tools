<template>
  <div class="text">
    <div class="left">
      <img class="cyberpunk" v-if="text === 1" src="../../assets/img/match/region-1.jpg" alt="" />
      <img class="cyberpunk" v-if="text === 1" src="../../assets/img/match/region-2.jpg" alt="" />

      <img v-if="text === 2" src="../../assets/img/match/statistics-1.jpg" alt="" />
      <img v-if="text === 2" src="../../assets/img/match/statistics-2.jpg" alt="" />
    </div>
    <div class="right">
      <div v-if="text === 1" class="box box-text1" ref="box">
        <h2 class="cyberpunk">解题思路</h2>
        <div>
          <span class="cyberpunk dotted">主要难点（可优化点）：</span>
          <div>
            <span class="cyberpunk inverse"
              >1、密码本数据存储问题：
              将密码本数据使用哈希表存储：KEY是一个范围，不方便存储。可以把起始地址作为KEY存入hash表。在input.txt中拿到地址x后。用x作为key去hash表中查找，每次查找后-1然后继续查找，直到查询到目标值。把第一行的数据和最后一行的数据单独拎出来处理。原因是跨度大，方便读取，而且都是同一个地区。然后从中间开始读，与输入值进行对比。
              <br />
              2、空间复杂度：如果将密码本数据全部读取出来，数据量太大了，影响性能，空间复杂度会很高。
              <br />
              3、时间复杂度：需要解码的地点很多的情况下，会进行大量查询操作。 时间和空间复杂度难以兼得
            </span>

            <div>
              <span class="cyberpunk dotted">最终思路：</span>
              <div>
                <span class="cyberpunk inverse"
                  >思路1：
                  由于密码本的第一个数据都是从小到大排列的，不用进行排序。将密码本数据全部存储起来，后续使用二分查找进行查询。
                  <br />
                  优点：对密码本的操作只需要进行一遍
                  <br />
                  缺点：空间复杂度最大
                </span>

                <div>
                  <span class="cyberpunk inverse">
                    思路2： 将密码本分成600块：每一千行为一块， 数据结构1：复用一块内存； 数据结构2：存储600块的起始地址
                    ； 根据数据的地址进行查找在那一块中，再在块中使用二分查找进行搜索。
                    <br />
                    优点：降低空间复杂度
                    <br />
                    缺点：对文件的操作增多了，可能会增加时间复杂度
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="box" ref="box">
        <h2>解题思路</h2>
        <div>
          <span>
            思路：
          </span>
          <div>
            <span>
              将每条地铁线路上的车站看成一个节点，同一线路上的节点（车站）可以相互连通，没有方向，权重为1。 例如：lines
              = [[1,3,8],[2,7,8],[2,4,5],[5,7,9]]，可以转换为图的形式：如果src = 1, dest =
              9，问题转化为从起点1到终点9的最短路径问题，也就是求权值为1的无向图的最短路径问题，初步讨论可以使用Dijkstra算法、广度优先搜索（BFS）算法实现。
            </span>
            <div>
              <span>
                另外，和一般的图搜索不同的地方在于：
              </span>
              <div>
                <span>
                  1、[1,3,8]不管怎么走都算一条线路，也就是说1 -> 3 -> 8 -> 7 -> 9和1 -> 8 -> 7 ->
                  9是一样的，都是经过三条线路。
                </span>
                <div>
                  <span>
                    2、存在起点位于多条线路的情况，比如src = 8, dest = 9，最优结果应该是2
                  </span>
                  <div>
                    <span>
                      总结：
                    </span>
                    <div>
                      <span>
                        对于BFS算法，知道起点和终点的情况下，可以使用双向BFS来提高搜索效率，这可以是一个优化方案。将输入数组存储为图的形式，根据python语言的经验，最好的方式应该是存入一个字典中，将路线作为key值，车站为value。使用BFS算法求最短路径，注意一条地铁线路算一辆地铁，可能需要一个变量来存储它。
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.setAnimation();
  },
  methods: {
    setAnimation() {
      const box = this.$refs.box;
      const h2 = box.getElementsByTagName("h2")[0];
      const divs = box.getElementsByTagName("div");
      const spans = box.getElementsByTagName("span");

      let timer1 = null;
      let off = true;

      if (off) {
        let i = 0;
        clearInterval(timer1);
        timer1 = setInterval(function() {
          divs[i].className = "open";
          i++;
          if (i == divs.length) {
            clearInterval(timer1);
            off = false;
            for (let j = 0; j < spans.length; j++) {
              spans[j].style.transition = ".2s";
            }
            h2.style.transition = ".2s";

            box.onmouseover = function(ev) {
              if (ev.clientX - box.getBoundingClientRect().left > spans[0].offsetWidth / 2) {
                h2.style.WebkitTransform = "rotateY(4deg)";
                for (let j = 0; j < spans.length; j++) {
                  spans[j].style.WebkitTransform = "rotateY(4deg)";
                }
              } else {
                h2.style.WebkitTransform = "rotateY(-4deg)";
                for (let j = 0; j < spans.length; j++) {
                  spans[j].style.WebkitTransform = "rotateY(-4deg)";
                }
              }
            };

            box.onmouseout = function() {
              h2.style.WebkitTransform = "rotateY(0deg)";
              for (let j = 0; j < spans.length; j++) {
                spans[j].style.WebkitTransform = "rotateY(0deg)";
              }
            };
          }
        }, 100);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1200px;
}
.left {
  float: left;
  width: 40%;
  height: 100%;
  min-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.right {
  float: right;
  width: 60%;
  height: 100%;
}
img {
  width: 400px;
  height: 200px;
  border: 5px solid rgba(34, 114, 216, 1);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8), inset 0 0 5px rgba(0, 0, 0, 0.4);
}

.box {
  width: 600px;
  /*height: 500px;*/
  /*background: orange;*/
  margin: 0 auto;
  position: relative;
  perspective: 400px;
  transform-style: preserve-3d;
}
.box h2 {
  font-family: "Microsoft JhengHei";
  transform-origin: top;
  /*-webkit-transform:rotateY(4deg);*/
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0;
  margin: 0;
  display: block;
  color: white;
  font-weight: bold;
  // border: 2px solid black;
  // box-sizing: border-box;
  // height: 50px;
  // line-height: 50px;
  font-size: 20px;
  letter-spacing: 20px;
  text-align: center;
  // background: orange;
}
.box div {
  -webkit-transform: rotateX(-120deg);
  transform-origin: top;
  position: absolute;
  z-index: 1;
  margin-top: 2px;
  // top: 40px;
  opacity: 0;
  width: 100%;
  height: 30px;
  text-indent: 6px;
  transform-style: preserve-3d;
}
.strong {
  color: red !important;
  // font-weight: bold;
}

.box .open {
  opacity: 1;
  animation: 2s open linear;
  animation-fill-mode: forwards;
}
.open span:nth-of-type(1) {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
}
.down {
  animation: 0.8s down linear;
  animation-fill-mode: forwards;
}
.down span:nth-of-type(1) {
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 1);
}

.box div span {
  transform-origin: top;
  // background: rgba(238, 238, 238, 1);
  transition: 0.3s;
  display: block;
  width: 100%;
  color: #fff;
  line-height: 20px;
  font-size: 16px;
  font-family: "Microsoft JhengHei";
  // box-shadow: inset 0 0 10px rgba(0, 0, 0, 1);
}
.box span:hover {
  background: rgb(37, 163, 150);
  text-indent: 20px;
  font-style: italic;
}
#end span {
  letter-spacing: 95px;
}
#end span:hover {
  background: rgb(37, 163, 150);
  text-indent: -2px;
  font-style: normal;
  color: red;
  font-weight: bold;
  font-size: 24px;
}

@keyframes open {
  0% {
    -webkit-transform: rotateX(-50deg);
  }

  20% {
    -webkit-transform: rotateX(-30deg);
  }
  40% {
    -webkit-transform: rotateX(0deg);
  }
  60% {
    -webkit-transform: rotateX(20deg);
  }
  80% {
    -webkit-transform: rotateX(-20deg);
  }
  100% {
    -webkit-transform: rotateX(0deg);
  }
}
@keyframes down {
  0% {
    -webkit-transform: rotateX(0deg);
  }

  100% {
    -webkit-transform: rotateX(-120deg);
  }
}
</style>
