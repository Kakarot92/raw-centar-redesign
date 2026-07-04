# RAW Centar za Trening i Zdravlje — redizajn

Cinematic redizajn sajta https://raw-centar.lovable.app/ — **isti tekst, iste boje**,
novi izgled: scroll-scrub hero sa oblakom krede, "Šta RAW nije" kao filmske linije
korak-po-scroll, grain + vinjeta, reveal animacije.

## Struktura

```
raw-centar/
├── index.html      # kompletan sadržaj sa originalnog sajta
├── css/style.css   # paleta kluba + svi stilovi + mobile pass
└── js/main.js      # chalk scrub, philosophy koraci, counteri, FAQ accordion
```

## Pokretanje

Otvori `index.html`, ili: `python3 -m http.server 8080`

## Paleta (css/style.css `:root`)

crna `#0A0A09` · panel `#141412` · bela `#FAFAF6` · siva `#9C9C96` · volt `#DDF522`

## Šta je zadržano 1:1 sa originala

Sav tekst: hero, intro, brojevi (20+ / 11+ / 200+), "Da li je RAW za vas" obe liste,
4 faze procesa + "Ne radimo napamet", 3 usluge, 4 problema, rezultati klijenata
(Ilija, Miljana, Nikola), 4 testimonijala, tim (uklj. njihove "placeholder" biografije
za Stefanu i Luku i "foto uskoro"), CTA, blog najava, kontakt, radno vreme, mapa,
Viber/tel linkovi, Instagram.

## ⚠ Pre predaje proveriti

1. **Slike su hotlinkovane** sa raw-centar.lovable.app (galerija ×4 + RAW badge logo).
   Rade dok je stari sajt živ — za produkciju skini fajlove u `assets/` i zameni URL-ove.
2. **FAQ odgovori 2–5**: na originalnom sajtu su bili zatvoreni u accordion-u pa nisu
   bili čitljivi. Odgovor na pitanje 1 je originalan; odgovore na pitanja 2, 3, 4 i 5
   sam napisao u duhu njihovog copy-ja — **proveriti sa klijentom / originala**.
3. Politika privatnosti u footeru vodi na `#` (kao i na originalu).
4. Blog je najava bez podstranice (kao na originalu).
