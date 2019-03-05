<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('information.nickname')"
        v-model="listQuery.nickname"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('information.playerId')" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('information.nickname')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('information.serverName')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serverName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('information.channelName')" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('information.registerDate')" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.accountStatus === 'sealAccount'"
            type="danger"
          >{{ $t('information.sealAccountTag') }}</el-tag>
          <el-tag
            v-if="scope.row.chatStatus === 'forbidChat'"
            type="danger"
          >{{ $t('information.forbidChatTag') }}</el-tag>
          <el-tag
            v-if="scope.row.chatStatus !== 'forbidChat' && scope.row.accountStatus !== 'sealAccount'"
            type="success"
          >{{ $t('information.normal') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleSendEmail(scope.row)"
          >{{ $t('information.sendEmail') }}</el-button>
          <el-button
            v-if="scope.row.accountStatus == 'unsealAccount'"
            size="mini"
            type="danger"
            @click="handleSealAccount(scope.row,'sealAccount')"
          >{{ $t('information.sealAccount') }}</el-button>
          <el-button
            v-if="scope.row.accountStatus == 'sealAccount'"
            size="mini"
            type="success"
            @click="handleSealAccount(scope.row,'unsealAccount')"
          >{{ $t('information.unsealAccount') }}</el-button>
          <el-button
            v-if="scope.row.chatStatus == 'allowChat'"
            size="mini"
            type="danger"
            @click="handleForbidChat(scope.row,'forbidChat')"
          >{{ $t('information.forbidChat') }}</el-button>
          <el-button
            v-if="scope.row.chatStatus == 'forbidChat'"
            size="mini"
            type="success"
            @click="handleForbidChat(scope.row,'allowChat')"
          >{{ $t('information.allowChat') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.remark"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPlayerList } from "~/api/information";
import Pagination from "~/components/Pagination";

export default {
  name: "PlayerInfomation",
  components: { Pagination },
  head() {
    return {
      meta: [{ name: "PlayerInfomation", content: "玩家信息" }]
    };
  },
  filters: {
    accountStatusFilter(status) {
      const statusMap = {
        unsealAccount: "success",
        sealAccount: "danger"
      };
      return statusMap[status];
    },
    chatStatusFilter(status) {
      const statusMap = {
        allowChat: "success",
        forbidChat: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined
      },
      statusOptions: ["published", "draft", "deleted"],
      temp: {
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      dialogFormVisible: false,
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$axios(fetchPlayerList(this.listQuery))
        .then(response => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          // console.log(err);
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSealAccount(row, status) {
      // TODO: 处理封号
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleForbidChat(row, status) {
      // TODO: 处理禁言
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleSendEmail(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDownload() {
      // TODO: 到处表格
      // this.downloadLoading = true;
      // import("@/vendor/Export2Excel").then(excel => {
      //   const tHeader = ["timestamp", "title", "type", "status"];
      //   const filterVal = ["timestamp", "title", "type", "status"];
      //   const data = this.formatJson(filterVal, this.list);
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: "table-list"
      //   });
      //   this.downloadLoading = false;
      // });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
