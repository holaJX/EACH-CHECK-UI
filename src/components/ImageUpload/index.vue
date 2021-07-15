<template>
  <div class="component-upload-image">
    <el-upload
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      style="display: inline-block; vertical-align: top"
    >
      <el-image v-if="!value" :src="getUrl(value)">
        <div slot="error" class="image-slot">
          <i class="el-icon-plus" />
        </div>
      </el-image>
      <div v-else class="image">
        <el-image :src="getUrl(value)" :style="`width:150px;height:150px;`" fit="fill"/>
        <div class="mask">
          <div class="actions">
            <span title="预览" @click.stop="dialogVisible = true">
              <i class="el-icon-zoom-in" />
            </span>
            <span title="移除" @click.stop="removeImage">
              <i class="el-icon-delete" />
            </span>
          </div>
        </div>
      </div>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        的图片
      </div>
    </el-upload>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="getUrl(value)" style="display: block; max-width: 100%; margin: 0 auto;">
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  data() {
    return {
      dialogVisible: false,
      imageUrl:'',
      uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && this.fileSize;
    },
    removeImage() {
      this.$emit("input", "");
    },
    getUrl(url) {
      return process.env.VUE_APP_BASE_API + url;
    },
    handleUploadSuccess(res) {
      this.$emit("input", res.fileName);
      this.loading.close();
    },
    handleBeforeUpload(file) {
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }

      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}
</style>
