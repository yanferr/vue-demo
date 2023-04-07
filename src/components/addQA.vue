<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="输入问题">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="设置标签">
                <el-select v-model="form.labels" multiple filterable allow-create default-first-option
                    placeholder="请选择问题标签">
                    <el-option v-for="item in options" :key="item.labelId" :label="item.labelName" :value="item.labelId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提问场景">
                <el-radio-group v-model="form.scene">
                    <el-radio label="面试题"></el-radio>
                    <el-radio label="日常积累"></el-radio>
                    <el-radio label="debug"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="溯源信息">
                <el-input v-model="form.source"></el-input>
            </el-form-item>

            <!-- <el-form-item label="能否扩展">
                <el-switch v-model="form.extend"></el-switch>
            </el-form-item> -->
            <el-form-item label="输入答案">
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
export default {
    //import 引入的组件需要注入到对象中才能使用
    components: {},
    props: {},
    data() {
        //这里存放数据
        return {
            options: [],
            form: {
                name: '',
                scene: '',
                source: '',
                answer: '',
                labels: []
            }
        };
    },
    //计算属性 类似于 data 概念
    computed: {},
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        onSubmit() {
            console.log(this.form.answer)
            axios.post('http://localhost:9500/qa/ques/save', {
                name:this.form.name,
                scene:this.form.scene,
                source:this.form.source,
                answer:this.form.answer,
                labels:this.form.labels
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });
        }
    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {

        axios.get('http://localhost:9500/qa/label/list')
            .then(response => (
                this.options = response.data.page.list
                // console.log(response.data.page.list)
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