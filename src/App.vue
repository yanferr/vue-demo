<template>
  <el-container style=" border: 1px solid #eee">
    <el-header>
      <el-menu router
      :default-active="activeIndex" 
      class="el-menu-demo" 
      mode="horizontal" >
        <el-menu-item index="0">LOGO</el-menu-item>
        <el-menu-item index="/">添加QA</el-menu-item>

        <el-menu-item index="/queryQA">查询QA</el-menu-item>

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
      activeIndex: '/',
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

.el-aside {
  color: #333;
}
</style>

