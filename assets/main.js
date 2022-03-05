(function () {
    const ns = "http://www.w3.org/2000/svg"
    const ua = /Android|BlackBerry|iPad|iPhone|iPod|Mobi|Opera Mini|webOS/
    const resource = location.pathname.split(".")[0].substring(1) || "index"
    const mobile = ua.test(navigator.userAgent)
    const smallWidth = 800

    const mappings = {
        A_TS_INDEX: "/",
        A_TS_FILMLY: "/filmly.html",
        A_TB_FILMLY_PROTOTYPE: "https://www.figma.com/proto/dh4MWuWdodpiI5rBy5OjvI/Filmly?page-id=23%3A12714&node-id=23%3A12715&viewport=441%2C48%2C0.43&scaling=scale-down&starting-point-node-id=23%3A12715",
        A_TB_RESUME: "/files/nusa.pdf",
        A_TB_LINKEDIN: "https://linkedin.com/in/nusademelo",
        A_TB_NOTION_READING_TRACKER: "https://nusademelo.notion.site/Nusa-s-Reading-Tracker-9de37e7359ca440d8aef3b523cd79262",

        // Books
        A_TB_DONT_MAKE_ME_THINK: "https://www.goodreads.com/book/show/18197267-don-t-make-me-think-revisited",
        A_TB_HOOKED: "https://www.goodreads.com/book/show/22668729-hooked",
        A_TB_LEAN_UX: "https://www.goodreads.com/book/show/13436116-lean-ux",
        A_TB_SPRINT: "https://www.goodreads.com/book/show/25814544-sprint",
        A_TB_THE_DESIGN_OF_EVERYDAY_THINGS: "https://www.goodreads.com/book/show/840.The_Design_of_Everyday_Things",

        // Podcasts
        A_TB_AWKWARD_SILENCES: "https://open.spotify.com/show/26btXibgh2cxTo10ey12vj",
        A_TB_DESIGN_LIFE: "https://open.spotify.com/show/60VdDbOqh5NAqa82JRsZRq",
        A_TB_THE_NNG_UX_PODCAST: "https://open.spotify.com/show/3GFTfWpfv6m8nhKsPOlT8m",
        A_TB_USER_DEFENDERS: "https://open.spotify.com/show/3UHIrTqr1Cm3BdxHEciBpi",
    }

    let currentPath = path("views", resource)
    window.addEventListener("resize", function () {
        const newPath = path("views", resource)
        if (newPath != currentPath) {
            currentPath = newPath
            load()
        }
    })

    load()
    function load() {
        document.querySelector(".loading").classList.remove("hidden")
        document.querySelector(".content").classList.add("hidden")

        Promise.all([
            fetch(currentPath).then(res => res.text()),
            fetch(path("partials", "header")).then(res => res.text()),
            fetch(path("partials", "footer")).then(res => res.text()),
        ]).then((sources) => {

            const main = document.getElementsByTagName("main")[0]
            main.innerHTML = cleanup(sources[0])

            document.querySelector("header .container").innerHTML = cleanup(sources[1])
            document.querySelector("footer .container").innerHTML = cleanup(sources[2])

            decorate(main)
            decorate(document.querySelector("header"))
            decorate(document.querySelector("footer"))

            document.querySelector(".loading").classList.add("hidden")
            document.querySelector(".content").classList.remove("hidden")

            if (mobile) {
                document.querySelector("header").classList.add("mobile")
                document.querySelector("footer").classList.add("mobile")
            }
        })
    }

    function decorate(root) {
        const svg = root.getElementsByTagNameNS(ns, "svg")[0]
        svg.setAttribute("preserveAspectRatio", "xMinYMin")

        const defs = document.createElementNS(ns, "defs")
        svg.prepend(defs)

        const style = document.createElement("style")
        style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap')`
        style.setAttribute("type", "text/css")
        defs.append(style)

        Object.entries(mappings).forEach(function([id, href]) {
            const el = root.querySelector(`#${id}`)
            if (!el) {
                return
            }

            const a = document.createElementNS(ns, "a")
            if (id.startsWith("A_TB_")) {
                a.setAttribute("target", "_blank")
            }

            a.setAttribute("href", href)
            el.before(a)
            a.append(el)
        })
    }

    function cleanup(source) {
        const dom = new DOMParser().parseFromString(source, "text/html")
        dom.querySelectorAll("[filter]").forEach((el) => {
            el.removeAttribute("filter")
        })
        return dom.body.innerHTML
    }

    function path(dir, resource) {
        const small = window.innerWidth <= smallWidth
        const sub = mobile || small ? "mobile" : "desktop"
        return `/${dir}/${sub}/${resource}.svg`
    }
})()
