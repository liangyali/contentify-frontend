<template>
  <section class="container">
    <div style="margin-top: -150px">
      <img :src="getImgUrl('/img/logo.png')" height="60" />
    </div>
    <div class="t-title">来巴 Line Bus</div>
  </section>
</template>

<script>
export default {
  methods: {
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  /* background: #fff; */
  flex-direction: column;
  height: 100%;
  flex: auto;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.t-title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 30px;
  color: #35495e;
  margin-top: 20px;
  letter-spacing: 1px;
}
</style>
