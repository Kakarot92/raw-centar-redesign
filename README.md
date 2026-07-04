# RAW Centar — redizajn

Kratak pregled izmena urađenih na sajtu:

- **Hero sekcija** — animirana linija/grafikon u pozadini je maskirana da ne prelazi preko naslova i dugmeta (ranije je gazila tekst).
- **"Šta RAW nije" sekcija** — uklonjene tačke na kraju rečenica (čist display-tekst).
- **Rezultati klijenata** — ime klijenta izdvojeno od labele "Klijent" u zaseban red, kartice poravnate na dnu bez obzira na dužinu teksta, broj (npr. "10/10 → 2/10") sad uvek staje u jednu liniju.
- **Brojevi iskustva (20+/11+/200+)** — ispravljen CSS bag: pogrešan selektor je kvario prikaz broja (ostajao je sitan i siv umesto velik i volt-boje).

## Struktura

```
raw-centar/
├── index.html      # kompletan sadržaj sajta
├── css/style.css   # stilovi
└── js/main.js      # animacije, brojači, FAQ accordion
```

## Pokretanje

Otvori `index.html`, ili: `python3 -m http.server 8080`
