<template>
  <div class="period-box" :style="{ width: `${width}px` }" v-show="show">
    <header class="time-header">
      <label class="time-title">{{ title }}</label>
      <i data-item="icon" class="v-icon-close" @click="$emit('hide')"></i>
    </header>
    <section class="time-content">
      <slot></slot>
    </section>
    <footer class="time-footer">
      <v-button @click="$emit('cancel')" type="info">{{ cancelText }}</v-button>
      <v-button @click="$emit('submit')" type="primary">{{ _("OK") }}</v-button>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: { type: String },
    show: {
      type: Boolean,
      default: false
    },
    width: {
      default: 260
    },
    cancelText: {
      default: _("Delete")
    }
  }
};
</script>

<style lang="scss">
.period-box {
  width: 252px;
  background: #fff;
  padding: 16px;
  position: absolute;
  z-index: 100;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  &:after {
    content: "";
    position: absolute;
    border: 6px solid transparent;
  }

  .time-header {
    height: 22px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-bottom: 12px;

    i {
      cursor: pointer;
    }
  }

  .time-footer {
    text-align: right;
  }
}
</style>
