const express = require('express');
const app = express()
const superagent = require('superagent');
const cheerio = require('cheerio');


let server = app.listen(3005,()=>{
    let host = server.address().address;
    let post = server.address().port;
});


//使用superagent.get()方法访问网页
superagent.get("https://www.zhihu.com/explore/recommendations").end((error,response)=>{
    if(error){
        console.log(`访问失败 - ${error}`);
    }else{
        ediRec = getEdiRec(response);
    }
});
//使用cheerio剥取数据
let getEdiRec = (res) =>{
    let ediRec = [];
    let $ = cheerio.load(res.text);
    $('div#zh-recommend h2 a').each((idx,ele)=>{
        let recommend = {
            title : $(ele).text(),
            href : $(ele).attr('href')
        }
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
        let url = recommend.href;
        
        if(!reg.test(url)){
            let str = "https://www.zhihu.com";
            recommend.href = str + url;
        }
        ediRec.push(recommend);
    });
    return ediRec;
}


app.get('/', async (req, res, next) => {
    res.send(ediRec);
  });
  