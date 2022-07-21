const socket = new WebSocket('ws://localhost:6800/jsonrpc')


export default class aria2{
    options : any;
    socket: any;
    collback: Function;

    constructor(collback:Function ,options = {}){
        this.options = options;
        this.socket = new WebSocket('ws://localhost:6800/jsonrpc')
        this.collback = collback;
    }
    async init () {
        this.socket.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'aria2.tellActive',
            params: []
        }))
    }
    async message(){
        socket.addEventListener('message',(event: any)=>{
            let data = JSON.parse(event.data)
            this.collback(data)
        })
    }
}