require('dotenv').config()
require('express-group-routes')
const express = require('express')

const PORT = process.env.PORT || 3000


const app = express()
app.use(express.json())

const RecipesController = require('./app/controllers/RecipesController')
const ArticleController = require('./app/controllers/ArticlesController')
const CategoriesController = require('./app/controllers/CategoriesController')
const ProductsController = require('./app/controllers/ProductsController')
const PostsController = require('./app/controllers/PostsController')

app.get('/', (req, res) => {
    res.json({
        title: "API Food Recipe, Article And Product",
        desc: "This API is scraping data from website https://www.masakapahariini.com/",
        documentation: "https://github.com/nurdin73/masak-apa-hari-ini",
        base_url: "https://scrapping-mahi.herokuapp.com/api/v1"
    })
})
app.group('/api/v1', router => {
    // get all latest post
    router.get('/latest', ArticleController.latest)
    // get all latest post by article or recipe
    // key = article / recipe
    router.get('/:key/latest', ArticleController.latest)

    // get all categories by article or recipe
    // type = article / recipe
    router.get('/categories/:type', CategoriesController.categories)
    // get post articler or recipe by category
    // type = article / recipe
    // category = key category
    router.get('/category/:type/:category', CategoriesController.category)
    
    // get featured recipes
    router.get('/recipes/featured', RecipesController.featuredRecipes)
    // get detail recipe
    // key = key recipe
    router.get('/recipe/:key', RecipesController.recipe)
    // get related recipes by key
    // key = key recipe
    router.get('/recipe/:key/related', RecipesController.related)

    // article
    // key = key article
    // category = key category
    router.get('/article/:category/:key', ArticleController.article)
    // key = key article
    // category = key category
    router.get('/article/:category/:key/related', ArticleController.related)
    
    // article by tag
    router.get('/article/:tag', ArticleController.tag)

    // search post
    router.get('/search/:query', PostsController.search)

    // products news
    router.get('/products/new', ProductsController.news)
    // products lists
    router.get('/products', ProductsController.products)
    // product by category
    // category = key category product
    router.get('/products/:category', ProductsController.productByCategory)
    // product detail
    // slug = key product
    router.get('/product/:slug', ProductsController.product)
    // related recipe by product
    // slug = key product
    router.get('/product/:slug/related-recipe', ProductsController.relatedRecipes)
})

// app.get('/api/v1/recipes/featured', RecipesController.featuredRecipes)

app.listen(PORT, () => { console.log(`Server running on Port ${PORT}`) })