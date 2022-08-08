<script lang='ts' setup>
import axios from "axios"
import mdui from "mdui"
import { ipcRenderer } from "electron"

import { ref, reactive, defineEmits, computed } from "vue"

import { useStore } from "vuex"

const emit = defineEmits(["addTask", "closeAdd"]);
const Store = useStore();

let save_path = computed(() => {
    return Store.state.save_path;
})


let download = reactive({
    file_id: "",
    drive_type: "",
})


function go() {
    if (download.file_id == "" || download.drive_type == "") {
        mdui.snackbar({
            message: "请输入文件ID并选择网盘类型",
            position: 'right-top'
        });
        return;
    }

    // 使用 axios 获取文件信息
    axios.post(`https://app.aoe.top/oned/GetFileData`, {
        fileId: download.file_id,
        drive: download.drive_type
    }).then((req: any) => {
        // console.log(req.data);
        // 调用 $emit("addTask", req.data);
        emit("addTask", req.data, save_path.value[0]);
    })
}

function select_folder() {
    // 打开文件夹选择器
    ipcRenderer.invoke("select-folder").then((result: string) => {
        if (result) {
            // download.save_path = result;
            Store.commit("change_save_path", result);
        }
    })
}



</script>
<template>
    <Teleport to="#app">
        <div class="AddDownload">
            <div class="add-window">
                <div class="add-top">
                    <div class="add-title">添加下载地址</div>
                    <div class="add-close" @click="emit('closeAdd')"><i class="mdui-icon material-icons">clear</i>
                    </div>
                </div>
                <div class="mdui-divider"></div>
                <div class="add-input">
                    <div class="mdui-col-xs-12">
                        <div class="mdui-textfield">
                            <label for="file_id">文件ID:</label>
                            <input name="file_id" v-model="download.file_id" class="mdui-textfield-input" type="text"
                                placeholder="如:012KYXHEI7I6AU5QXIRJBZ3PH2WZASAWKH" />
                        </div>
                    </div>
                    <div class="mdui-col-xs-12 save-path">
                        <div class="mdui-textfield">
                            <label for="file_id">保存位置:</label>
                            <input name="file_id" v-model="save_path" class="mdui-textfield-input" type="text" />
                        </div>
                        <div @click="select_folder" class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple"
                            title="选择文件夹"><i class="mdui-icon material-icons">folder</i></div>
                    </div>
                    <div class="mdui-col-xs-12 drive_type">
                        <label for="drive_type">云端网盘位置：</label>
                        <select v-model="download.drive_type" name="drive_type" class="mdui-select"
                            style="flex: 1 1 auto" mdui-select>
                            <option value="">选择一个网盘</option>
                            <option value="pan">pan.aoe.top</option>
                            <option value="game">game.aoe.top</option>
                        </select>
                    </div>
                    <div class="mdui-col-xs-12 go">
                        <div class="go-btn" @click="go">开始下载</div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script lang='ts'>
export default {
    name: 'AddDownload',
    mounted() {
        mdui.mutation();
    }
}
</script>
<style lang='less' scoped>
.AddDownload {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, .3);
    top: 36px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .add-window {
        width: 600px;
        // height: 250px;
        padding: 15px;
        max-width: 100%;
        max-height: 100%;
        background: rgb(56, 56, 56);

        .add-top {
            display: flex;

            .add-title {
                flex: 1 1 auto;
                font-size: 18px;
                padding: 10px 20px;
            }

            .add-close {
                padding: 10px;
                cursor: pointer;

                &:hover {
                    background: rgba(0, 0, 0, .1);
                }
            }
        }

        .add-input {
            .drive_type {
                display: flex;
                justify-content: space-between;
                align-items: center;

                label {
                    padding: 0 15px;
                }
            }

            .save-path {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .mdui-textfield {
                    flex: 1 1 auto;
                }

                // label {
                //     padding: 0 15px;
                // }
                .mdui-btn {
                    position: absolute;
                    right: 10px;
                }
            }

            .go {
                display: flex;
                flex-direction: row-reverse;

                .go-btn {
                    margin-top: 15px;
                    padding: 10px 15px;
                    cursor: pointer;
                    border: 1px solid #0af7ff;
                    transition: .3s;

                    &:hover {
                        background: #0af7ff;
                        color: black;
                    }
                }
            }
        }

    }
}
</style>