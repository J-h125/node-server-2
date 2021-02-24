import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path'
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname,'public')  //__dirname 当前文件所在目录

server.on('request',(request:IncomingMessage,response:ServerResponse)=>{
    const {method,url:path,headers} = request
    console.log(path)
    const {pathname,search} = url.parse(path)
            let filename = pathname.substr(1)
            if(filename === ''){
                filename = 'index.html'
            }
            //response.setHeader('Content-Type','text/html ; charset=utf-8')
            fs.readFile(p.resolve(publicDir,filename),(error,data)=>{
                if(error){
                    if(error.errno === -4058){   //文件不存在
                        response.statusCode = 404
                        fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
                            response.end(data)
                        })
                    }else if(error.errno === -4068){
                        response.statusCode = 403
                        response.end('无权查看内容')
                    }else {
                        response.statusCode = 500
                        response.end('服务器繁忙')
                    }
                }else {

                    response.end(data)
                }

            });




})

server.listen(8888)