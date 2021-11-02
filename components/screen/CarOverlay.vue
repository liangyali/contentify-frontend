<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ 'station-marker': true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div class="marker-di">&nbsp;</div>
    <div class="container">
      <div class="icon"><img :src="getImgUrl('/img/che.png')" /></div>
      <div class="text-container" @click="handleClick">
        <div class="text">{{ title }}</div>
        <div class="text">测试</div>
      </div>
    </div>
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
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
    handleClick() {
      global.alert("Well done.");
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 40 + "px";
      el.style.top = pixel.y - 27 + "px";
      el.style.backgroundColor = "#fff";
    },
  },
};
</script>

<style scoped>
.station-marker {
  width: 120px;
  height: 45px;
  color: rgb(12, 11, 11);
  border-radius: 25px;
  text-align: center;
  position: absolute;
  border: 2px solid rgb(0, 102, 22);
  font-size: 14px;
  z-index: 2000;
}
.container {
  display: flex;
  padding: 5px;
}
.icon {
  display: flex;
  width: 32px;
  height: 32px;
}
.text-container {
  display: flex;
  padding-left: 5px;
  font-size: 10px;
  font-weight: 600;
  flex-direction: column;
}
.text-container .text {
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
}
.marker-di {
  width: 2px;
  background: rgb(0, 102, 22);
  position: absolute;
  top: 42px;
  left: 60px;
  line-height: 15px;
}
</style>