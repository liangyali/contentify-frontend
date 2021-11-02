<template>
  <page-container title="车辆列表">
    <template v-slot:actions
      ><CreateFormButton
        @success="reload"
        v-permission="['manage:cars']"
      /><el-button
        type="default"
        size="mini"
        @click="reload"
        icon="el-icon-refresh
"
        >刷新</el-button
      ></template
    >
    <el-card>
      <el-table
        :data="cars.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column prop="statusName" label="车辆状态" width="100">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.status == 1">{{
              scope.row.statusName
            }}</el-tag>
            <el-tag type="danger" size="mini" v-if="scope.row.status == 2">{{
              scope.row.statusName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="carNumber" label="车牌号"> </el-table-column>
        <el-table-column prop="model" label="车型"> </el-table-column>
        <el-table-column prop="capacity" label="载客容量"> </el-table-column>
        <el-table-column prop="vkt" label="行驶公里数" width="150">
        </el-table-column>
        <el-table-column prop="lastUseAt" label="最近使用时间" width="180">
        </el-table-column>
        <el-table-column prop="companyName" label="车辆所属公司" width="200">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.updatedAt || "--" }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-permission="['manage:cars']"
              >编辑</el-button
            >
            <el-button size="mini" @click="handleShowLogs(scope.row)"
              >使用记录</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="cars.total > 0"
          @current-change="handleCurrentChange"
          :current-page="cars.current"
          :page-size="filter.pageSize"
          background
          layout="total,prev, pager, next"
          :total="cars.total"
        ></el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="编辑"
      width="650px"
      :visible.sync="showVisiable"
      direction="rtl"
      append-to-body
    >
      <UpdateForm
        :id="item.id"
        @success="reload"
        @cancel="showVisiable = false"
      />
    </el-drawer>
    <el-drawer
      title="使用记录"
      size="800px"
      :visible.sync="showLogsVisiable"
      direction="rtl"
      append-to-body
    >
      <car-use-logs
        :id="item.id"
        @success="reload"
        @cancel="showLogsVisiable = false"
      />
    </el-drawer>
  </page-container>
</template>

<script>
import qs from "qs";
import CreateFormButton from "~/components/cars/CreateFormButton";
import UpdateForm from "~/components/cars/UpdateForm";
import CarUseLogs from "~/components/cars/CarUseLogs";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      item: {},
      showVisiable: false,
      showLogsVisiable: false,
      cars: {
        total: 0,
        pageNum: 1,
        pageSize: 1,
        records: [],
      },
    };
  },
  components: {
    CreateFormButton,
    UpdateForm,
    CarUseLogs,
  },
  created() {
    this.getCars({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getCars({
        ...this.$route.query,
      });
    },
    getCars(params) {
      this.loading = true;
      this.$axios
        .get(`/api/v1/cars`, {
          params: {
            ...this.filter,
            ...this.$route.params,
            ...params,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params);
          },
        })
        .then((res) => {
          this.cars = {
            ...res.data.data,
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      const params = {
        ...this.$route.query,
        page: val,
      };
      this.$router.push({
        path: "",
        query: params,
      });

      this.getCars(params);
    },
    handleFilterChange() {
      const params = {
        ...this.$route.query,
        ...this.filter,
        page: 1,
      };
      this.$router.push({
        path: "",
        query: params,
      });

      this.getCars(params);
    },
    handleEdit(row) {
      this.item = row;
      this.showVisiable = true;
    },
    handleShowLogs(row) {
      this.item = row;
      this.showLogsVisiable = true;
    },
  },
};
</script>

