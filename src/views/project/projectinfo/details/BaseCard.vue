<template>
  <div class="app-container">
    <div>
      <div class="card">
        <el-card class="box-card">
          <div class="text item">
            <el-form ref="baseForm" class="hl-form" :model="form" :rules="rules" label-width="120px">
              <el-row :gutter="40">
                                <el-col :span="8">
                                  <el-form-item label="单位名称：" prop="deptName">
                                    <el-input readonly class="hl-input" v-model="form.deptName" placeholder="请输入单位名称"/>
                                  </el-form-item>
                                </el-col>
                <el-col :span="8">
                  <el-form-item label="行政区域：" prop="districtCodeDictLabel">
                    <el-input readonly class="hl-input" v-model="form.districtCodeDictLabel" placeholder=""/>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="详细地址：" prop="detailedAddress">
                    <el-input readonly class="hl-input" v-model="form.detailedAddress" placeholder=""/>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="上级单位：" prop="parentName">
                    <el-input readonly class="hl-input" v-model="form.parentName" placeholder="请输入上级单位">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
<!--                  <el-form-item label="行业类别：" prop="industryType">-->
<!--                    <hl-select class="hl-select" style="width: 80%" v-model="form.industryType"-->
<!--                               :dict-code="'industry_type'" placeholder="请选择行业类别" clearable></hl-select>-->
<!--                  </el-form-item>-->
                  <el-form-item label="行业类别：" prop="industryType">
                    <treeselect v-model="form.industryType" :options="placeOptions" :value-consists-of="valueConsistsOf" :normalizer="placeNormalizer" :multiple="multiple" placeholder="请选择行业类别" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="职工总数：" prop="workerNum">
                    <el-input  class="hl-input" v-model="form.workerNum" placeholder="请输入上级单位"/>

                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="消防监管单位：" prop="fireSupervise">
                    <el-input class="hl-input" v-model="form.fireSupervise" placeholder="请输入消防监管单位">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="占地面积：" prop="coversArea">
                    <el-input class="hl-input" v-model="form.coversArea" placeholder="请输入占地面积">
                      <template slot="append">m<sup>2</sup></template>
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="总建筑面积：" prop="buildArea">
                    <el-input class="hl-input" v-model="form.buildArea" placeholder="请输入总建筑面积">
                      <template slot="append">m<sup>2</sup></template>
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="单位类型：" prop="deptType">
                    <treeselect v-model="form.deptType" :options="deptOptions" value-consists-of="BRANCH_PRIORITY" :normalizer="deptNormalizer" :multiple="true" placeholder="请选择单位类型" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="创建人：">
                    <el-input :disabled="true" v-model="form.createBy" class="hl-input" placeholder="请输入创建人"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="创建时间：">
                    <el-input :disabled="true" v-model="form.createTime" class="hl-input" placeholder="请输入创建人"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="单位照片：">
                    <imageUpload v-model="form.deptImage" :fileSize="fileSize"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>

    <div class="dialog-footer">
      <el-button  type="primary" class="hl-btn"
                 :loading="loading" @click="submitForm">完 善
      </el-button>
<!--      <el-button v-if="deptId != '' " type="primary" class="hl-btn" v-hasPermi="['project:projectinfo:edit']"-->
<!--                 :loading="loading" @click="submitForm">确 定-->
<!--      </el-button>-->
    </div>

    <el-dialog :close-on-click-modal="false" width="75%" title="地图定位" :visible.sync="showMap">
      <hl-map :addr="form.detailAddress" :show-map="showMap" @map-info="getMapInfo"></hl-map>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getTreeItems, listDept, searchDept} from "@/api/system/dept";
import HlMap from '@/components/HlMap';
import ImageUpload from '@/components/ImageUpload';
import HlRegion from '@/components/HlRegion';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getSocialdept, updateSocialdept, addSocialdept} from "@/api/project/socialdept";
import {getDept} from "@/api/system/dept";
import {isNotNull} from "@/utils/stringUtil";
import { listCompany } from "@/api/project/company";
export default {
  name: "BaseCard",
  components: {
    ImageUpload,
    Treeselect,
    HlMap,
    HlRegion
  },
  props: {
    operater: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      deptOptions:[],
      fileSize: 1,
      form: {},
      socialDeptId: null,
      serviceSearchStr: '',
      rules: {
        name: [
          {required: true, message: '请输入工程名称', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请选择工程地址', trigger: 'blur'}
        ],
        detailAddress: [
          {required: true, message: '请输入详细地址', trigger: 'blur'}
        ],
        longitude: [
          {required: true, message: '请输入经度', trigger: 'blur'}
        ],
        latitude: [
          {required: true, message: '请输入纬度', trigger: 'blur'}
        ],
        investment: [
          {
            pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/,
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        developmentOrgan: [
          {required: true, message: '请输入建设单位', trigger: 'blur'}
        ],
        developmentLeader: [
          {required: true, message: '项目负责人', trigger: 'blur'}
        ],
        developmentLeaderphone: [
          {required: true, message: '联系电话', trigger: 'blur'}
        ],
        acceptanceOrgan: [
          {required: true, message: '请输入验收单位', trigger: 'blur'}
        ],
        acceptanceLeader: [
          {required: true, message: '请输入验收单位负责人', trigger: 'blur'}
        ],
        acceptanceLeaderphone: [
          {required: true, message: '请输入验收单位电话号码', trigger: 'blur'}
        ],

      },
      loading: false,
      developmentOrganOptions: [],
      serviceOrganOptions: [],
      acceptanceOrganOptions: [],
      /** 特殊建设工程详情显示状态 */
      showSpecialSituation: false,
      specialSituationOption: [],
      specialSituationList: [],
      specialSituationProps: {
        label: 'name',
        id: 'specialId'
      },
      /** 高德地图定位 */
      showMap: false
    }
  },
  mounted() {
    this.initForm();
    this.getTreeSelect();
  },
  methods: {

    /** 查询部门下拉树结构 */
    getTreeSelect() {
      listCompany().then(response => {
        this.deptOptions = [];
        const data = { companyId: 0, name: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "companyId", "parentId");
        this.deptOptions.push(data);
      });
    },
    /** 转换单位类型数据结构 */
    deptNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.companyId,
        label: node.name,
        children: node.children
      };
    },
    getCheckedNodeIds() {
      let specialIds = '';
      let specialLabel = '';
      let specialList = []
      this.$refs.specialSituationTree.getCheckedNodes().forEach(item => {
        specialList.push(item)
      })
      this.$refs.specialSituationTree.getHalfCheckedNodes().forEach(item => {
        specialList.push(item)
      })
      specialList.forEach(pItem => {
        if (pItem.parentId == 0) {
          specialLabel += pItem.name + ',';
          specialList.forEach(cItem => {
            if (cItem.parentId == pItem.specialId) {
              specialIds += cItem.specialId + ',';
              specialLabel += cItem.name + ',';
            }
          })
        }
      })
      this.form.specialSituation = specialIds.slice(0, specialIds.length - 1);
      this.form.specialSituationDictLabel = specialLabel.slice(0, specialLabel.length - 1);
      this.showSpecialSituation = false
    },
    getMapInfo(data) {
      this.form.longitude = data.lng;
      this.form.latitude = data.lat;
      this.form.detailAddress = data.addr;
      this.showMap = false
    },
    initForm() {
      if (this.deptId != '') {
        getSocialdept(this.deptId).then(respose => {
          this.form = respose.data;
          this.form.deptType = respose.data.deptType.split(',');
        })
      }
    },
    reset() {
      this.form = {
        deptId: null,
        parentId: null,
        ancestors: null,
        serviceDeptIds: null,
        deptType: null,
        deptName: null,
        orderNum: null,
        leader: null,
        phone: null,
        districtCode: null,
        detailedAddress: null,
        creditCode: null,
        parentName: null,
        industryType: null,
        coversArea: null,
        buildArea: null,
        workerNum: null,
        fireSupervise: null,
        deptImage: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        delFlag: null,
        state: null
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form)
      let valid = true;
      if (valid) {
        this.loading = true
        if (this.form.socialDeptId != null) {
          this.form.deptType=this.form.deptType.join(',');
          updateSocialdept(this.form).then(response => {
            this.msgSuccess("修改成功");
            this.form = response.data;
            this.$router.go(0)
            this.loading = false;
          });
        } else {
          this.form.deptType=this.form.deptType.join(',');
          addSocialdept(this.form).then(response => {
            this.msgSuccess("新增成功");
            this.form = response.data;
            // this.$store.commit('SET_PROJECT_ID', this.form.deptId);
            this.$router.go(0)
            this.loading = false;
          });
        }
      }
    },


    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
    },
    getDevelopmentDepts() {
      getTreeItems({parentId: 100}).then(response => {
        this.developmentOrganOptions = response.data
      });
    },
    getAcceptanceDepts() {
      getTreeItems({parentId: 200, code: this.form.address}).then(response => {
        this.acceptanceOrganOptions = response.data
      });
    }
  },
  watch: {
    'deptId': function (newVal, oldVal) {
      console.log(newVal)
      if (newVal != '') {
        this.initForm();
      } else {
        this.reset()
        this.districtCode = []
      }
    },
  },
  computed: {
    ...mapState({
      deptId: state => state.project.deptId
    })
  },
}
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
}

.el-card {
  box-shadow: none;
  border-radius: 0;
  border: 0;

  .el-card__body {
    padding: 0;
  }

  .dialog-footer {
    display: flex;
    height: 40px;
    padding-top: 6px;

    background-color: white;
    justify-content: center;
  }
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 12px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  //-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: white;
  //-webkit-box-shadow:inset006pxrgba(0,0,0,1);
}

::-webkit-scrollbar-thumb:window-inactive {
  background: white;
}
</style>
