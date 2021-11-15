
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

exports.tag = async (req, res) => {
    const page = req.query.page || 1
    const perpage = 10
    const result = {}
    result.page = parseInt(page)
    result.perpage = perpage
    const urlToGetTermAndTotal = `${URL_SCRAPING}/tag-global/${req.params.tag}`
    const urlGetAJaxLoad = `${URL_SCRAPING}/ajax`
    await axios(urlToGetTermAndTotal).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        result.termId = parseInt($('#category-content', html).attr('data-term-id'))
        result.total = parseInt($('.category-posts', html).attr('data-total-posts'))
    })
    await axios.post(`${urlGetAJaxLoad}`, {
        "load_more":true,
        "post_type":["post", "recipe"],
        "posts_per_page":perpage,
        "page": page,
        "taxonomy":"global_tag",
        "term_id":result.termId,
    }).then(res => {
        const html = res.data
        const $ = cheerio.load(html)
        result.data = []
        $('.block-post').each(function() {
            const url = $(this).find('a').attr('href')
            const keys = url.split('/') 
            const item = {
                title: $(this).find('a').attr('data-tracking-value') ,
                category: keys[3],
                slug: keys[4],
                thumbnail: $(this).find('.wp-post-image').attr('data-lazy-src') ,
                url: url,
            }
            result.data.push(item)
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    })

    res.json(result)
}