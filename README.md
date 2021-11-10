# WEB SCRAPING WEBSITE https://www.masakapahariini.com/
## Documentations
Field | Description |
--- | --- | 
key | is a unique key for detail example key: 'jawara-cabai-tabur-jambal' |
type | is a type of posts. only article and recipe |
category | is a key category for detail recipe by category or article by category |
slug | is a key for detail product |
## Endpoint
### Base URL
http://localhost:3000

Endpoint | Usage | Example | 
--- | --- | --- | 
All Latest Post | /latest | 283 | 
Article or Recipe Latest Post | /:key/latest | 283 | 
Categories List Article Or Recipe | /categories/:type | 283 | 
Get Article Or Recipe By Category | /category/:type/:category | 283 | 
Recipe Featured | /recipes/featured | 283 | 
Recipe Detail | /recipe/:key | 283 | 
Recipe Related | /recipe/:key/related | 283 | 
Article Detail | /article/:category/:key | 283 | 
Related Article | /article/:category/:key/related | 283 | 
Articles By Tag | /article/:tag | 283 | 
Products | /products | 283 | 
Product News | /products/new | 283 | 
Product Detail | /product/:slug | 283 | 
Related Recipe By Product | /product/:slug/related-recipe | 283 | 
