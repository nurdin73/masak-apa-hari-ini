const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"

exports.latest = async (req, res) => {
    const key = req.params.key || ""
    const latest = []
    await axios(URL_SCRAPING).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-post-medium', html).each(function() {
            if($(this).attr('post-type') != undefined) {
                if(key != "") {
                    if($(this).attr('post-type') == key) {
                        console.log(key);
                        const title = $(this).find('a').attr('data-tracking-value')
                        const url = $(this).find('a').attr('href')
                        const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                        const keys = url.split('/')
                        latest.push({
                            title: title,
                            category: keys[3],
                            slug: keys[4],
                            thumbnail: thumbnail,
                            url: url,
                        })
                    }
                } else {
                    const title = $(this).find('a').attr('data-tracking-value')
                    const url = $(this).find('a').attr('href')
                    const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                    const keys = url.split('/')
                    const item = {
                        title: title,
                        category: keys[3],
                        slug: keys[4],
                        thumbnail: thumbnail,
                        url: url,
                    }
                    if(keys[3] == "resep") {
                        const info = {
                            info: {
                                times: $(this).find('.time small').text().trim(),
                                servings: $(this).find('.servings small').text().trim(),
                                difficulty: $(this).find('.difficulty small').text().trim()
                            }
                        }
                        Object.assign(item, info)
                    }
                    latest.push(item)
                }
            }
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 

    res.json(latest)
}


exports.article = async (req, res) => {
    const { category, key } = req.params
    const article = {}
    const urlDetail = `${URL_SCRAPING}${category}/${key}`
    await axios(urlDetail).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        article.title = $('h1.title', html).text().trim()
        article.author = {
            name: $('.author').text().trim(),
            created_at: $('.date').text().trim()
        }
        article.thumbnail = {
            src: $('.featured-img').attr('data-lazy-src'),
            alt: $('.featured-img-wrapper figure small').html(),
        }
        article.description = $('.the-content', html).html().trim()
        article.tags = []
        $('.post-tags a', html).each(function(i) {
            const key = $(this).attr('href').split('/')
            article.tags.push({
                name: $(this).attr('data-tracking-value'),
                url: $(this).attr('href'),
                key: key[key.length - 2]
            })
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 
    res.json(article)
}

exports.related = async (req, res) => {
    const { category, key } = req.params
    const related = []
    const urlDetail = `${URL_SCRAPING}${category}/${key}`
    await axios(urlDetail).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-post', html).each(function() {
            if($(this).attr('post-type') != undefined) {
                const title = $(this).find('a').attr('data-tracking-value')
                const url = $(this).find('a').attr('href')
                const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                const key = url.split('/')
                related.push({
                    title: title,
                    category: key[3],
                    slug: key[4],
                    thumbnail: thumbnail,
                    url: url,
                })
            }
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message,
            status: err.status
        })
    }) 
    res.json(related)
}

exports.tag = async (req, res) => {
    const detailTag = {}
    const urlDetail = `${URL_SCRAPING}tag-global/${req.params.tag}`
    await axios(urlDetail).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        detailTag.name = $('h1.title', html).text().trim()
        detailTag.description = $('.description', html).text().trim()
        detailTag.posts = []
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
                detailTag.posts.push(item)
            }
        })

    }).catch(err => {
        res.status(404).json({
            message: err.message,
            status: err.status
        })
    }) 
    res.json(detailTag)
}