<template>
  <div>
    <div>
      <w-table :data="tableData">
        <w-table-col prop="ssid" label="SSID" width="100px"></w-table-col>
        <w-table-col prop="id" label="id"></w-table-col>
        <w-table-col prop="name" label="name"></w-table-col>
        <w-table-col prop="age" label="age"></w-table-col>
        <w-table-col prop="gender" label="gender"></w-table-col>
      </w-table>

      <v-table :data="tableData">
        <v-table-col prop="ssid" label="SSID" width="20px"></v-table-col>
        <v-table-col prop="id" label="id"></v-table-col>
        <v-table-col prop="name" label="name"></v-table-col>
        <v-table-col prop="age" label="age"></v-table-col>
        <v-table-col prop="gender" label="gender"></v-table-col>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          ssid: "ssid1",
          id: "1",
          name: "jack",
          age: "12",
          gender: "男"
        },
        {
          name: "tom",
          age: "22",
          gender: "女",
          ssid: "ssid2",
          id: "2"
        }
      ]
    };
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss">
.date-list {
  width: 700px;
  li {
    width: 96px;
    height: 96px;
    float: left;
    border: 1px solid black;
    margin: 2px;
    box-sizing: border-box;
    text-align: center;
    line-height: 96px;
  }
}
.pre,
.next {
  color: #d8d8d8;
}
.day-now {
  background: pink;
}
</style>
