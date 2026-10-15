# Narpavi Home Foods

Static website (HTML, CSS, JavaScript). No build step, no backend. Orders are sent to WhatsApp.

## Structure
```
index.html        page content
css/style.css     all styling and colours (see :root at the top)
js/main.js        product list, basket, WhatsApp order message
assets/           put product photos / logo here
```

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## Edit products
Open `js/main.js`, change the `PRODUCTS` list at the top. To use a real photo, add `img: "assets/mango.jpg"` to that product.

## Deploy (free)
**Netlify (easiest):** go to app.netlify.com/drop and drag this whole folder in.
**GitHub Pages:** push to GitHub, then Settings > Pages > Deploy from branch `main` / root.
**Cloudflare Pages / Vercel:** connect the repo, framework "None", build command empty, output directory `/`.
