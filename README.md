# Portfolio site

A fast, responsive, dependency-free portfolio. Plain HTML, CSS and JavaScript, so there is no build step.

## Structure

```
index.html            the page
css/style.css         layout, colours, light and dark themes
js/main.js            theme toggle, mobile menu, timeline, GitHub projects
assets/               resume PDF
404.html              not-found page
```

## Preview locally

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create a **public** repository named exactly `suhashunashimarad.github.io`.
2. Upload every file in this folder to the repository root (keep `index.html` at the top level).
3. In the repository go to **Settings > Pages**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, then save.
4. After a minute or two the site is live at `https://suhashunashimarad.github.io`.

Using git:

```bash
git clone https://github.com/suhashunashimarad/suhashunashimarad.github.io.git
cd suhashunashimarad.github.io
# copy the portfolio files in here
git add .
git commit -m "Add portfolio"
git push origin main
```

## Customising

- **Text and links:** edit `index.html`.
- **Colours and fonts:** change the variables at the top of `css/style.css`.
- **Projects section:** it lists your public, non-fork GitHub repositories automatically (top 6, ranked by stars then recent activity). Change the account or the number shown in `CONFIG` at the top of `js/main.js`. Give a repository a good description on GitHub and it appears on its card.
- **Resume:** replace `assets/Suhas_Hunashimarad_Resume.pdf` with a newer file of the same name.
