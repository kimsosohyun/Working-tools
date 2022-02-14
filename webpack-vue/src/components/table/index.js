import Table from "./w-table";
import TableCol from "./w-table-col";

//用于按需引入
Table.install = function (Vue) {
  Vue.component(Table.name, Table);
  Vue.component(TableCol.name, TableCol);
};

export default Table;

export {
  Table,
  TableCol
}