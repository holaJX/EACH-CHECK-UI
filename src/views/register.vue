<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" label-width="160px">
      <el-card class="box-card">
        <div slot="header">
          <div class="d-flex flex-items-center">
            单位信息
            <div style="font-size: 8px;color: red; margin-left: 5px">(请确保填写得信息真实有效)</div>
          </div>
        </div>
        <div class="item">
          <el-row>
            <el-col :span="24">
              <el-form-item label="单位类型" prop="parentId">
                <el-radio-group v-model="registerForm.parentId">
                  <el-radio
                    v-for="item in companyTypes"
                    :key="item.value"
                    :label="item.value">{{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="单位名称" prop="deptName">
                <el-input v-model="registerForm.deptName" placeholder="请输入单位全名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="行政区域" prop="districtCode">
                <hl-region v-model="registerForm.districtCode" style="width: 100%" placeholder="请输入单位所在区域"/>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="详细地址" prop="detailedAddress">
                <el-input v-model="registerForm.detailedAddress" placeholder="请输入单位具体地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="联系人员" prop="leader">
                <el-input v-model="registerForm.leader" placeholder="请输入单位消防联系人员"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="registerForm.phone" placeholder="请输入联系人手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="统一社会信用代码" prop="creditCode">
                <el-input v-model="registerForm.creditCode" placeholder="请对照有效证件填写"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="营业执照" prop="licenseUrl">
                <image-upload v-model="registerForm.licenseUrl" placeholder="扫描件"></image-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>单位管理员</span>
        </div>
        <div class="item">
          <el-row>
            <el-col :sm="24" :md="12">
              <el-form-item label="用户姓名" prop="nickName">
                <el-input v-model="registerForm.nickName" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="手机号码" prop="phonenumber">
                <el-input v-model="registerForm.phonenumber" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="登录密码" prop="password">
                <el-input placeholder="请设置系统登录密码" v-model="registerForm.password" show-password/>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="确认密码" prop="password_">
                <el-input placeholder="确认密码" v-model="registerForm.password_" show-password/>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="验证码">
                <el-input
                  v-model="registerForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width: calc( 100% - 110px)">
                  <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode"/>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <div style="margin: 20px auto; width: 155px;">
        <el-button :loading="loading" size="medium" type="success" @click="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <el-button type="primary" size="medium" @click="$router.push({path: '/login'})">返回</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getCodeImg, register} from "@/api/login";
import HlRegion from '@/components/HlRegion';
import Cookies from "js-cookie";
import {encrypt, decrypt} from '@/utils/jsencrypt'
import ImageUpload from '@/components/RegisterImageUpload';

export default {
  name: "Register",
  components: {
    ImageUpload,
    HlRegion
  },
  data() {
    return {
      codeUrl: '',
      loading: false,
      registerForm: {
        deptName: '',
        districtCode: '',
        detailedAddress: '',
        creditCode: '',
        parentId: '',
        licenseUrl: '',
        userName: '',
        nickName: '',
        phonenumber: '',
        password: '',
        password_: '',
        linkName: '',
        linkPhone: '',
        code: ''
      },
      registerRules: {
        deptName: [
          {required: true, trigger: "blur", message: "企业名称不能为空"}
        ],
        districtCode: [
          {required: true, trigger: "blur", message: "行政区域不能为空"}
        ],
        detailedAddress: [
          {required: true, trigger: "blur", message: "详细地址不能为空"}
        ],
        creditCode: [
          {required: true, trigger: "blur", message: "统一信用代码不能为空"}
        ],
        parentId: [
          {required: true, trigger: "blur", message: "选择注册单位类别不能为空"}
        ],
        licenseUrl: [
          {required: true, trigger: "blur", message: "上传营业执照扫描件，用于系统用户审查"}
        ],
        userName: [
          {required: true, trigger: "blur", message: "用户名不能为空"}
        ],
        nickName: [
          {required: true, trigger: "blur", message: "用户姓名不能为空"}
        ],

        linkName: [
          {required: true, trigger: "blur", message: "联系人不能为空"}
        ],
        phonenumber: [
          {
            pattern: /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
          {required: true, trigger: "blur", message: "手机号码不能为空"}
        ],
        password: [
          {required: true, trigger: "blur", message: "密码不能为空"},
          {
            pattern:  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/,
            message: "请输入强密码(必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间)",
            trigger: "blur"
          }
        ],
        password_: [
          {required: true, trigger: "blur", message: "请确认密码"}
        ],

      },
      regionOptions: [],
      companyTypes: [
        {label: '社会单位', value: 100},
        {label: '服务机构', value: 0},
      ]
    }
  },
  watch: {},
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.registerForm.uuid = res.uuid;
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if (this.registerForm.password === this.registerForm.password_) {
            register(this.registerForm).then(res => {
              if (res.code == '200') {
                this.$message({
                  message: '用户注册成功',
                  type: 'success'
                });
                this.$router.push({path: '/login'})
              } else if (res.code == '500') {
                this.getCode();
              }
            })
          } else {
            this.$message({
              message: '密码不一致',
              type: 'warning'
            });
          }
        }
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" scoped lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #07A9F7 0%, #0170DB 100%);
  background-size: cover;
  min-height: 100%;
  .register-form {
    width: 70%;
    /deep/ .el-card__body{
      padding-right: 70px;
    }
  }
}
.login-code {
  width: 100px;
  height: 36px;
  float: right;
  border: 1px solid #E6E6E6;
  box-sizing: content-box;
  img {
    cursor: pointer;
    vertical-align: middle;
    width: 100%;
    height: 100%;
  }
}
.box-card {
  margin: 20px 0;
}
@media screen and (max-width: 1300px) {
  .register {
    .register-form {
      width: 90%;
      /deep/ .el-card__body{
        padding-right: 30px;
      }
    }
  }
}
</style>
