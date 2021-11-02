<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >添加车站</el-button
    >
    <el-drawer
      title="添加车站"
      size="90%"
      :visible.sync="showVisiable"
      direction="rtl"
      :rules="rules"
      append-to-body
    >
      <div style="padding: 15px">
        <el-form
          :model="form"
          status-icon
          ref="form"
          :rules="rules"
          label-width="100px"
          size="small"
        >
          <el-form-item label="车站名称" prop="name">
            <el-input
              type="text"
              v-model="form.name"
              :maxlength="10"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属区域" prop="regionIds">
            <RegionSelect v-model="form.regionIds" />
          </el-form-item>
          <el-form-item label="地理坐标" prop="remark">
            <el-tag size="small" style="margin-bottom: 5px"
              >{{ form.longitude }},{{ form.latitude }}</el-tag
            >
            <el-card>
              <baidu-map
                class="map-view"
                :center="center"
                :zoom="zoom"
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
                    url: '/img/marker.png',
                    size: { width: 32, height: 32 },
                  }"
                  :position="{ lng: form.longitude, lat: form.latitude }"
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
              :loading="creating"
              @click="submitForm('form')"
              >保存数据</el-button
            >
            <el-button type="info" plain @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import RegionSelect from "~/components/selects/RegionSelect";

export default {
  components: {},
  data() {
    return {
      showVisiable: false,
      form: {
        name: "",
        longitude: 116.60958198060929,
        latitude: 40.086415358916604,
      },
      mapStyle: {
        style: "grayscale",
      },
      creating: false,
      center: { lng: 116.60958198060929, lat: 40.086415358916604 },
      zoom: 18,
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
  components: {
    RegionSelect,
  },
  methods: {
    handleClose() {
      this.showVisiable = false;
      this.$emit("cancel");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true;
          this.$axios
            .post(`/api/v1/stations`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "成功创建",
                  type: "success",
                });
                this.form = {
                  longitude: 116.60958198060929,
                  latitude: 40.086415358916604,
                };
                this.showVisiable = false;
                this.$emit("success");
              }
            })
            .finally(() => {
              this.creating = false;
            });
        }
      });
    },
    handleDragging({ type, target, pixel, point }) {
      console.log(point);
      this.form = {
        ...this.form,
        longitude: point.lng,
        latitude: point.lat,
      };
    },
  },
};
</script>

<style scoped>
.map-view {
  height: 550px;
}
</style>