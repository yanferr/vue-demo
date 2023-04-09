<template>
    <div><el-container>
            <el-aside width="200px"><el-tree @node-click="nodeClick" :highlight-current="true" :expand-on-click-node="false"
                    :data="labelTree" node-key="labelId" draggable default-expand-all :props="defaultProps">
                </el-tree>
            </el-aside>
            <el-main>
                <el-table @row-dblclick="rowClick" :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="ques" label="问题描述">
                    </el-table-column>
                    <el-table-column label="所属标签" width="250">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{ scope.row.labelName }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
        <el-dialog title="修改标签" :visible.sync="showUpdateDialog" width="30%" center>
            <el-input placeholder="请输入内容" v-model="updateLabelForm.ques" :disabled="true">
            </el-input>
            <div class="demo-input-suffix">
                重新定义标签：
                <el-cascader @change="handleChange" filterable filterable:filter-method="dataFilter" size="medium"
                    v-model="updateLabelForm.labelId" :options="options"
                    :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'labelId', label: 'labelName' }"></el-cascader>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateQuesLabelRelation">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import axios from 'axios';
export default {
    //import 引入的组件需要注入到对象中才能使用
    components: {},
    props: {},
    data() {
        //这里存放数据
        return {
            label: '',
            labelTree: [],
            defaultProps: {
                children: 'children',
                label: 'labelName'
            },
            tableData: [],
            showUpdateDialog: false,
            updateLabelForm: { labelId: null },
            options: [],
        };
    },
    //计算属性 类似于 data 概念
    computed: {},
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        handleChange(node) {
            console.log(node);
        },
        updateQuesLabelRelation() {
            var labelIds = this.updateLabelForm.labelId
            // 防止服务器报400
            if (Object.prototype.toString.call(labelIds) != '[object Array]') {
                labelIds = [labelIds];
            }
            axios.post(`http://localhost:9500/qa/queslabelrelation/update/${this.updateLabelForm.quesId}`,
                JSON.stringify(labelIds),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    if (res && res.data.code === 0) {
                        this.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        });
                        this.quesListWithLabel(0);
                    } else {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'error'
                        })
                    };
                    this.showUpdateDialog = false;
                }).catch(function (error) {
                    console.log(error);
                });



        },
        //行双击事件
        rowClick(row, column, event) {
            this.showUpdateDialog = true;
            this.updateLabelForm.ques = row.ques;
            this.updateLabelForm.id = row.relationId;
            this.updateLabelForm.quesId = row.quesId;
            this.updateLabelForm.labelId = row.labelId;
            console.log(this.updateLabelForm);

        },
        getLabelList() {
            axios.get('http://localhost:9500/qa/label/list/tree')
                .then(response => (
                    this.labelTree = response.data.data

                    // console.log(response)
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        },
        getQuesList(labelId) {
            axios.get('http://localhost:9500/qa/ques/list')
                .then(response => (
                    this.tableData = response.data.page.list,
                    console.log(this.tableData)
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        },

        quesListWithLabel(labelId) {
            axios.get(`http://localhost:9500/qa/ques/list/${labelId}`)
                .then(response => (
                    this.tableData = response.data.data,
                    console.log(this.tableData)
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        },

        nodeClick(data, node) {
            var labelId = data.labelId;
            console.log(node);
            // /list/ques/
            this.quesListWithLabel(labelId);
        }
    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {
        this.getLabelList();
        // 查询所有问题以及对应的标签名和关系id
        this.quesListWithLabel(0);
        // 加载标签级联选择器
        axios.get('http://localhost:9500/qa/label/list/tree')
            .then(response => (
                this.options = response.data.data,
                console.log(this.options)

            ))
            .catch(function (error) { // 请求失败处理
                console.log(error);
            });
    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发
}
</script>
<style scoped>
.demo-input-suffix {
    margin-top: 40px;
}
</style>