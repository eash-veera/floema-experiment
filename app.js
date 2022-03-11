require("dotenv").config()

const express = require("express")
const errorHandler = require("errorhandler")
const app = express()
const path = require("path")
const port = 3000

const Prismic = require("@prismicio/client")
const PrismicDOM = require("prismic-dom")
// const PRISMIC_ENDPOINT = process.env.PRISMIC_ENDPOINT

const initApi = req => {
    return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
    })
}

const handleLinkResolver = doc => {
    return '/'
}

app.use(errorHandler())

app.use((_req, res, next) => {

    res.locals.ctx = {
        endpoint: process.env.PRISMIC_ENDPOINT,
        linkResolver: handleLinkResolver
    }
    // res.locals.Link = handleLinkResolver
    res.locals.PrismicDOM = PrismicDOM

    next()
})

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// API integration to retrive home page data
app.get("/", async (req, res) => {
    const api = await initApi(req)
    const meta = await api.getSingle('metadata')

    res.render('pages/home', {
        meta
    })
})

// API integration to retrive about page data
app.get("/about", async (req, res) => {
    const api = await initApi(req)
    const meta = await api.getSingle('metadata')
    const about = await api.getSingle('about')
    
    res.render('pages/about', {
        meta,
        about
    })
})


// API integration to retrive collections data
app.get("/collections", async (req, res) => {
    const api = await initApi(req)
    const meta = await api.getSingle('metadata')
    const { results:collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'))

    console.log(collections)

    res.render('pages/collections', {
        meta,
        collections
    })
})

// API integration to retrive product details 
app.get("/detail/:uid", async (req, res) => {
    const api = await initApi(req)
    const meta = await api.getSingle('metadata')
    const product = await api.getByUID('product', req.params.uid, {
        fetchLinks: 'collection.title'
    })

    res.render('pages/detail', {
        meta,
        product
    })
})

app.listen(port, () =>
    console.log(`🚀 App listening on http://localhost:${port}!`)
)