<template>
  <div style="padding: 15px" v-loading="loading">
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-form-item label="">
        <div style="text-align: right">
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete()">
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              :loading="deleting"
              >删除{{ form.name }}车站</el-button
            >
          </el-popconfirm>
        </div>
      </el-form-item>
      <el-form-item label="车站名称" prop="name">
        <el-input
          type="text"
          v-model="form.name"
          :maxlength="10"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="regionIds">
        <RegionSelect v-model="form.regionIds" />
      </el-form-item>
      <el-form-item label="地理坐标" prop="remark">
        <el-tag style="margin-bottom: 5px" size="small">
          {{ form.longitude }},{{ form.latitude }}</el-tag
        >
        <el-card>
          <baidu-map
            class="map-view"
            :center="center"
            :zoom="zoom"
            @ready="handler"
            inertial-dragging
            :mapStyle="mapStyle"
            ><bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-map-type
              :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
              anchor="BMAP_ANCHOR_TOP_LEFT"
            ></bm-map-type
            ><bm-marker
              :dragging="true"
              @dragging="handleDragging"
              :icon="{
                url: getImgUrl('/img/marker.png'),
                size: { width: 32, height: 32 },
              }"
              :position="center"
              :labelStyle="{ color: 'red', fontSize: '12px', border: 0 }"
            >
              <bm-label
                :content="form.name + ''"
                :labelStyle="{
                  color: '#909399',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: '',
                  border: '0',
                  width: '10px',
                  textAlight: 'center',
                }"
                :offset="{ width: 5, height: 34 }" /></bm-marker
          ></baidu-map>
        </el-card>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入备注"
          v-model="form.remark"
          maxlength="500"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="updating"
          @click="submitForm('form')"
          >保存数据</el-button
        >
        <el-button type="info" plain @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import RegionSelect from "~/components/selects/RegionSelect";
export default {
  props: {
    id: {
      default: () => {},
    },
  },
  components: {
    RegionSelect,
  },
  data() {
    return {
      form: {
        ...(this.item || {}),
      },
      deleting: false,
      loading: true,
      center: { lng: 0, lat: 0 },
      bmap: undefined,
      zoom: 18,
      mapStyle: {
        style: "grayscale",
      },
      updating: false,
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
          },
        ],
        regionIds: [
          {
            required: true,
            message: "区域不能为空",
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    id() {
      this.loadData();
    },
  },
  methods: {
    handleClose() {
      this.$emit("cancel");
    },
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
    loadData() {
      if (!this.id) {
        return;
      }
      this.loading = true;
      this.$axios
        .get(`/api/v1/stations/${this.id}`)
        .then((res) => {
          this.form = {
            ...res.data.data,
          };
          this.center = {
            lng: this.form.longitude || 0,
            lat: this.form.latitude || 0,
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updating = true;
          this.$axios
            .post(`/api/v1/stations/${this.id}`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "更新创建",
                  type: "success",
                });
                this.showVisiable = false;
                this.$emit("success");
                this.$emit("cancel");
              }
            })
            .finally(() => {
              this.updating = false;
            });
        }
      });
    },
    handleDelete() {
      this.deleting = true;
      this.$axios
        .delete(`/api/v1/stations/${this.id}`)
        .then(() => {
          this.$emit("success");
          this.$emit("cancel");
        })
        .finally(() => {
          this.deleting = false;
        });
    },
    handleDragging({ type, target, pixel, point }) {
      this.form = {
        ...this.form,
        longitude: point.lng,
        latitude: point.lat,
      };
    },
    handler({ BMap, map }) {
      this.bmap = map;
      this.bmap.reset();
    },
  },
};
</script>

<style scoped>
.map-view {
  height: 550px;
}
</style>