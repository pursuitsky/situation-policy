<template>
  <el-card class="me-card" shadow="hover">
    <Form :model="supForm" lable-position="left" class="me-form">
      <FormItem label="姓名">
        <Input
          v-model="supForm.name"
          placeholder=" 输入学生姓名"
          search
          class="me-input"
          prefix="ios-person"
          @on-search="handleSearchByName(supForm.name)"
        />
      </FormItem>
      <FormItem label="学号">
        <Input
          v-model="supForm.userId"
          placeholder=" 输入学生学号"
          search
          class="me-input"
          prefix="md-person"
          @on-search="handleSearchById(supForm.userId)"
        />
      </FormItem>
      <FormItem label="班级">
        <Input
          v-model="supForm.Class"
          placeholder=" 输入要查询的班级"
          search
          class="me-input"
          prefix="md-people"
          @on-search="handleSearchByClass(supForm.Class)"
        />
      </FormItem>
      <FormItem label="年级">
        <Input
          v-model="supForm.grade"
          placeholder=" 输入要查询的年级"
          search
          class="me-input"
          prefix="ios-people"
          @on-search="handleSearchByGrade(supForm.grade)"
        />
      </FormItem>
    </Form>
  </el-card>
</template>

<script>
import Bus from '../../../eventBus/eventBus'
import { 
  getInformationByName, 
  getInformationById, 
  getInformationByClass, 
  getInformationByGrade 
} from '../../../api/superadmin'

export default {
  data() {
    return {
      supForm: {
        name: "",
        userId: "",
        Class: "",
        grade: ""
      }
    };
  },
  methods: {
      handleSearchByName(value) {
          getInformationByName(value).then( res => {
            // let data = JSON.parse(res.data.data)
            let data = res.data.data
            Bus.$emit('searchByValue', data)

          }).catch( err => {
            this.$message({type: 'error', message: '查询失败，请求未成功'})
          })
          setTimeout( () => {
            this.supForm.name = ''
          }, 2500)
      },

      handleSearchById(value) {  
        getInformationById(value).then( res => {
          // let data = JSON.parse(res.data.data)
          let data = res.data.data
          Bus.$emit('searchByValue', data)

        }).catch( err => {
          this.$message({type: 'error', message: '查询失败，请求未成功'})
        })
        setTimeout( () => {
          this.supForm.userId = ''
        }, 2500)
      },

      handleSearchByClass(value) { 
        getInformationByClass(value).then( res => {
          // console.log(res.data.data)
          let data = res.data.data
          Bus.$emit('searchByValue', data)
        }).catch( err => {
          this.$message({type: 'error', message: '查询失败，请求未成功'})
        })
        setTimeout( () => {
          this.supForm.Class = ''
        }, 2500)
      },

      handleSearchByGrade(value) {
        
        getInformationByGrade(value).then( res => {
          let data = res.data.data
          // console.log(data)
          Bus.$emit('searchByValue', data)
        }).catch( err => {
          this.$message({type: 'error', message: '查询失败，请求未成功'})
        })
        setTimeout( () => {
          this.supForm.grade = ''
        }, 2500)
      },
  }
};
</script>

<style scoped>
.me-search {
  /* width: 96%; */
  margin-top: 30px;
  padding: 0 10px;
}
.me-input {
  width: 85%;
}
.me-card {
  margin-top: 30px;
}
.me-form {
  padding-top: 20px;
}
</style>