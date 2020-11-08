<template>
  <!-- <el-dialog :title="EditTitle" :visible.sync="dialogFormVisible" width="30%" class="me-dialog"> -->
    <el-form :model="form"  size="medium">
      <!-- <label style="display:none" :ref="`id${user}`">{{ EditLabel }}</label>
      <span style="display:none" :ref="`userId${usertag}`">{{ tagId }}</span>-->
      <el-form-item prop="value_one" class="me-form-item">
        <el-input placeholder="修改前信息" v-model="form.value_one" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="value_two" class="me-form-item">
        <el-input placeholder="输入将要修改的信息" v-model="form.value_two" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item class="me-form me-form-item">
        <el-button type="primary" @click="updateInformation">提 交</el-button>
        <el-button @click="cancelDialog">取 消</el-button>
      </el-form-item>
    </el-form>
  <!-- </el-dialog> -->
</template>

<script>
import { updateStudentInformation } from '../../../api/superadmin'
export default {
  data() {
    return {
      form: {
        value_one: "",
        value_two: ""
      },
      id: "",
      value: ''
    };
  },
  props: {
    editList: {
      type: Array,
      default: []
    }
  },
  mounted() {
      let obj = this.editList[0];
        let _this = this;
        let id = "";
        let value = "";
        let key = ''
        Object.keys(obj).forEach(item => {
            if (item != "学号") {
                value = obj[item];
                key = item
            }
            if (item == "学号") {
                id = obj[item];
            }
        });
        this.value = key
        this.form.value_one = value;
        this.id = id;
  },
  watch: {
    //侦听edit编辑弹窗中的数据
    'editList': {
      handler: function(newval, oldval) {
        // console.log(newval)
        // console.log(oldval)
        let obj = this.editList[0];
        let _this = this;
        let id = "";
        let value = "";
        let key = ''
        Object.keys(obj).forEach(item => {
            if (item != "学号") {
                // _this.value_one = item  //this指向在箭头函数里面无效
                value = obj[item];
                key = item
            }
            if (item == "学号") {
                id = obj[item];
            }
        });
        this.value = key
        this.form.value_one = value;
        this.id = id;
        }
    }
  },
   methods: {
    updateInformation() {
        let userId = this.id
        let key = this.value
        let updateValue = this.form.value_two
        let data = {
            '学号': userId,
        }
        data[key] = updateValue

        let dialog = false
        this.$emit('Dialog', dialog)
        updateStudentInformation(data).then( res => {
            // console.log(res)
            setTimeout( () => {
              this.form.value_two = ''
            }, 1000)
            this.$message({type: 'success', message: '信息修改成功'})
        }).catch( err => {
            this.$message({type:'error', message: '信息修改失败'})
        })
    },
    cancelDialog() {
        let dialog = false
        this.$emit('Dialog',dialog)
    }
  }
};
</script>