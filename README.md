# API https://www.masakapahariini.com/
Food recipes, article and product api bahasa Indonesia 🇮🇩 build with Cheerio and express js 🌸

## Documentations
Field | Description |
--- | --- | 
key | is a unique key for detail article or recipe |
type | is a type of posts. only article and recipe |
category | is a key category for detail recipe by category or article by category |
slug | is a key for detail product |
## Endpoint
###### Base URL
`http://localhost:3000`

Endpoint | Usage | Params | Query | Example | 
--- | --- | --- | --- | --- | 
All Latest Post | `/latest` | - | - | - | 
Article or Recipe Latest Post | `/:key/latest` | `key : article or recipe` | - | `article/latest` | 
Categories List Article Or Recipe | `/categories/:type` | `key: article or recipe` | - | `categories/recipe` | 
Get Article Or Recipe By Category | `/category/:type/:category` | `type: article or recipe` `category: key category` | 283 | `category/recipe/resep-dessert` | 
Recipe Featured | `/recipes/featured` | - | - | - | 
Recipe Detail | `/recipe/:key` | `key: key recipe` | - | `recipe/resep-mie-shirataki-goreng` | 
Recipe Related | `/recipe/:key/related` | `key: key recipe` | - | `recipe/resep-mie-shirataki-goreng/related` | 
Article Detail | `/article/:category/:key` | `key: key article` `category: key category` | - | `/article/makanan-gaya-hidup/cara-mudah-gaya-hidup-sehat` | 
Related Article | `/article/:category/:key/related` | `key: key article` `category: key category` | - | `/article/makanan-gaya-hidup/cara-mudah-gaya-hidup-sehat/related` | 
Articles By Tag | `/article/:tag` | `tag: key tag` | - | `/article/rendah-karbohidrat` | 
Products | `/products` | - | `page: page of product` | - | 
Product News | `/products/new` | - | - | - | 
Product Detail | `/product/:slug` | `slug: key of product` | - | `/product/jawara-cabai-tabur-jambal` | 
Related Recipe By Product | `/product/:slug/related-recipe` | `slug: key of product` | - | `/product/jawara-cabai-tabur-jambal/related-recipe` | 

### Credits
###### Copyright &copy; 2021 Nurdin
