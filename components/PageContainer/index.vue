<template>
  <div>
    <div class="sub-header">
      <div class="sub-title">{{ title }}</div>
      <div class="actions"><slot name="actions" /></div>
    </div>
    <div :class="padding ? 'content' : 'content-no-padding'">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: () => "",
    },
    padding: {
      default: () => true,
    },
  },
};
</script>

<style scoped>
.sub-header {
  line-height: 50px;
  background: #fff;
  font-size: 14px;
  padding-left: 20px;
  border-bottom: 1px solid #e5e9f2;
  display: flex;
  flex-direction: row;
  position: relative;
  top: 0px;
  z-index: 1000;
}
.sub-title {
  flex: 1;
}
.content {
  padding: 20px;
}
.content-no-padding {
  padding: 0px;
}
.actions {
  min-width: 100px;
  padding-right: 20px;
}
</style>