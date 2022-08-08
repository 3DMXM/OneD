
export default class api {
    socket: WebSocket;
    // readyState: number = 0;
    // callback: Function;

    constructor() {
        this.socket = new WebSocket('ws://localhost:6800/jsonrpc')
        // this.readyState = this.socket.readyState
        this.init();
    }
    readyState() {
        return this.socket.readyState
    }
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    async init() {
        this.socket.onopen = () => {
            this.send({
                jsonrpc: "2.0",
                id: this.uuid(),
                method: "aria2.tellActive",
                params: []
            })
            console.log('[OneD]:初始化完成');
        }
    }

    async send(data: { [name: string]: any }): Promise<string> {
        if (!data.id) {
            // 如果没有ID则生成一个id
            data.id = this.uuid()
        }

        // 判断是否链接完毕
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data))

        }

        return data.id;
    }

    async message() {
        return new Promise((resolve, reject) => {
            this.socket.addEventListener('message', (event: any) => {
                let data = JSON.parse(event.data)
                resolve(data);
            })
        })
    }

    /**
     * 创建下载任务
     * @param urls  下载地址
     * @param name  下载文件名
     * @param savePath  下载路径
     * @returns 
     */
    async addUri(urls: Array<string>, name: string, savePath: string, gid?: string) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.addUri',
            id: gid,
            'params': [
                urls,
                {
                    'out': name,
                    'dir': savePath,
                }
            ]
        })
        // return id;
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }
    /**
     * 监听下载任务
     * @param gid 任务id
     * @returns 
     */
    async tellStatus(gid: string) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.tellStatus',
            id: gid,
            'params': [gid]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
        // return id;
    }
    /**
     * 暂停下载
     * @param gid 任务id
     */
    async pause(gid: string) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.pause',
            id: gid,
            'params': [gid]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }

    /**
     * 恢复下载
     * @param gid 任务id 
     */
    async unpause(gid: string) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.unpause',
            id: gid,
            'params': [gid]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }
    // 删除任务
    async remove(gid: string) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.remove',
            id: gid,
            'params': [gid]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }


    // 获取下载中的任务
    async tellActive() {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.tellActive',
            id: this.uuid(),
            'params': []
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }

    // 获取等待下载的任务
    async tellWaiting(offset: number, num: number) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.tellWaiting',
            id: this.uuid(),
            'params': [offset, num]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }

    async tellStopped(offset: number, num: number) {
        let id = this.send({
            'jsonrpc': '2.0',
            'method': 'aria2.tellStopped',
            id: this.uuid(),
            'params': [offset, num]
        })
        return new Promise((resolve, reject) => {
            this.message().then((data: any) => {
                resolve(data);
            })
        })
    }


}
