<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ 'station-marker': true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div class="marker-di">&nbsp;</div>
    <div class="text" @click="handleClick">{{ title }}</div>
  </bm-overlay>
</template>

<script>
export default {
  props: ["text", "position", "active", "title", "type"],
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true,
    },
  },
  methods: {
    handleClick() {},
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 40 + "px";
      el.style.top = pixel.y - 27 + "px";
      el.style.backgroundColor = this.type == "up" ? "rgb(0, 102, 22)" : "red";
    },
  },
};
</script>

<style scoped>
.station-marker {
  width: 80px;
  height: 25px;
  color: rgb(253, 251, 251);
  border-radius: 15px;
  text-align: center;
  padding: 10px;
  position: absolute;
  opacity: 1 !important;
  border: 2px solid rgb(0, 102, 22);
  font-size: 14px;
  z-index: 2000;
}
.text {
  line-height: 30px;
  position: relative;
  top: -15px;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
}
.marker-di {
  width: 2px;
  background: rgb(0, 102, 22);
  position: absolute;
  top: 20px;
  left: 40px;
  line-height: 30px;
}
</style>