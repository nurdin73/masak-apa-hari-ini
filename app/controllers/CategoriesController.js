const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"

exports.categories = async (req, res) => {
    const type = req.params.type
    const categories = []
    await axios(URL_SCRAPING).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        if(type == "recipe") { 
            $('.categories-row', html).each(function() {
                $(this).find('.category-col').each(function() {
                    const title = $(this).find('a').attr('data-tracking-value')
                    const url = $(this).find('a').attr('href')
                    const key = url.split('/')
                    // const style = $(`.category-block.${key[key.length - 2]}`).css()
                    // console.log(style);
                    categories.push({
                        title: title,
                        url: url,
                        key: key[key.length - 2]
                    })
                })
            })
        } else if(type == "article") {
            $('#menu-item-286 ul li', html).each(function() {
                const attr = $(this).find('a')
                const title = attr.text()
                const url = attr.attr('href')
                const key = url.split('/')
                categories.push({
                    title: title,
                    url: url,
                    key: key[key.length - 2]
                })
            })
        } else if(type == "product") {
            $('#menu-item-288 ul li', html).each(function() {
                const attr = $(this).find('a')
                const title = attr.text()
                const url = attr.attr('href')
                const key = url.split('/')
                categories.push({
                    title: title,
                    url: url,
                    key: key[key.length - 2]
                })
            })
        }
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 
    res.json(categories)
}

exports.category = async (req, res) => {
    const { type, category } = req.params
    const detailCategory = {}
    var url = URL_SCRAPING;
    if(type == "recipe") {
        url += `resep-masakan/${category}`
    } else if(type == "article") {
        url += category
    }
    await axios(url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const posts = []
        $('.block-post-medium', html).each(function() {
            if($(this).attr('post-type') == type) {
                const title = $(this).find('a').attr('data-tracking-value')
                const url = $(this).find('a').attr('href')
                const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                const keys = url.split('/')
                console.log(keys);
                const item = {
                    title: title,
                    category: category,
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
                posts.push(item)
            }
        })
        
        detailCategory.name = $('#category-header .container .category-info h1', html).text()
        detailCategory.desc = $('#category-header .container .category-info p', html).text()
        detailCategory.thumbnail = {
            desktop: $('#category-header', html).attr('data-desktop-bg'),
            mobile: $('#category-header', html).attr('data-mobile-bg'),
        }
        detailCategory.post = posts
    }).catch(err => {
        res.status(404).json({
            message: err.message,
        })
    }) 
    res.json(detailCategory)
}

