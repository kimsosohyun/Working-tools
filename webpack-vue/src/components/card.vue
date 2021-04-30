<template>
  <div class="form-card">
      <div class="form-card-content">
           <slot name="card-content"></slot> 
      </div>   
  </div>
</template>

<script>
export default {
  name: "card",
};
</script>

<style lang="scss">
.form-card {
    padding: 6px;
    background-color: #f2f2f2; //强行为栅格系统创造边距
    .form-card-content {
      font-size: 14px;
      border: 1px solid #dcdee2;
      border-color: #e8eaec;
      border-radius: 4px;
      background: white;
      width: 100%;
      height: 100%;
      padding: 16px;
    }
    .form-card-content:hover {
      -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
      border-color: #eee;
    }
}
</style>
