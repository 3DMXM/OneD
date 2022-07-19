<template>
    <div class="title-bar">
        <div class="title-bar-dragger">OneDrive下载器</div>
        <div class="window-actions">
            <li @click="handleMinimize">
                <svg
                version="1.1"
                role="presentation"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                class="mo-icon"
                >
                <g
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                >
                    <line
                    x1="1"
                    y1="6"
                    x2="11"
                    y2="6"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ></line>
                </g>
                </svg>
            </li>
            <li @click="handleMaximize">
                <svg
                version="1.1"
                role="presentation"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                class="mo-icon"
                >
                <g
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                >
                    <polyline
                    points="5.5 1.5 10.5 1.5 10.5 6.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ></polyline>
                    <polyline
                    points="1.5 5.5 1.5 10.5 6.5 10.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ></polyline>
                </g>
                </svg>
            </li>
            <li @click="handleClose">
                <svg
                version="1.1"
                role="presentation"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                class="mo-icon"
                >
                <g
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                >
                    <line
                    x1="1.5"
                    y1="1.5"
                    x2="10.5"
                    y2="10.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ></line>
                    <line
                    x1="10.5"
                    y1="1.5"
                    x2="1.5"
                    y2="10.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ></line>
                </g>
                </svg>
            </li>
        </div>
    </div>
</template>

<script lang="ts">
import {ipcRenderer} from 'electron'

export default {
    name: "TitleBar",    
    methods: {
        handleMinimize () {
           ipcRenderer.send('window-min')

        },
        handleMaximize () {
            ipcRenderer.send('window-max')
        },
        handleClose () {
            ipcRenderer.send('window-close')
        }
    }
};
</script>

<style lang="less" scoped>
.title-bar{
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    height: 36px;
    z-index: 5000;
    background: rgba(0, 0, 0, .2);
    .title-bar-dragger{
        margin: 5px 0 0 5px;
        flex: 1;    
        user-select: none;
        -webkit-app-region: drag;
        -webkit-user-select: none;
        padding-left: 15px;
    }
    .window-actions{
        opacity: 0.4;
        transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 5100;
        font-size: 0;

        li{
            color: #eee;
            display: inline-block;
            padding: 5px 18px;
            font-size: 16px;
            margin: 0;
            cursor: pointer;

            &:hover{
                background: #eee;
                color: #000;
            }
        }
    }
}
</style>