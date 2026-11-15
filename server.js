import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.dirname(fileURLToPath(import.meta.url));
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json"};
const server=http.createServer((req,res)=>{
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname); }
  catch { res.writeHead(400); return res.end("Bad request"); }
  if(pathname==="/") pathname="/index.html";
  const file=path.resolve(root,"."+pathname);
  if(!file.startsWith(root+path.sep) && file!==path.join(root,"index.html")) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404,{"content-type":"text/plain; charset=utf-8"});return res.end("Not found");}
    res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream","cache-control":"no-cache"});
    res.end(data);
  });
});
server.listen(Number(process.env.PORT)||3000,"0.0.0.0");
