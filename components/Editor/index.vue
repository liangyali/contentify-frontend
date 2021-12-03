<template>
  <div v-loading="uploading">
    <quill-editor
      ref="myQuillEditor"
      class="editor"
      :content="content"
      :options="editorOption"
      @change="onEditorChange($event)"
    >
    </quill-editor>

    <div style="display: none">
      <el-upload
        action="#"
        id="quill-upload"
        v-show="false"
        :show-file-list="false"
        :http-request="handleUpload"
        :accept="accept"
      >
        <el-progress
          style="width: 200px"
          :stroke-width="26"
          :text-inside="true"
          :percentage="percent"
          v-if="uploading"
        />
        <div v-if="!uploading" class="imgContainer">
          <img v-if="this.value" :src="value" class="avatar" />
          <div v-else>
            <i class="el-icon-upload uploader-icon"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </div>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: () => "",
    },
    upload_type: {
      type: String,
      default: () => "",
    },
  },
  watch: {
    value(html) {
      this.content = html || "";
    },
  },
  data() {
    return {
      uploading: false,
      percent: 0,
      accept: "*",
      type: "",
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],
              ["image", "video"],
              ["clean"], // remove formatting button
            ],
            handlers: {
              image: (value) => {
                if (!value) {
                  this.$refs.quill.format("image", false);
                  return;
                }
                this.type = "rs-img";
                document.querySelector("#quill-upload input").click();
              },
              video: (value) => {
                if (!value) {
                  this.$refs.quill.format("video", false);
                  return;
                }
                this.type = "rs-video";
                document.querySelector("#quill-upload input").click();
              },
            },
          },
        },
        placeholder: "",
      },
      content: this.value,
    };
  },
  methods: {
    //内容改变事件
    onEditorChange({ quill, html, text }) {
      this.$emit("input", html);
    },

    handleUpload(file) {
      const formData = new FormData();
      formData.set("file", file.file);

      this.uploading = true;
      return this.$axios({
        url: `/admin/api/v1/resources/upload?type=${this.upload_type}`,
        data: formData,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            //计算上传的进度
            this.percent = Number.parseInt(
              ((progressEvent.loaded / progressEvent.total) * 100.0).toFixed(0)
            );
          }
        },
      }).then((res) => {
        this.uploading = false;
        this.percent = 0;
        const quill = this.$refs.myQuillEditor.quill;

        if (this.type == "rs-img") {
          const length = quill.getSelection().index;
          quill.insertEmbed(length, "image", res.data.data.url);
          // Adjust the cursor to the end
          quill.setSelection(length + 1);
        }

        if (this.type == "rs-video") {
          const length = quill.getSelection().index;
          quill.insertEmbed(length, "video", res.data.data.url);
          // Adjust the cursor to the end
          quill.setSelection(length + 1);
        }
      });
    },
  },
};
</script>


<style scoped>
.editor >>> .ql-editor {
  min-height: 520px;
  max-height: 600px;
}
</style>