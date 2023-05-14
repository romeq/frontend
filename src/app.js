const express = require("express")
const { default: hljs } = require("highlight.js")
const process = require("process")

const API_URL = process.env.API_URL || "https://api.pastebin.fi"

function getHeadProperties(title, description, url) {
    return {
        title: `${title} - Pastebin.fi`,
        description: description,
        url: `https://pastebin.fi${url}`,
    }
}

function getApp() {
    const app = express()
    app.use("/static", express.static("static")) // css & js files
    app.use("/public", express.static("public")) // robots.txt & .well-known
    app.use(express.urlencoded({ extended: true }))

    //TODO: don't use hardcoded values
    app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"])
    app.set("view engine", "pug")
    return app
}

function registerRoutes(app) {
    app.get("/", (_, res) => {
        res.render("index", {
            lorem: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus dui hac nostra mattis aptent lorem. Auctor nec nullam justo purus aptent placerat sociosqu.\n\nHendrerit odio adipiscing nam magna maecenas purus varius. Dictumst torquent venenatis non conubia aenean commodo eu. Ante in condimentum conubia arcu diam blandit fusce.\n\nLaoreet venenatis porta cubilia elit mus molestie potenti. Consectetur curabitur molestie eget fermentum consectetur amet fermentum. Lorem blandit proin proin odio nostra nisl eleifend.`,
            head: getHeadProperties("Etusivu", "Pastebin.fi on suomalainen tekstiliitospalvelu.", "/"),
        })
    })

    app.post("/", async (req, res) => {
        const pasteReq = await fetch(`${API_URL}/pastes`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Forwarder-For": req.ip,
            },
            body: JSON.stringify({
                title: req.body.title,
                paste: req.body.paste,
                private: req.body.private === "on" ? true : false,
            }),
        })
        const pasteJson = await pasteReq.json()

        let id = undefined
        if (pasteReq.status === 409) {
            id = pasteJson.data.pasteIdentifier
            console.log(`New paste resolved with id ${id} from ip ${req.ip}`)
        } else {
            id = pasteJson.id
            console.log(`New paste created with id ${id} from ip ${req.ip}`)
        }

        res.redirect(`/p/${id}`)
    })

    app.get("/about", async (req, res) => {
        const metricsReq = await fetch(`${API_URL}/metrics`)
        res.render("about", {
            metrics: await metricsReq.json(),
            head: getHeadProperties("Tietoa", "Mikä ihmeen pastebin.fi?", "/about"),
        })
    })

    app.get("/browse", async (req, res) => {
        let sorting = req.query.sorting || "date"
        if (req.query.sort_method === "dec") sorting = "-" + req.query.sorting

        const searchParams = new URLSearchParams({
            sorting,
            q: req.query.search || "",
        })

        const browseReq = await fetch(`${API_URL}/pastes?` + searchParams)
        const browseJson = await browseReq.json()

        if (browseReq.status != 200) res.render("404", { message: browseJson.message })
        res.render("browse", {
            pastes: browseJson,
            head: getHeadProperties("Selaa", "Selaa viimeisimpiä tekstiliitoksia.", "/browse"),
        })
    })

    app.get("/p/:id", async (req, res) => {
        const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`)
        const pasteJson = await pasteReq.json()
        if (pasteReq.status != 200) res.render("404", { message: pasteJson.message })
        res.render("paste", {
            paste: {
                title: pasteJson.title,
                id: pasteJson.id,
                meta: pasteJson.meta,
                date: pasteJson.date,
                hidden: pasteJson.hidden,
                content: hljs.highlightAuto(pasteJson.content).value,
            },
            head: getHeadProperties(
                `${pasteJson.title}`,
                `${pasteJson.meta.views} katselukertaa | ${pasteJson.meta.size} tavua | ${pasteJson.date}`,
                "https://pastebin.fi/p/" + req.params.id
            ),
        })
    })

    app.get("/r/:id", async (req, res) => {
        const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`)
        const pasteJson = await pasteReq.json()
        if (pasteReq.status != 200) return res.type("text").status(404).send("not found")
        return res.type("text").send(pasteJson.content)
    })

    app.get("/dl/:id", async (req, res) => {
        const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`)
        const pasteJson = await pasteReq.json()
        if (pasteReq.status != 200) return res.type("text").status(404).send("not found")
        return res.attachment(`${pasteJson.title}.txt`).send(pasteJson.content)
    })

    app.use((_, res, next) => {
        res.render("404", {
            message: "Sivua ei löytynyt.",
            head: getHeadProperties("404", "Sivua ei löytynyt.", "/"),
        })
        res.status(404)
    })

    return app
}

;(async () => {
    const port = 3000
    registerRoutes(getApp()).listen(port, () => {
        console.log(`Pastebin frontend is listening on port ${port}`)
    })
})()
