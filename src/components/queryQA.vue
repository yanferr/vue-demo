<template>
    <div><el-table @row-dblclick="rowClick" :default-sort="{ prop: 'date', order: 'descending' }" :data="tableData"
            style="width: 100%" max-height="800">
            <el-table-column prop="ques" label="问题描述" width="900">
            </el-table-column>
            <el-table-column prop="scene" label="场景" width="120" :filters="[{ text: 'interview', value: 'interview' },
            { text: 'daily', value: 'daily' },
            { text: 'debug', value: 'debug' },
            { text: 'other', value: 'other' }]" :filter-method="filterTag">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.scene === '家' ? 'primary' : 'success'" disable-transitions>{{ scope.row.scene
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="源" width="120">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p> {{ scope.row.source === null ? "无" : scope.row.source }}</p>
                        <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{  scope.row.source != null && scope.row.source!="" }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" sortable label="创建时间" width="200">
            </el-table-column>
            <el-table-column prop="updateTime" sortable label="修改时间" width="200">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="getChoosedRow(scope.row)" type="text" size="small">
                        修改
                    </el-button>
                    <el-popconfirm @confirm="confirmDelete(scope.row)" title="确定删除此问题吗？">
                        <el-button slot="reference" @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
                            删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>


        </el-table>


        <el-dialog title="答案" :visible.sync="showAnswerDialog" width="30%" center>
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="answer">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateAnswer">修 改</el-button>
            </span>
        </el-dialog>


        <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="showUpdateDialog" width="30%" center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="输入问题">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="输入问题" v-model="form.ques">
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="设置标签" prop="labelIds">
                    <el-select v-model="form.labelIds" multiple filterable allow-create default-first-option
                        placeholder="请选择问题标签">
                        <el-option v-for="item in options" :key="item.labelId" :label="item.labelName"
                            :value="item.labelId">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="提问场景">
                    <el-radio-group v-model="form.scene">
                        <el-radio label="interview"></el-radio>
                        <el-radio label="daily"></el-radio>
                        <el-radio label="debug"></el-radio>
                        <el-radio label="other"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="溯源信息">
                    <el-input v-model="form.source"></el-input>
                </el-form-item>

                <!-- <el-form-item label="能否扩展">
                <el-switch v-model="form.extend"></el-switch>
            </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showUpdateDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateQA">修 改</el-button>
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
        return {
            confirmAgin: false,
            source: null,
            answerId: null,
            tableData: [],
            pageSize: 20,
            pageIndex: 1,
            key: null,
            showAnswerDialog: false,
            answer: "",
            showUpdateDialog: false,
            form: {
                quesId: null,
                ques: null,
                scene: null,
                source: null,
                labelIds: null
            }
        }
    },
    //计算属性 类似于 data 概念
    computed: {},
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        // 修改答案
        updateAnswer() {
            axios.post('http://localhost:9500/qa/answer/update', {
                answerId: this.answerId,
                answer: this.answer
            }).then(res => {
                if (res && res.data.code === 0) {
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.data,
                        type: 'error'
                    })
                };
                this.showAnswerDialog = false;
            }).catch(function (error) {
                console.log(error);
            });
        },
        // 全新的冒泡删除
        confirmDelete(row) {
            this.answerId = row.answerId
            this.form.quesId = row.quesId;

            axios.post("http://localhost:9500/qa/ques/delete",
                JSON.stringify([row.quesId]),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    if (res && res.data.code === 0) {
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDataList();
                    } else {
                        console.log(res)
                        this.$message({
                            showClose: true,
                            message: res.data.data,
                            type: 'error'
                        })
                    };
                }).catch(function (error) {
                    console.log(error);
                });
        },

        // 使用场景筛选
        filterTag(value, row, column) {
            return row.scene === value;
        },
        // 点击修改按钮进行回显
        getChoosedRow(row) {
            this.form = {};
            this.showUpdateDialog = true;
            axios.get(`http://localhost:9500/qa/ques/info/${row.quesId}`)
                .then(response => (
                    this.form = response.data.ques
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });

            console.log(row);
        },
        // 加载数据
        getDataList() {
            axios.get('http://localhost:9500/qa/ques/list', {
                params: {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    key: this.key
                }
            })
                .then(response => (
                    this.tableData = response.data.page.list,

                    console.log(this.tableData)
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        },
        // 提交修改
        updateQA() {
            axios.post('http://localhost:9500/qa/ques/update', {
                quesId: this.form.quesId,
                ques: this.form.ques,
                scene: this.form.scene,
                source: this.form.source,
                answer: this.answer,
                // labelIds: null
            }).then(res => {  // 必须要用箭头函数
                console.log(res)

                if (res && res.data.code === 0) {
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
                    this.getDataList();
                    this.showUpdateDialog = false;
                    this.form = {};
                } else {
                    console.log(res)
                    this.$message({
                        showClose: true,
                        message: res.data.data,
                        type: 'error'
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        getAnswerById(answerId) {
            axios.get(`http://localhost:9500/qa/answer/info/${answerId}`)
                .then(response => (
                    this.answer = response.data.answer.answer
                ))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
        },
        //行双击事件
        rowClick(row, column, event) {
            this.showAnswerDialog = true;
            this.answerId = row.answerId;
            this.getAnswerById(this.answerId);
        },

    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {
        this.getDataList();
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
.block {
    margin-left: 500px
}
</style>