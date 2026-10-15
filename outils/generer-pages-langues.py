#!/usr/bin/env python3
"""Génère les pages du jeu en anglais et en espagnol (en/index.html et es/index.html) à partir de
index.html, la seule page à modifier à la main. À relancer après chaque modification de index.html :

    python3 outils/generer-pages-langues.py

Chaque page générée :
- déclare sa langue (<html lang="en">), qui fixe la langue de l'interface (voir core/i18n.js) ;
- utilise <base href="../"> pour retrouver les scripts, styles et images du dossier principal ;
- charge son dictionnaire (i18n/en.js ou i18n/es.js) avant core/i18n.js ;
- a ses propres balises de référencement (titre, description, aperçu de lien, adresse canonique) ;
- a déjà ses textes fixes traduits, pour les moteurs de recherche et pour éviter un affichage en
  français le temps que les scripts se chargent. Les textes ajoutés par les scripts sont traduits
  au moment de leur affichage par core/i18n.js.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://draft-mon.github.io/draft_mon/'

META = {
    'en': {
        'locale': 'en_US',
        'title': 'Draft Mon — Free Pokémon roguelike browser game',
        'description': 'Draft Mon is a free Pokémon browser game: draft 6 Pokémon, prepare your team and climb the Battle Tower floor by floor, facing Mini-Bosses and Type Masters.',
        'alt': 'Draft Mon — Battle Tower',
        'genre': ['Strategy', 'Roguelike'], 'platform': 'Web browser', 'os': 'Any',
    },
    'es': {
        'locale': 'es_ES',
        'title': 'Draft Mon — Juego roguelike de Pokémon gratis para navegador',
        'description': 'Draft Mon es un juego de Pokémon gratis para navegador: elige 6 Pokémon, prepara tu equipo y sube la Torre Batalla piso a piso, frente a Minijefes y Maestros de Tipo.',
        'alt': 'Draft Mon — Torre Batalla',
        'genre': ['Estrategia', 'Roguelike'], 'platform': 'Navegador web', 'os': 'Cualquiera',
    },
}
# Liens vers des pages qui existent aussi dans la langue (les autres restent en français).
TRANSLATED_LINKS = ['guide.html', 'faq.html', 'notes-de-mise-a-jour.html']


def load_dict(lang):
    src = open(os.path.join(ROOT, 'i18n', lang + '.js'), encoding='utf-8').read()
    ui = json.loads(re.search(r'\nui: (\{.*?\n\}),\nnames', src, re.S).group(1))
    return ui


def attr_escape(s):
    return s.replace('&', '&amp;').replace('"', '&quot;')


def translate_body(body, ui):
    """Traduit les textes fixes du corps de la page (textes exacts du dictionnaire)."""
    def tr_text(m):
        raw = m.group(1)
        core = raw.strip()
        key = re.sub(r'\s+', ' ', core.replace('&amp;', '&'))
        if core and key in ui:
            return '>' + raw.replace(core, ui[key].replace('&', '&amp;')) + '<'
        return m.group(0)

    def tr_attr(m):
        key = m.group(3).replace('&amp;', '&').replace('&quot;', '"')
        return m.group(1) + '=' + m.group(2) + (attr_escape(ui[key]) if key in ui else m.group(3)) + m.group(2)

    # Les scripts, styles et dessins SVG ne contiennent pas de texte à traduire.
    parts = re.split(r'(<(?:script|style|svg)\b.*?</(?:script|style|svg)>)', body, flags=re.S)
    for i in range(0, len(parts), 2):
        p = re.sub(r'>([^<>]+)<', tr_text, parts[i])
        p = re.sub(r'\b(title|placeholder|aria-label|alt)=(["\'])(.*?)\2', tr_attr, p)
        parts[i] = p
    return ''.join(parts)


def sub1(s, old, new):
    assert s.count(old) == 1, (old, s.count(old))
    return s.replace(old, new)


def build(lang):
    m = META[lang]
    ui = load_dict(lang)
    s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    head, body = s.split('</head>', 1)

    head = sub1(head, '<!DOCTYPE html>\n<html lang="fr">',
                '<!DOCTYPE html>\n<!-- Fichier généré par outils/generer-pages-langues.py à partir de index.html : ne pas modifier à la main. -->\n'
                f'<html lang="{lang}">')
    head = sub1(head, '<meta charset="UTF-8">\n', '<meta charset="UTF-8">\n<base href="../">\n')
    fr_title = re.search(r'<title>(.*?)</title>', head).group(1)
    fr_desc = re.search(r'<meta name="description" content="(.*?)">', head).group(1)
    head = head.replace(fr_title, m['title']).replace(fr_desc, m['description'])
    head = sub1(head, f'<link rel="canonical" href="{BASE}">', f'<link rel="canonical" href="{BASE}{lang}/">')
    head = sub1(head, '<meta property="og:locale" content="fr_FR">', f'<meta property="og:locale" content="{m["locale"]}">')
    head = sub1(head, f'<meta property="og:url" content="{BASE}">', f'<meta property="og:url" content="{BASE}{lang}/">')
    head = sub1(head, '<meta property="og:image:alt" content="Draft Mon — Tour de Combat">', f'<meta property="og:image:alt" content="{m["alt"]}">')
    head = sub1(head, f'"url": "{BASE}",', f'"url": "{BASE}{lang}/",')
    head = sub1(head, '"inLanguage": "fr",', f'"inLanguage": "{lang}",')
    head = sub1(head, '"alternateName": "Draft Mon — Tour de Combat",', f'"alternateName": "{m["alt"]}",')
    head = sub1(head, '"genre": ["Stratégie", "Roguelike"],', '"genre": ' + json.dumps(m['genre'], ensure_ascii=False) + ',')
    head = sub1(head, '"gamePlatform": "Navigateur web",', f'"gamePlatform": "{m["platform"]}",')
    head = sub1(head, '"operatingSystem": "Tous",', f'"operatingSystem": "{m["os"]}",')

    body = translate_body(body, ui)
    body = sub1(body, '<script defer src="core/i18n.js"></script>',
                f'<script defer src="i18n/{lang}.js"></script>\n<script defer src="core/i18n.js"></script>')
    for page in TRANSLATED_LINKS:
        body = body.replace(f'href="{page}"', f'href="{lang}/{page}"')

    out_dir = os.path.join(ROOT, lang)
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8', newline='\n') as f:
        f.write(head + '</head>' + body)
    # Textes fixes sans traduction dans le dictionnaire (à ajouter dans i18n/en.js et i18n/es.js).
    texts = re.findall(r'>([^<>]*[A-Za-zÀ-ÿ]{3}[^<>]*)<', re.sub(r'<(script|style|svg)\b.*?</\1>', '', body, flags=re.S))
    fr_keys = set(json.loads(re.search(r'\nui: (\{.*?\n\}),\nnames', open(os.path.join(ROOT, 'i18n', 'en.js'), encoding='utf-8').read(), re.S).group(1)))
    left = [t.strip() for t in texts if re.sub(r'\s+', ' ', t.strip()) in fr_keys and re.sub(r'\s+', ' ', t.strip()) not in ui.values()]
    print(f'{lang}/index.html généré' + (f' — textes non traduits : {left}' if left else ''))


if __name__ == '__main__':
    for lang in META:
        build(lang)
