const request = require('request-promise')
const cheerio = require('cheerio')
const json2csv = require('json2csv').Parser
const fs = require('fs')

const movies = ["https://www.imdb.com/title/tt6473300/?ref_=nv_sr_srsg_0","https://www.imdb.com/title/tt12004706/?ref_=fn_al_tt_1"];

const scrapper = async()=>{
    const imdb = []
    for(const movie of movies){
    const response = await request({
        uri : movie,
        headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"
        },
        gzip:true
    })
    const $ = cheerio.load(response)
    const title= $('div[class = "title_wrapper"] > h1').text().trim()
    const ratings =$('div[class = "ratingValue"] > strong > span').text()
    const release = $('a[title ="See more release dates"]').text().trim()
    const summary = $('div[class = "summary_text"] ').text().trim()

    imdb.push({
        title:title,
        ratings:ratings,
        release:release,
        summary:summary
    })
}
    const myparser = new json2csv()
    const csv = myparser.parse(imdb)
    fs.writeFileSync("./imdb.csv",csv,"UTF-8")
    
    
}

scrapper()


