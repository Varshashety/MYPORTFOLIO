# MYPORTFOLIO

A premium dark-themed portfolio for Varshini Mithinti, built as a modern single-page experience with glassmorphism styling, subtle neon accents, animated hero interactions, and a local resume download CTA.

## Highlights

- Hero section with strong CTA buttons
- Glassmorphism UI with dark futuristic styling
- Animated hero reveal and interactive parallax effects
- Responsive layout for desktop and mobile
- Resume download support via a local PDF asset
- Project, skills, experience, and contact sections

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local assets for images and resume PDF

## Project Structure

```text
MYPORTFOLIO/
├─ Portfolio/
│  ├─ assets/
│  │  └─ Varshini_Mithinti_Resume.pdf
│  ├─ index.html
│  ├─ profile.jpeg
│  ├─ resume.html
│  ├─ script.js
│  └─ styles.css
├─ index.html
├─ netlify.toml
└─ resume.html
```

The main site source lives in `Portfolio/`. The root-level `index.html` and `resume.html` are lightweight redirects so the repo can still work cleanly with hosting providers that serve from the repository root.

## Local Development

1. Open `Portfolio/index.html` in your browser, or use a local server.
2. If you prefer a quick static server, run one from the repo root and open the `Portfolio/` path.

Example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/Portfolio/
```

## Resume Download

The portfolio includes a downloadable resume at:

```text
Portfolio/assets/Varshini_Mithinti_Resume.pdf
```

The hero button and navbar resume link both point to that local PDF.

## Deployment Notes

- GitHub repository: `Varshashety/MYPORTFOLIO`
- Netlify publish directory: `Portfolio`
- Vercel can also import the same repo and serve the portfolio from the `Portfolio/` folder

## Customization

If you want to update the resume or visuals later:

- Replace the PDF in `Portfolio/assets/`
- Update the hero copy in `Portfolio/index.html`
- Tweak the styling in `Portfolio/styles.css`
- Adjust interaction logic in `Portfolio/script.js`

## License

No license has been added yet. Add one if you want to open-source the project more formally.
