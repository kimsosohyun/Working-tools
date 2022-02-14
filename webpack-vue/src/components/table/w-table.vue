<template>
  <div class="table">
    <slot></slot>
    <!-- <ul class="table-header">
      <li v-for="(col, index) in colInstance" :key="index" :style="{width: col.width, background:'red'}">
        {{col.label}}
      </li>
    </ul> -->
    <table class="table-main">
      <thead>
        <tr>
          <th v-for="(col, index) in colInstance" :key="index" :style="{ width: col.width }">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(trData, index1) in data" :key="index1">
          <td v-for="(col, index2) in colInstance" :key="index2">
            {{ trData | formatValue(index2, colInstance) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  name: "w-table",
  data() {
    return {
      colInstance: []
    };
  },
  filters: {
    formatValue(val, index, colInstance) {
     
      
      const key = colInstance[index].prop;
        console.log(val, index, key, this)
        

      return val[key];
    }
  },
  mounted() {
    const cols = this.$slots.default.filter((item) => {
      return item.tag && item.componentOptions.Ctor.options.name === "w-table-col";
    });
    this.colInstance = cols.map((item) => item.componentInstance);
    console.log(this.colInstance);
  }
};
</script>

<style lang="scss">
.table {
  width: 900px;
  .table-main {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: center;
    width: 100%;
    table-layout: fixed;
  }
}
</style>
