const axios = require('axios')
const cheerio = require('cheerio')
const URL_SCRAPING = process.env.URL_SCRAPING || "https://www.masakapahariini.com/"


exports.brands = async (req, res) => {
    const brands = []
    const urlBrands = `${URL_SCRAPING}semua-produk`
    await axios(urlBrands).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.logo-wrapper', html).each(function() {
            const name = $(this).find('a').attr('data-tracking-value')
            const url = $(this).find('a').attr('href')
            const image = $(this).find('img').attr('data-lazy-src')
            brands.push({
                name: name,
                url: url,
                image: image
            })
        })
    }).catch(err => {
        res.status(404).json({
            message: err.message,
            status: err.status
        })
    }) 
    res.json(brands)
}