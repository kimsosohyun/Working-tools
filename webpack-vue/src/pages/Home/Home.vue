<template>
  <div class="div">
    <div class="title">
      <img src="../../assets/img/tenda-logo.png" alt="" />
    </div>
    <Card>
      <div slot="card-content">
        my vue
      </div>
    </Card>
    <Card>
      <div slot="card-content">
        <Tabs :tabKey="['NODE', 'WEBPACK']" :tabValue="['value1', 'value2']">
          <div slot="value1" class="value1">
            <span>
              webpack
              <i class="icon-vertical-view"></i>
            </span>
          </div>
          <div slot="value2" class="value2">
            <span>let”s go</span>
            <img src="../../assets/img/kim.png" alt="" />
          </div>
        </Tabs>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/test/card";
import Tabs from "@/components/test/tabs";

export default {
  name: "Home",
  components: {
    Card,
    Tabs
  }
};
</script>

<style lang="scss" scoped>
$red: red;
.div {
  width: 800px;
  overflow: hidden;
  margin: 200px auto;
  background-size: contain;
  transform: rotate(10deg);
  border: 10px solid $pink;
   .title {
    width: 215px;
    height: 68px;
    margin: 0 auto;
    img {
      margin: 10px 0;
    }
  }
}
.value1 {
  color: white;
  width: 100%;
  height: 100%;
  background: url("../../assets/img/test.jpg") no-repeat;
  background-size: cover;
  text-align: center;
  span {
    line-height: 330px;
    font-size: 32px;
  }
}
.value2 {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  span {
    position: relative;
    color: white;
    z-index: 1;
    line-height: 330px;
    font-size: 32px;
  }
  img {
    z-index: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
    filter: blur(1px);
  }
}
</style>
