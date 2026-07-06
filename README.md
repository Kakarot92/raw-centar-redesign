# RAW Centar — v4 "Awwwards" redizajn

Tipografski brutalizam: preloader sa brojačem, custom cursor, monument-tipografija,
horizontalni pinned proces, sticky-stack usluge, editorial linije umesto kartica,
grain + vinjeta, marquee. **Tekst, boje i sekcije identični originalu.**

## Struktura
```
raw-centar/
├── index.html      # sve sekcije, originalan copy
├── css/style.css   # kompletan v4 dizajn sistem
└── js/main.js      # preloader, cursor, horizontalni proces, philosophy,
                    # counteri, meni, FAQ, sat
```

## Pokretanje
`index.html` direktno, ili `python3 -m http.server 8080`

## Paleta
crna `#0A0A09` · panel `#141412` · bela `#FAFAF6` · siva `#9C9C96` · volt `#DDF522`

## ⚠ Pre predaje
1. Slike (galerija ×4 + badge logo) su hotlinkovane sa raw-centar.lovable.app —
   za produkciju skini fajlove lokalno i zameni URL-ove.
2. FAQ odgovori 2–5 su pisani u duhu copy-ja (original ih krije u accordion-u) —
   proveriti sa klijentom. Odgovor 1 je originalan.
3. Politika privatnosti vodi na `#` (kao original); blog je najava.
4. Sve animacije poštuju `prefers-reduced-motion`; bez JS-a sadržaj je čitljiv
   (preloader i maske su isključeni preko `html.js` gejta).
