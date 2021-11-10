<template>
  <page-container title="任务列表">
    <template v-slot:actions
      ><el-button
        type="default"
        size="mini"
        icon="el-icon-download
"
        @click="handleDownload"
        :loading="downloading"
        >导出数据</el-button
      ><el-button
        type="default"
        size="mini"
        @click="reload"
        icon="el-icon-refresh
"
        >刷新</el-button
      ></template
    >
    <el-form :inline="true" :model="filter" size="mini">
      <div class="filter">
        <el-form-item label="任务状态" label-width="100px">
          <el-select
            v-model="filter.includeOrderStatus"
            multiple=""
            placeholder="任务状态"
            clearable=""
            @change="handleFilterChange"
          >
            <el-option label="待接单" value="1"> </el-option>
            <el-option label="司机已接单" value="2"> </el-option>
            <el-option label="司机已到上车点" value="3"> </el-option>
            <el-option label="乘客已上车" value="4"> </el-option>
            <el-option label="到达目的地" value="5"> </el-option>
            <el-option label="已取消" value="6"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间段" label-width="100px">
          <el-date-picker
            v-model="filter.range"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleFilterChange"
          >
          </el-date-picker>
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table
        :data="orders.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="订单号" width="100" fixed="">
        </el-table-column>
        <el-table-column prop="realName" label="发起人" width="120">
        </el-table-column>
        <el-table-column prop="driverName" label="接单人" width="120">
          <template slot-scope="scope">
            {{ scope.row.driverName || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="carNumber" label="车牌号" width="120">
          <template slot-scope="scope">
            {{ scope.row.carNumber || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="orderStatusName" label="订单状态" width="100">
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="180">
        </el-table-column>
        <el-table-column prop="driverReceiveTime" label="接单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.driverReceiveTime || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="closeTime" label="结束时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.closeTime || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="upStationName" label="上车点" width="80">
          <template slot-scope="scope">
            <el-tag type="success" style="margin-right: 5px" size="mini">
              {{ scope.row.upStationName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="目的点" width="200">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              style="margin-right: 5px"
              size="mini"
              v-for="item in scope.row.downStations"
              :key="item.id"
            >
              {{ item.stationName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" width="200">
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.orderStatus != '待接单'"
              >手工分配</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="orders.total > 0"
          @current-change="handleCurrentChange"
          :current-page="orders.current"
          :page-size="filter.pageSize - 0"
          background
          layout="total,prev, pager, next"
          :total="orders.total"
        ></el-pagination>
      </div>
    </el-card>
  </page-container>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      downloading: false,
      orders: {
        total: 0,
        pageNum: 1,
        pageSize: 1,
        records: [],
      },
    };
  },
  created() {
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
    this.getOrders({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getOrders({
        ...this.$route.query,
      });
    },
    getOrders(params) {
      this.loading = true;

      if (params.range) {
        const range = params.range;
        params = {
          ...params,
          begin: range[0],
          end: range[1],
          range: undefined,
        };
      }

      this.$axios
        .get(`/api/v1/orders`, {
          params: {
            ...this.filter,
            ...params,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params);
          },
        })
        .then((res) => {
          this.orders = {
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

      this.getOrders(params);
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

      this.getOrders(params);
    },
    handleDownload() {
      this.downloading = true;
      let query = {
        ...this.filter,
        ...this.$route.query,
      };
      if (query.range) {
        const range = query.range;
        query = {
          ...query,
          begin: range[0],
          end: range[1],
          range: undefined,
        };
      }
      const url = "/api/v1/orders/export?" + qs.stringify(query);
      this.$axios
        .get(url, {
          responseType: "blob",
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "订单列表.xls";
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: err.message,
          });
        })
        .finally(() => {
          this.downloading = false;
        });
    },
  },
};
</script>

