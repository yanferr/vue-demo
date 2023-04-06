<template>
  <el-container style=" border: 1px solid #eee">
    <el-header>
      <el-menu router="true"
      :default-active="activeIndex" 
      class="el-menu-demo" 
      mode="horizontal" 
      :default-openeds="['/']">
        <el-menu-item index="0">LOGO</el-menu-item>
        <el-menu-item index="/">添加QA</el-menu-item>

        <el-menu-item index="2">查询QA</el-menu-item>

      </el-menu>
    </el-header>

    <el-main><!-- 添加路由视图 -->
      <router-view></router-view>
    </el-main>


  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      activeIndex2: '1'
    }

  },
  methods: {
    
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

/* .el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
} */
.el-menu {
  align-items: right;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
}

.el-aside {
  color: #333;
}
</style>

