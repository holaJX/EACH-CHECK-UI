<template>
  <div class="id-card-wrap">
    <el-row :gutter="10" class="mb8" style="margin: 5px 0;">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="open=true"
        >添加
        </el-button>
      </el-col>
    </el-row>
    <el-card v-for="item in certificates" :key="item.certificateId" class="id-card-item">
      <div slot="header" class="clearfix">
        <span style="padding-right: 30px;">
          <span style="width: 300px">证件名称:&nbsp;{{ item.certificateName }}</span>
        </span>
        <span>证件编号:{{ item.certificateCode }}</span>
        <span style="float: right; padding: 3px 0;color: red" @click="handleItem(item.certificateId)"><i
          class="el-icon-close"></i></span>
      </div>
      <div class="id-card-picture" style="display: flex;justify-content: space-evenly">
        <img :src="getUrl(item.certificateFrontUrl)" :style="imgStyle(item.certificateBackUrl)">
        <img :src="getUrl(item.certificateBackUrl)" v-if="item.certificateType == 1" :style="imgStyle(item.certificateBackUrl)">
      </div>
    </el-card>

    <!--证件信息添加-->
    <el-dialog :close-on-click-modal="false" title="添加证件信息" :visible.sync="open" width="800px">
      <el-form>
        <el-form-item label="证件类别:" label-width="100px">
          <el-select clearable v-model="certificate.certificateType" placeholder="请选择">
            <el-option
              v-for="item in idTypes"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件编号:" label-width="100px">
          <el-input v-model="certificate.certificateCode" type="text"></el-input>
        </el-form-item>
        <el-form-item v-show="certificate.certificateType != 1" label="资格证名称:" label-width="100px">
          <el-select clearable v-model="certificate.certificateName" placeholder="请选择" @change="changeName">
            <el-option
              v-for="item in certificateTypeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="bottom clearfix" style="display: flex;justify-content: space-evenly">
          <image-upload v-model="certificate.certificateFrontUrl"></image-upload>
          <image-upload v-if="certificate.certificateType == 1" v-model="certificate.certificateBackUrl"></image-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCertificate">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {delCertificate, addCertificate} from "@/api/system/certificate";
import {getUser} from "@/api/system/user";
import ImageUpload from '@/components/ImageUpload';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {ImageUpload},
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      //证件类别
      idTypes: [],
      open: false,
      /**证件信息项*/
      certificate: {

      },
      certificateTypeOptions: [],
      /**证件信息列表*/
      certificates: [],
    };
  },
  created() {
    this.getDicts("sys_user_idtype").then(response => {
      this.idTypes = response.data;
    });
    this.getDicts("sys_user_certificate").then(response => {
      this.certificateTypeOptions = response.data;
    });
  },
  watch: {
    'user': function () {
      this.getUser()
    }
  },
  methods: {
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    imgStyle(url) {
      return url == '' ? {height: '200px', width: '100%', padding: '7px'} : {
        height: '200px',
        width: '50%',
        padding: '7px'
      };
    },
    changeName(val) {
      this.certificateTypeOptions.forEach(item => {
        if (item.dictValue == val) {
          this.certificate.certificateName = item.dictLabel;
        }
      })
    },
    getUser() {
      getUser(this.user.userId).then(response => {
        this.certificates = response.certificates;
      })
    },
    handleItem(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCertificate(id).then(res => {
          if (res.code == '200') {
            this.getUser()
          }
        })
      }).catch(() => {
      });
    },
    saveCertificate() {
      let self = this
      if (self.user.userId > 0) {
        if (self.certificate.certificateType == '1') {
          self.certificate.certificateName = '身份证'
        }
        self.certificate.userId = this.user.userId;
        addCertificate(this.certificate).then(res => {
          if (res.code == '200') {
            self.getUser()
            self.certificate = {}
            self.open = false;
          }
        })
      } else {
        self.$message({
          type: 'warning',
          message: "请先保存人员信息"
        })
      }
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({path: "/index"});
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  border-radius: 0;
  margin-bottom: 20px;
}

.id-card-wrap {
  overflow-y: scroll;
  height: 500px;
}
</style>
