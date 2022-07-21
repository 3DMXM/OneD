/**
 * 启动和配置aria2
 */
 const { exec } = require('node:child_process');
 const {join} = require('path');
// F:\Node.js\oned\electron\main\aria2\aria2c.exe
// F:\Node.js\oned\electron\main\aria2c\aria2c.exe
// 启动aria2
function startAria2() {
    let mainPath = join(__dirname, '../../../');
    let aria2cPath = join(mainPath, 'electron/main/aria2/');
    let aria2c = join(aria2cPath, '/aria2c.exe');
    let aria2cConf = join(aria2cPath, 'aria2.conf');
    console.log(mainPath);
    exec(`${aria2c} --conf-path=${aria2cConf}`, (err: any, stdout: any, stderr: any) => {
        if (!err) {
            console.log(stdout);
        }else{
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

// 停止aria2
function stopAria2() {
    exec('taskkill /F /IM aria2c.exe', (err: any, stdout: any, stderr: any) => {
        if (!err) {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }else{
            console.error(`exec error: ${err}`);
            return;
        }
    });
}

// 调用aria2下载文件
function downloadFile(url: any, path: any, callback: any) {
    exec(`aria2c -d ${path} -o ${path} ${url}`, (err: any, stdout: any, stderr: any) => {
        if (!err) {
            console.log(stdout);
        }else{
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}


export default {
    startAria2, stopAria2, downloadFile
}