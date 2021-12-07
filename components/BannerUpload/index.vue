<template>
  <div class="img-upload">
    <el-upload
      action="#"
      :show-file-list="false"
      :http-request="handleUpload"
      accept=".jpg,.png,.jpeg,.svg"
      drag
      :on-progress="handleUploadProcess"
    >
      <el-progress
        style="width: 100%"
        :stroke-width="26"
        :text-inside="true"
        :percentage="percent"
        :format="(value) => value.toFixed(2) + '%'"
        v-if="uploading"
      />
      <div v-if="!uploading" class="imgContainer">
        <img v-if="value" :src="value" class="avatar" />
        <div v-else>
          <i class="el-icon-upload uploader-icon"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em><br />1920*600
          </div>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ["type", "value"],
  watch: {},
  data() {
    return {
      percent: 0,
      uploading: false,
    };
  },
  computed: {},
  methods: {
    /**
     * 处理上传文件
     */
    handleUpload(file) {
      const formData = new FormData();
      formData.set("file", file.file);

      this.uploading = true;
      return this.$axios({
        url: `/admin/api/v1/resources/upload?type=${this.type}`,
        data: formData,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            //计算上传的进度
            this.percent = (progressEvent.loaded / progressEvent.total) * 100.0;
          }
        },
      }).then((res) => {
        this.uploading = false;
        this.percent = 0;
        this.$emit("input", res.data.data.url);
      });
    },
    handleUploadProcess(event, file) {
      this.percent = Number(file.percentage.toFixed(0));
    },
  },
};
</script>

<style scoped>
.img-upload >>> .el-upload {
  display: flex;
}
.img-upload >>> .el-upload-dragger {
  border: 2px dashed #dcdfe6;
  background: #f2f4f6;
  justify-content: center;
  align-content: center;
  display: flex;
  flex-direction: column;
  width: 576px;
}

.img-upload >>> .el-upload-dragger:hover {
  border: 2px dashed #c6ccd8;
  background: #e3e6e9;
}

.imgContainer img {
  height: 180px;
}

.uploader-icon {
  font-size: 40px;
}

.el-upload__text {
  font-size: 14px;
}

.loading {
  position: absolute;
  color: #000;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>
