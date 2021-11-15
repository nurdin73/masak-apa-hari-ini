const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"

exports.news = async (req, res) => {
    const products = []
    await axios(URL_SCRAPING).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-product', html).each(function() {
            const id = $(this).find('a').attr('data-product-id')
            const title = $(this).find('a').attr('data-product-title')
            const url = $(this).find('a').attr('href')
            const key = url.split('/')
            const category = $(this).find('a').attr('data-product-category')
            const thumbnail = $(this).find('img').attr('data-lazy-src')
            products.push({
                id: id,
                slug : key[key.length - 2],
                title: title,
                category: category,
                thumbnail: thumbnail,
                url: url,
            })
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message,
        })
    }) 
    res.json(products)
}

exports.products = async (req, res) => {
    const page = req.query.page || 1
    var urlProducts = URL_SCRAPING + 'semua-produk/'
    if(page != 1) {
        urlProducts += `page/${page}/`
    } else {
        urlProducts = URL_SCRAPING + 'semua-produk/'
    }
    const product = {
        currentPage: parseInt(page),
    }
    await axios(urlProducts).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const products = []
        var totalPage = 0;
        $('.block-product', html).each(function() {
            const id = $(this).find('a').attr('data-product-id')
            const title = $(this).find('a').attr('data-product-title')
            const url = $(this).find('a').attr('href')
            const key = url.split('/')
            const category = $(this).find('a').attr('data-product-category')
            const thumbnail = $(this).find('img').attr('data-lazy-src')
            products.push({
                id: id,
                slug : key[key.length - 2],
                title: title,
                category: category,
                thumbnail: thumbnail,
                url: url,
            })
        })
        $('a.page-numbers').each(function(i) {
            if($(this).text() != '>') {
                totalPage += 1
            }
        })
        if(page == 1) totalPage += 1
        product.totalPage = totalPage
        product.data = products
        
    }).catch(err => {
        res.status(404).json({
            message: err.message,
        })
    }) 
    res.json(product)
}

exports.productByCategory = async (req, res) => {
    const urlCategory = `${URL_SCRAPING}produks/${req.params.category}`
    const category = {}
    await axios(urlCategory).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        category.name = $('h1.title', html).text().trim()
        const products = []
        $('.block-product', html).each(function() {
            const id = $(this).find('a').attr('data-product-id')
            const title = $(this).find('a').attr('data-product-title')
            const url = $(this).find('a').attr('href')
            const key = url.split('/')
            const category = $(this).find('a').attr('data-product-category')
            const thumbnail = $(this).find('img').attr('data-lazy-src')
            products.push({
                id: id,
                slug : key[key.length - 2],
                title: title,
                category: category,
                thumbnail: thumbnail,
                url: url,
            })
        })
        category.data = products
        
    }).catch(err => {
        res.status(404).json({
            message: err.message,
        })
    }) 
    res.json(category)
}

exports.product = async (req, res) => {
    const slug = req.params.slug
    const url = `${URL_SCRAPING}produk/${slug}`
    const product = {}
    await axios(url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        product.title = $('h1.title', html).text().trim()
        product.description  = $('.the-content', html).text().trim()
        product.seeDetail = $('.see-details', html).attr('href')
        product.thumbnail = $('.featured-img', html).attr('data-lazy-src')
    }).catch(err => {
        res.status(404).json({
            message: err.message
        })
    }) 
    res.json(product)
}

exports.relatedRecipes = async (req, res) => {
    const slug = req.params.slug
    const url = `${URL_SCRAPING}produk/${slug}`
    const recipes = []
    await axios(url).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.block-post', html).each(function() {
            const link = $(this).find('a').attr('href')
            const key = link.split('/')
            recipes.push({
                key: key[key.length - 2],
                title: $(this).find('a').attr('data-tracking-value'),
                url: link,
                thumbnail: $(this).find('img').attr('data-lazy-src'),
                times: $(this).find('.time small').text().trim(),
                servings: $(this).find('.servings small').text().trim(),
                difficulty: $(this).find('.difficulty small').text().trim()
            })
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message,
        })
    }) 
    if(recipes.length > 0) {
        res.json(recipes)
    } else {
        res.status(404).json({
            message: 'related recipe not found'
        })
    }
}