<template>
  <div class="w-tabs">
    <div class="tab-nav">
      <div class="tab-nav_link">
        <span></span>
      </div>
      <div class="tab-nav_border"></div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "w-tabs"
}
</script>

<style>

</style>