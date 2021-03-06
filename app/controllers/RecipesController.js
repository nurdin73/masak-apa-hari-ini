const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"

exports.featuredRecipes = async (req, res) => {
    const featured_receipes = []
    await axios(URL_SCRAPING).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-post-featured', html).each(function() {
            if($(this).attr('post-type') != undefined) {
                const title = $(this).find('a').attr('data-tracking-value')
                const url = $(this).find('a').attr('href')
                const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                const key = url.split('/')
                featured_receipes.push({
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
            message: err.message
        })
    }) 
    res.json(featured_receipes)
}

exports.recipe = async (req, res) => {
    const recipe = {}
    const urlDetail = `${URL_SCRAPING}resep/${req.params.key}`
    await axios(urlDetail).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        recipe.title = $('h1.title').text().trim()
        recipe.thumbnail = {
            src: $('.featured-img').attr('data-lazy-src'),
            alt: $('.featured-img-wrapper figure small').html(),
        }
        recipe.excerpt = $('.excerpt', html).text().trim()
        recipe.servings = $('.servings small', html).text().trim()
        $('.time small', html).each(function(i) {
            if(i == 0) {
                recipe.times = $(this).text().trim()
            }
        })
        recipe.breadcrumb = []
        $('.breadcrumb-item', html).each(function() {
            recipe.breadcrumb.push({
                title: $(this).text().trim()
            })
        })

        $('.difficulty small', html).each(function(i) {
            if(i == 0) {
                recipe.difficulty = $(this).text().trim()
            }
        })

        recipe.author = {
            name: $('.author', html).text().trim(),
            created_at: $('.date', html).text().trim()
        }
        recipe.need_items = []
        recipe.ingredients = []
        recipe.steps = []
        recipe.description = $('.the-content', html).html().trim()
        recipe.tags = []
        $('#ingredients-section .needed-products div div .needed-product', html).each(function (i) {  
            const name = $(this).find('span').text().trim()
            const image = $(this).find('img').attr('data-lazy-src')
            recipe.need_items.push({
                name, image
            })
        })

        $('.ingredient-item', html).each(function() {
            recipe.ingredients.push({
                quantity: $(this).find('.quantity').text().trim(),
                ingredient: $(this).find('.ingredient').html().trim()
            })
        })

        $('.step', html).each(function() {
            recipe.steps.push({
                number: $(this).find('.step-number').text().trim(),
                desc: $(this).find('.step-description').html().trim()
            })
        })

        $('.tag', html).each(function () {  
            const url = $(this).attr('href')
            const keys = url.split('/')
            recipe.tags.push({
                key: keys[keys.length - 2],
                name: $(this).attr('data-tracking-value'),
                url: url
            })
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 

    res.json(recipe)
}

exports.recipes = async (req, res) => {
    const page = req.query.page || 1
    const perpage = 10
    const result = {}
    result.page = parseInt(page)
    result.perpage = perpage
    const urlGetTotalRecipe = `${URL_SCRAPING}/resep-masakan`
    const urlGetAJaxLoad = `${URL_SCRAPING}/ajax`
    await axios(urlGetTotalRecipe).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        result.total = parseInt($('.category-posts', html).attr('data-total-posts'))
    })
    await axios.post(`${urlGetAJaxLoad}`, {
        "load_more":true,
        "post_type":["recipe"],
        "posts_per_page":perpage,
        "page": page
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
            result.data.push(item)
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    })

    res.json(result)
}

exports.related = async (req, res) => {
    const related_posts = []
    const urlDetail = `${URL_SCRAPING}resep/${req.params.key}`
    await axios(urlDetail).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-post', html).each(function() {
            if($(this).attr('post-type') != undefined) {
                const title = $(this).find('a').attr('data-tracking-value')
                const url = $(this).find('a').attr('href')
                const thumbnail = $(this).find('.wp-post-image').attr('data-lazy-src')
                const key = url.split('/')
                related_posts.push({
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
            message: err.message
        })
    }) 

    res.json(related_posts)
}