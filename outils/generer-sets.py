#!/usr/bin/env python3
"""Génère pokemon/tournament-sets.js : les sets joués en compétition pour chaque Pokémon du jeu, tirés des
statistiques d'usage officielles de Smogon/Pokémon Showdown (https://www.smogon.com/stats/), qui
recensent les équipes des parties classées et des tournois. Formats utilisés : Pokémon Champions (OU,
BSS, UU, VGC) en priorité — le même système de points de stats (0-32, 66 au total) que Draft Mon —
puis les formats 1 contre 1 de la 9e génération (OU, Ubers, UU, RU, NU, PU, ZU, National Dex, LC, NFE).

Pour chaque espèce on garde jusqu'à 5 sets différents (TOURNAMENT_SETS), utilisés par la Tour (un set
tiré au hasard à chaque adversaire) et proposés dans le Builder d'équipe — plus 2 sets de Méga-Évolution
au plus, pour le Builder seulement —, plus le set le plus joué en
combat double VGC (VGC_SETS, Builder seulement). Les statistiques ne donnent que des répartitions
séparées (objets, talents, EV, attaques) : chaque set part d'un des objets les plus joués, puis prend la
répartition d'EV et les attaques les plus jouées qui vont avec. Les sets d'analyses Smogon
(pokemon/smogon-sets.js) et les sets curés du jeu (pokemon/competitive-sets.js) complètent les espèces
qui ont moins de 5 sets.

Utilisation :
1. Ouvrir le jeu en local (python3 -m http.server 8000) et coller dans la console du navigateur :
     copy(JSON.stringify((()=>{const o={species:{},megas:{},items:Object.keys(ITEMS)};tbSpeciesList().forEach(e=>{const m=defaultMember(e.lineId,e.stage,e.branch);
     o.species[e.sp.name]={final:e.final||!!(o.species[e.sp.name]||{}).final,abilities:abilitiesFor(m),moves:[...new Set(movepoolFor(m))].filter(id=>MOVES[id])};
     Object.keys(e.sp.forms||{}).forEach(k=>{if(ITEMS[k]&&ITEMS[k].megaStone)o.megas[k]={base:e.sp.name,name:e.sp.forms[k].name};});});return o;})()))
   puis enregistrer le presse-papiers dans un fichier (ex. /tmp/jeu.json) ;
2. python3 outils/generer-sets.py /tmp/jeu.json [AAAA-MM]
   (AAAA-MM : mois des statistiques, le dernier mois publié par défaut). Les fichiers téléchargés sont
   gardés dans /tmp/draftmon-stats/ pour les relances.
"""
import json, math, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = '/tmp/draftmon-stats'
MAX_SETS = 5

# (fichier de stats, libellé affiché, poids du format). Les formats Champions passent en premier.
FORMATS = [
    ('gen9championsou-1630', 'Champions OU', 1.3),
    ('gen9championsbssregmc-1630', 'Champions BSS', 1.2),
    ('gen9championsuu-1630', 'Champions UU', 1.0),
    ('gen9ou-1695', 'OU', 1.0),
    ('gen9ubers-1630', 'Ubers', 0.9),
    ('gen9nationaldex-1630', 'National Dex', 0.9),
    ('gen9uu-1630', 'UU', 0.8),
    ('gen9nationaldexubers-1630', 'National Dex Ubers', 0.8),
    ('gen9nationaldexuu-1630', 'National Dex UU', 0.8),
    ('gen9ru-1630', 'RU', 0.8),
    ('gen9nu-1630', 'NU', 0.8),
    ('gen9pu-1630', 'PU', 0.8),
    ('gen9zu-1630', 'ZU', 0.8),
    ('gen9lc-1630', 'LC', 0.7),
    ('gen9nfe-1630', 'NFE', 0.7),
]
VGC_FORMAT = ('gen9championsvgc2026regmc-1630', 'Champions VGC')
# Formats 1 contre 1 des analyses Smogon gardés en complément.
ANALYSIS_TIERS = {'OU', 'UBERS', 'Ubers UU', 'UU', 'RU', 'NU', 'PU', 'ZU', 'NatDex', 'NatDex UU', 'NatDex Ubers', 'LC', 'NFE', 'BSS', 'Monotype', '1v1'}
MIN_COUNT = 100           # nombre minimum d'équipes pour qu'un Pokémon soit pris en compte dans un format
MIN_ITEM_SHARE = 0.15     # un objet ouvre un set à part s'il est tenu par au moins 15 % des joueurs
STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']
NATURES = {
    'Hardy': (None, None), 'Docile': (None, None), 'Serious': (None, None), 'Bashful': (None, None), 'Quirky': (None, None),
    'Lonely': ('atk', 'def'), 'Brave': ('atk', 'spe'), 'Adamant': ('atk', 'spa'), 'Naughty': ('atk', 'spd'),
    'Bold': ('def', 'atk'), 'Relaxed': ('def', 'spe'), 'Impish': ('def', 'spa'), 'Lax': ('def', 'spd'),
    'Timid': ('spe', 'atk'), 'Hasty': ('spe', 'def'), 'Jolly': ('spe', 'spa'), 'Naive': ('spe', 'spd'),
    'Modest': ('spa', 'atk'), 'Mild': ('spa', 'def'), 'Quiet': ('spa', 'spe'), 'Rash': ('spa', 'spd'),
    'Calm': ('spd', 'atk'), 'Gentle': ('spd', 'def'), 'Sassy': ('spd', 'spe'), 'Careful': ('spd', 'spa'),
}
CHOICE_OK_STATUS = {'trick', 'switcheroo'}
# Objets qui vont avec une répartition d'EV offensive ou défensive (pour choisir la répartition d'un set).
OFFENSIVE_ITEMS = {'lifeorb', 'expertbelt', 'focussash', 'weaknesspolicy', 'boosterenergy', 'loadeddice', 'throatspray',
                   'whiteherb', 'scopelens', 'razorclaw', 'muscleband', 'wiseglasses', 'charcoal', 'mysticwater', 'miracleseed',
                   'magnet', 'nevermeltice', 'blackbelt', 'poisonbarb', 'softsand', 'sharpbeak', 'twistedspoon', 'silverpowder',
                   'hardstone', 'spelltag', 'dragonfang', 'blackglasses', 'metalcoat', 'silkscarf', 'fairyfeather', 'pixieplate'}
DEFENSIVE_ITEMS = {'rockyhelmet', 'leftovers', 'blacksludge', 'eviolite', 'assaultvest', 'redcard', 'mentalherb', 'covertcloak'}


def to_id(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower())


def js_object(path, name):
    src = open(os.path.join(ROOT, path), encoding='utf-8').read()
    return json.loads(re.search(r'const ' + name + r' = (\{.*?\});\n', src, re.S).group(1))


def fetch(fmt, month):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f'{month}-{fmt}.json')
    if not os.path.exists(path):
        url = f'https://www.smogon.com/stats/{month}/chaos/{fmt}.json'
        print('Téléchargement', url)
        urllib.request.urlretrieve(url, path)
    return json.load(open(path, encoding='utf-8'))


def last_month():
    html = urllib.request.urlopen('https://www.smogon.com/stats/').read().decode()
    return sorted(re.findall(r'href="(\d{4}-\d{2})/"', html))[-1]


def main():
    game = json.load(open(sys.argv[1], encoding='utf-8'))
    month = sys.argv[2] if len(sys.argv) > 2 else last_month()
    sd_species, sd_items = js_object('pokemon/showdown-names.js', 'SD_SPECIES'), js_object('pokemon/showdown-names.js', 'SD_ITEMS')
    sd_abilities, sd_moves = js_object('pokemon/showdown-names.js', 'SD_ABILITIES'), js_object('pokemon/showdown-names.js', 'SD_MOVES')
    sd_types = js_object('pokemon/showdown-names.js', 'SD_TYPES')
    species_fr = {to_id(en): fr for fr, en in sd_species.items()}
    item_key = {to_id(en): k for k, en in sd_items.items()}
    ability_fr = {to_id(en): fr for fr, en in sd_abilities.items()}
    move_key = {to_id(en): k for k, en in sd_moves.items()}
    type_key = {to_id(en): k for k, en in sd_types.items()}
    mega_by_name = {m['name']: (k, m['base']) for k, m in game['megas'].items()}
    move_meta = {}
    for m in re.finditer(r"\n  (\w+):\{pp:\d+,name:\"[^\"]*\",type:'(\w+)',cat:'(\w+)'", open(os.path.join(ROOT, 'moves/moves.js'), encoding='utf-8').read()):
        move_meta[m.group(1)] = (m.group(2), m.group(3))

    def species_of(sd_name):
        """Espèce du jeu (et Méga-Gemme imposée) d'un nom de Showdown, ou (None, None)."""
        fr = species_fr.get(to_id(sd_name))
        if fr in game['species']:
            return fr, None
        if fr in mega_by_name:
            stone, base = mega_by_name[fr]
            return base, stone
        return None, None

    def usage_sets(data, label, factor, sp_name, stone, entry):
        info = game['species'][sp_name]
        legal_moves = set(info['moves'])
        total = sum(entry['Abilities'].values()) or 1
        share = lambda d: sorted(((k, v / total) for k, v in d.items()), key=lambda x: -x[1])
        # Talent : le plus joué parmi ceux de l'espèce dans le jeu (pour une Méga, celui de sa forme
        # de base, que la Méga-Évolution remplace en combat).
        ability = None
        if not stone:
            for a, _ in share(entry['Abilities']):
                if ability_fr.get(a) in info['abilities']:
                    ability = ability_fr[a]
                    break
        if stone:
            items = [(stone, 1.0)]
        else:
            # Objets qui existent dans le jeu ; si aucun n'est assez joué, le set n'impose pas d'objet
            # (la Tour lui en choisit alors un elle-même).
            items = [(item_key.get(i), s) for i, s in share(entry['Items']) if i == 'nothing' or item_key.get(i) in game['items']]
            items = [it for it in items if it[1] >= MIN_ITEM_SHARE][:3] or [it for it in items[:1] if it[1] >= 0.05] or [(None, 0)]
        spreads = share(entry['Spreads'])
        champions = label.startswith('Champions')
        tera = next((type_key[t] for t, _ in share(entry.get('Tera Types', {})) if t in type_key), None)
        out = []
        for item, item_share in items:
            iid = to_id(sd_items.get(item, '')) if item else ''

            def spread_ok(evs, nat):
                offensive = max(evs['atk'], evs['spa']) >= 200 or nat[0] in ('atk', 'spa')
                defensive = evs['hp'] >= 120 and evs['def'] + evs['spd'] >= 180 and nat[0] not in ('atk', 'spa')
                if iid == 'choiceband':
                    return evs['atk'] >= evs['spa'] and nat[1] != 'atk'
                if iid == 'choicespecs':
                    return evs['spa'] >= evs['atk'] and nat[1] != 'spa'
                if iid == 'choicescarf':
                    return evs['spe'] > 0 and nat[1] != 'spe'
                if iid in OFFENSIVE_ITEMS:
                    return offensive
                if iid in DEFENSIVE_ITEMS:
                    return defensive
                return True
            chosen = None
            top_weight = spreads[0][1] if spreads else 0
            # Une répartition peu jouée (moins de 5 % de la plus jouée) n'est pas retenue pour coller à l'objet.
            for sp, w in [x for x in spreads[:30] if x[1] >= top_weight * 0.05] + spreads[:1]:
                nat_name, vals = sp.split(':')
                vals = [int(x) for x in vals.split('/')]
                # Champions compte en points (0-32) : on les repasse en EV classiques (0-252) pour
                # garder le même format que les autres sets (convertRealEvs les reconvertit à l'identique).
                evs = {k: (round(v * 252 / 32) if champions else v) for k, v in zip(STATS, vals)}
                nat = NATURES.get(nat_name, (None, None))
                if spread_ok(evs, nat):
                    chosen = (evs, nat)
                    break
            if not chosen:
                continue
            evs, nat = chosen
            physical = evs['atk'] > evs['spa'] or nat[0] == 'atk'
            special = evs['spa'] > evs['atk'] or nat[0] == 'spa'
            mixed = evs['atk'] >= 100 and evs['spa'] >= 100
            choice = iid.startswith('choice')
            cands = [(move_key.get(m), s) for m, s in share(entry['Moves']) if move_key.get(m) in legal_moves]
            picked = []
            while len(picked) < 4:
                best, best_score = None, 0
                for mid, s in cands:
                    if mid in picked or mid not in move_meta:
                        continue
                    mtype, cat = move_meta[mid]
                    score = s
                    if cat == 'status':
                        if choice and mid not in CHOICE_OK_STATUS:
                            continue
                    elif not mixed and ((cat == 'phys' and special and not physical) or (cat == 'spec' and physical and not special)):
                        score *= 0.3
                    if cat != 'status' and any(move_meta[p] == (mtype, cat) for p in picked):
                        score *= 0.4
                    if score > best_score:
                        best, best_score = mid, score
                if not best or best_score < 0.02:
                    break
                picked.append(best)
            if len(picked) < 3:
                continue
            s = {'f': label}
            if not stone and item:
                s['u'] = round(item_share * 100)
            if ability:
                s['a'] = ability
            if item:
                s['i'] = item
            if nat[0]:
                s['p'], s['m'] = nat
            s['e'] = {k: v for k, v in evs.items() if v}
            s['mv'] = picked
            if tera and not champions:
                s['t'] = tera
            s['_w'] = entry['usage'] * factor * max(item_share, 0.15)
            out.append(s)
        return out

    def similar(a, b):
        return a.get('i') == b.get('i') and len(set(a['mv']) & set(b['mv'])) >= 3 or set(a['mv']) == set(b['mv'])

    # 1. Sets d'usage, tous formats confondus.
    candidates = {}
    for fmt, label, factor in FORMATS:
        data = fetch(fmt, month)['data']
        for sd_name, entry in data.items():
            if entry.get('Raw count', 0) < MIN_COUNT:
                continue
            sp_name, stone = species_of(sd_name)
            if not sp_name:
                continue
            candidates.setdefault(sp_name, []).extend(usage_sets(data, label, factor, sp_name, stone, entry))
    for lst in candidates.values():
        lst.sort(key=lambda s: -s['_w'])

    # 2. Compléments : analyses Smogon (9e génération, formats 1 contre 1) puis sets curés du jeu.
    analyses = js_object('pokemon/smogon-sets.js', 'SMOGON_SETS')
    curated = js_object('pokemon/competitive-sets.js', 'COMPETITIVE_SETS')
    extra = {}
    for sp_name, sets in analyses.items():
        for s in sets:
            tier, gen = (s['f'].split(' · ') + [''])[:2]
            if gen == 'Gen 9' and tier in ANALYSIS_TIERS:
                e = {k: v for k, v in s.items() if k != 'n'}
                e['f'] = 'Analyse Smogon ' + tier
                if s.get('n'):
                    e['n'] = s['n']
                extra.setdefault(sp_name, []).append(e)
    for sp_name, c in curated.items():
        e = {'f': 'Draft Mon', 'mv': c['moves'], 'e': c['evs']}
        if c.get('ability'):
            e['a'] = c['ability']
        if c.get('item'):
            e['i'] = c['item']
        if c.get('plus'):
            e['p'], e['m'] = c['plus'], c['minus']
        extra.setdefault(sp_name, []).append(e)

    result = {}
    for sp_name, info in game['species'].items():
        legal = set(info['moves'])
        chosen = []
        pool = candidates.get(sp_name, []) + extra.get(sp_name, [])
        for s in pool:
            # Les sets de Méga-Évolution (Builder seulement : les adversaires de la Tour ne Méga-Évoluent
            # pas) ne comptent pas dans les 5 sets de la Tour ; 2 au plus en plus.
            mega = bool(s.get('i') in game['megas'])
            if (sum(1 for c in chosen if c.get('i') in game['megas']) >= 2) if mega else (sum(1 for c in chosen if c.get('i') not in game['megas']) >= MAX_SETS):
                continue
            if s.get('a') and s['a'] not in info['abilities']:
                continue
            if s.get('i') and s['i'] not in sd_items and s['i'] not in game.get('items', sd_items):
                continue
            if sum(1 for m in s['mv'] if m in legal) < 3:
                continue
            if any(similar(s, c) for c in chosen):
                continue
            chosen.append(s)
        if not chosen:
            continue
        # Poids de tirage dans la Tour : plus un set est joué, plus il sort souvent, sans qu'un set
        # n'écrase les autres (racine carrée de l'usage, au moins 10 %).
        ws = [math.sqrt(s.get('_w', 0)) for s in chosen]
        top = max(ws) or 1
        raw = [max(0.25, w / top) if s.get('_w') else 0.25 for w, s in zip(ws, chosen)]
        tot = sum(raw)
        for s, r in zip(chosen, raw):
            s.pop('_w', None)
            s['w'] = max(10, round(r / tot * 100))
        result[sp_name] = chosen

    # 3. Set VGC (combat double) le plus joué, pour le Builder.
    vgc = {}
    data = fetch(VGC_FORMAT[0], month)['data']
    for sd_name, entry in sorted(data.items(), key=lambda x: -x[1].get('usage', 0)):
        if entry.get('Raw count', 0) < MIN_COUNT:
            continue
        sp_name, stone = species_of(sd_name)
        if not sp_name or sp_name in vgc and not stone:
            continue
        sets = usage_sets(data, VGC_FORMAT[1], 1, sp_name, stone, entry)
        if sets:
            s = sets[0]
            s.pop('_w', None)
            vgc.setdefault(sp_name, [])
            if len(vgc[sp_name]) < 2 and not any(similar(s, c) for c in vgc[sp_name]):
                vgc[sp_name].append(s)

    dump = lambda d: json.dumps(d, ensure_ascii=False, separators=(',', ':'))
    out = os.path.join(ROOT, 'pokemon', 'tournament-sets.js')
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* ==== Sets de compétition — fichier généré par outils/generer-sets.py (ne pas modifier à la main).\n'
                f'   Source : statistiques d\'usage Smogon/Pokémon Showdown de {month} (Pokémon Champions et 9e génération),\n'
                '   complétées par les analyses Smogon et les sets curés du jeu. Clé = nom de l\'espèce dans le jeu ;\n'
                '   jusqu\'à 5 sets par espèce (+ 2 sets de Méga-Évolution, Builder seulement), chacun :\n'
                '   f (format d\'origine), u (% des joueurs de ce format qui tiennent cet objet), w (poids de tirage\n'
                '   dans la Tour), n (nom, analyses seulement), a (talent),\n'
                '   i (objet, clé de ITEMS), p/m (stat + / - de la nature), e (EV 0-252), mv (attaques),\n'
                '   t (type Téracristal). Utilisés par la Tour (combat/tower.js), le mode Facile et le Builder. ==== */\n')
        f.write(f"const TOURNAMENT_SETS_MONTH = '{month}';\n")
        f.write('const TOURNAMENT_SETS = ' + dump(result) + ';\n')
        f.write('// Sets les plus joués en combat double (Pokémon Champions VGC), proposés dans le Builder.\n')
        f.write('const VGC_SETS = ' + dump(vgc) + ';\n')
    n_sets = sum(len(v) for v in result.values())
    print(f'{out} : {len(result)} espèces, {n_sets} sets ; VGC : {len(vgc)} espèces')
    print('Sets par espèce :', {k: sum(1 for v in result.values() if len(v) == k) for k in range(1, MAX_SETS + 1)})


if __name__ == '__main__':
    main()
