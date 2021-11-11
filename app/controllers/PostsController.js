
const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"


exports.search = async (req, res) => {
    const search = req.params.query
    const result = {}
    result.query = search
    const urlSearch = `${URL_SCRAPING}?s=${search}`
    await axios(urlSearch).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        result.data = []
        $('.block-post-medium', html).each(function() {
            if($(this).attr('post-type') != undefined) {
                const title = $(this).find('a').attr('data-tracking-value')
                const url = $(this).find('a').attr('href')
                const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                const key = url.split('/')
                const item = {
                    title: title,
                    category: key[3],
                    slug: key[4],
                    thumbnail: thumbnail,
                    url: url,
                }
                if(key[3] == "resep") {
                    const info = {
                        info: {
                            times: $(this).find('.time small').text().trim(),
                            servings: $(this).find('.servings small').text().trim(),
                            difficulty: $(this).find('.difficulty small').text().trim()
                        }
                    }
                    Object.assign(item, info)
                }
                result.data.push(item)
            }
        })
        if(result.data.length < 1) {
            result.message = $('#search-no-results', html).find('h1').filter(i => i == 0).text().trim()
        }
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 
    res.json(result)
}