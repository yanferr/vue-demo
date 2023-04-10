<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="输入问题" prop="ques">
                <el-input v-model="form.ques"></el-input>
            </el-form-item>
            <el-form-item label="设置标签" prop="labelIds">
                <el-cascader filterable filterable:filter-method="dataFilter" size="medium" v-model="form.labelIds"
                    :options="options"
                    :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'labelId', label: 'labelName' }"
                    @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="提问场景">
                <el-radio-group v-model="form.scene" size="medium">
                    <el-radio-button label="interview" value="interview"></el-radio-button>
                    <el-radio-button label="daily" value="daily"></el-radio-button>
                    <el-radio-button label="debug" value="debug"></el-radio-button>
                    <el-radio-button label="other" value="other"></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="溯源信息">
                <el-input v-model="form.source"></el-input>
            </el-form-item>

            <!-- <el-form-item label="能否扩展">
                <el-switch v-model="form.extend"></el-switch>
            </el-form-item> -->
            <el-form-item label="输入答案" prop="answer">
                <el-input :rows="10" type="textarea" v-model="form.answer"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import axios from 'axios';
import { Message } from 'element-ui';
export default {
    //import 引入的组件需要注入到对象中才能使用
    components: {},
    props: {},
    data() {
        //这里存放数据
        return {
            options: [],
            cateListProps: {
                value: 'labelId',                 //匹配响应数据中的id
                label: 'labelName',               //匹配响应数据中的name
                children: 'children'         //匹配响应数据中的children
            },

            defaultProps: {
                children: 'children',
                label: 'labelName'
            },
            form: {
                ques: null,
                scene: 'daily',
                source: null,
                answer: null,
                labelIds: null
            },
            rules: {
                ques: [
                    { required: true, message: '请输入问题', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                labelIds: [
                    { required: true, message: '请打上标签', trigger: 'blur' }
                ],
                answer: [
                    { required: true, message: '请输入答案', trigger: 'blur' }
                ]
            }
        };
    },
    //计算属性 类似于 data 概念
    computed: {},
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        // 标签过滤
        dataFilter(val) {
            this.value = val //给绑定值赋值

            if (val) {
                //val存在筛选数组
                this.options = this.list.filter((i) => {
                    let index = -1,
                        reflag = true

                    // 逐字对比筛选
                    let valArr = val.split(''),
                        len = valArr.length
                    loop: for (let k = 0; k < len; k++) {
                        if (i.label.indexOf(valArr[k]) <= index) {
                            reflag = false
                            break loop
                        }
                        index = i.label.indexOf(valArr[k]) //赋筛选的字在i中的索引
                    }

                    return reflag
                })
            } else {
                //val不存在还原数组
                this.options = this.list
            }
        },
        handleChange(value) {
            console.log(value);
        },
        onSubmit() {
            console.log(this.form.answer)
            axios.post('http://localhost:9500/qa/ques/save', {
                ques: this.form.ques,
                scene: this.form.scene,
                source: this.form.source,
                answer: this.form.answer,
                labelIds: this.form.labelIds
            }).then(res => {  // 必须要用箭头函数
                console.log(res)

                if (res && res.data.code === 0) {
                    this.$message({
                        showClose: true,
                        message: '已成功添加QA~',
                        type: 'success'
                    });
                    this.form = {};
                    this.form.scene = 'interview'
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
        // processData(list) {
        //     this.options = [];
        //     for (let i = 0; i < list.length; i++) {
        //         let children = [];
        //         if (list[i].children != null && list[i].children.length > 0) {
        //             for (let j = 0; j < list[i].children.length; j++) {
        //                 children.push({ label: list[i].children[j].labelName, value: list[i].children[j].labelId });
        //             }
        //         }
        //         this.options.push({ label: list[i].labelName, value: list[i].labelId, children: children });
        //     }
        // }
    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {

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
<style scoped></style>