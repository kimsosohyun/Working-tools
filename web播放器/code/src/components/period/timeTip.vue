<template>
  <i class="timetip-text"><slot></slot></i>
</template>

<style lang="scss">
.timetip-text {
  height: 32px;
  font-size: 14px;
  position: absolute;
  top: -38px;
  line-height: 32px;
  font-style: normal;
  color: #fff;
  background-color: #000;
  padding: 0 8px;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
  cursor: default;
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    border: 5px solid transparent;
    border-width: 6px 5px;
    border-top-color: #000;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
