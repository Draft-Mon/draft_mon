#!/usr/bin/env python3
"""Extrait les textes français affichés par le jeu (fichiers .js de l'interface et pages HTML) pour la
traduction. Chaque texte devient une clé : les morceaux variables `${...}` des gabarits deviennent
{0}, {1}... et les gabarits HTML sont découpés aux balises, comme le navigateur découpe le texte
affiché. Usage : python3 outils/extraire-textes.py > textes.json
Les clés servent ensuite dans i18n/en.js et i18n/es.js (voir core/i18n.js)."""
import re, json, sys, glob, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Fichiers de données exclus : leurs noms (Pokémon, attaques, objets...) sont traduits à part, et les
# descriptions longues restent en français pour l'instant.
EXCLUDE = {'pokemon', 'moves', 'outils'}
EXCLUDE_FILES = {'ui/patch-notes.js', 'ui/dev-mode.local.js', 'pokemon/showdown-names.js'}

def js_literals(src):
    """Renvoie les chaînes et gabarits d'un fichier JS : liste de (texte, est_gabarit) où les ${...}
    d'un gabarit sont remplacés par \x00. Les gabarits imbriqués sont aussi renvoyés à part."""
    out = []
    i, n = 0, len(src)
    def read_template(i):
        # i pointe juste après le ` ouvrant ; renvoie (texte avec \x00, index après le ` fermant)
        buf = []
        while i < n:
            c = src[i]
            if c == '\\':
                buf.append(src[i:i+2]); i += 2; continue
            if c == '`':
                return ''.join(buf), i+1
            if c == '$' and i+1 < n and src[i+1] == '{':
                depth, j = 1, i+2
                expr_start = j
                while j < n and depth:
                    cj = src[j]
                    if cj in '\'"':
                        j = skip_string(j)
                        continue
                    if cj == '`':
                        inner, j = read_template(j+1)
                        out.append((inner, True))
                        continue
                    if cj == '{': depth += 1
                    elif cj == '}': depth -= 1
                    j += 1
                expr = src[expr_start:j-1]
                for m in re.finditer(r"'((?:\\.|[^'\\\n])*)'|\"((?:\\.|[^\"\\\n])*)\"", expr):
                    out.append((m.group(1) if m.group(1) is not None else m.group(2), False))
                buf.append('\x00'); i = j; continue
            buf.append(c); i += 1
        return ''.join(buf), i
    def skip_string(i):
        q = src[i]; i += 1
        while i < n and src[i] != q:
            if src[i] == '\\': i += 1
            if src[i] == '\n': break
            i += 1
        return i+1
    while i < n:
        c = src[i]
        if src.startswith('//', i):
            i = src.find('\n', i); i = n if i < 0 else i; continue
        if src.startswith('/*', i):
            i = src.find('*/', i); i = n if i < 0 else i+2; continue
        if c in '\'"':
            j = skip_string(i)
            out.append((src[i+1:j-1], False)); i = j; continue
        if c == '`':
            t, i = read_template(i+1)
            out.append((t, True)); continue
        i += 1
    return out

def unescape_js(s):
    return (s.replace("\\'", "'").replace('\\"', '"').replace('\\`', '`')
             .replace('\\n', '\n').replace('\\\\', '\\'))

TAG = re.compile(r'<[^>]*>')
def segments(text):
    """Découpe un texte (éventuellement HTML) en morceaux de texte affichés, avec {0}, {1}... à la
    place des parties variables. Les balises et les attributs sont ignorés, sauf title/placeholder/
    aria-label/alt dont la valeur est aussi un texte affiché."""
    segs = []
    for m in re.finditer(r'\b(?:title|placeholder|aria-label|alt)=(["\'])(.*?)\1', text):
        segs.append(m.group(2))
    segs += TAG.split(text)
    out = []
    for s in segs:
        k = 0
        def ph(_):
            nonlocal k
            r = '{%d}' % k; k += 1; return r
        s = re.sub('\x00', ph, s)
        s = html.unescape(unescape_js(s)).strip()
        s = re.sub(r'\s+', ' ', s)
        out.append(s)
    return out

FR = re.compile(r"[A-Za-zÀ-ÿŒœ]{2,}")
def is_text(s):
    if len(s) < 2 or not FR.search(s): return False
    letters = re.sub(r'\{\d+\}', '', s)
    if not FR.search(letters): return False
    # identifiants techniques, classes CSS, sélecteurs, chemins, couleurs...
    if re.fullmatch(r"[\w\-./:#%()\[\]=,]+", s) and not re.search(r"[À-ÿ]", s) and ' ' not in s and not s[:1].isupper():
        return False
    if re.search(r"(^|\s)(var\(|rgba?\(|\d+px|translate|linear-gradient|ph-bold|https?://)", s): return False
    if re.fullmatch(r"[a-z]+(?:[A-Z][a-z]+)+", s): return False  # camelCase
    return True

def main():
    keys = {}
    files = [f for f in glob.glob(os.path.join(ROOT, '**/*.js'), recursive=True)]
    for f in sorted(files):
        rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
        top = rel.split('/')[0]
        if top.startswith('.') or top in EXCLUDE or rel in EXCLUDE_FILES or rel.startswith('i18n/') or 'graphify' in rel:
            continue
        for lit, _ in js_literals(open(f, encoding='utf-8').read()):
            for s in segments(lit):
                if is_text(s): keys.setdefault(s, rel)
    for page in ['index.html']:
        src = open(os.path.join(ROOT, page), encoding='utf-8').read()
        body = src[src.index('<body'):]
        body = re.sub(r'<(script|style|svg)[^>]*>.*?</\1>', '', body, flags=re.S)
        for s in segments(body):
            if is_text(s): keys.setdefault(s, page)
    json.dump(keys, sys.stdout, ensure_ascii=False, indent=0, sort_keys=True)

if __name__ == '__main__':
    main()
