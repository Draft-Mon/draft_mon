"""Ajoute a graphify-out/graph.json les dependances entre fichiers JS charges en global.

graphify ne resout pas les appels entre scripts sans import : ce script relie par nom
chaque fonction ou constante de premier niveau a ses usages dans les autres fichiers,
puis relance le clustering. A relancer apres chaque `/graphify --update`.

Usage (depuis n'importe ou) :
    & (Get-Content graphify-out\\.graphify_python) .claude\\graphify-crossfile.py [--dry]
"""
import json, os, re, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path

import tree_sitter_javascript
from tree_sitter import Language, Parser

os.chdir(Path(__file__).resolve().parent.parent)
DRY = '--dry' in sys.argv
ORIGIN = 'crossfile_resolver'
GP = Path('graphify-out/graph.json')
g = json.loads(GP.read_text(encoding='utf-8'))
nodes = g['nodes']
links = [e for e in g['links'] if e.get('_origin') != ORIGIN]  # idempotent

parser = Parser(Language(tree_sitter_javascript.language()))
FUNC_TYPES = {'function_declaration', 'function_expression', 'arrow_function', 'method_definition',
              'generator_function_declaration', 'generator_function'}
PATTERN_IDS = {'identifier', 'shorthand_property_identifier_pattern'}


def norm(s):
    return re.sub(r'[^a-z0-9]', '_', s.lower())


def stem_id(sf):
    return norm(str(Path(sf).with_suffix('')).replace('\\', '/'))


def text(n, src):
    return src[n.start_byte:n.end_byte].decode('utf-8', 'replace')


def walk(n):
    stack = [n]
    while stack:
        n = stack.pop()
        yield n
        stack.extend(n.children)


def ids_in(n, src):
    return {text(c, src) for c in walk(n) if c.type in PATTERN_IDS} if n is not None else set()


# Par fichier : noms declares au premier niveau (globaux) et noms declares ailleurs (masquage local)
files = sorted({n['source_file'] for n in nodes if (n.get('source_file') or '').endswith('.js')})
trees, top, local = {}, {}, {}
for sf in files:
    src = Path(sf).read_bytes()
    root = parser.parse(src).root_node
    trees[sf] = (src, root)
    top[sf], local[sf] = set(), set()
    for n in walk(root):
        at_top = n.parent is not None and n.parent.type == 'program'
        if n.type in ('function_declaration', 'generator_function_declaration'):
            (top[sf] if at_top else local[sf]).update(ids_in(n.child_by_field_name('name'), src))
        elif n.type == 'variable_declarator':
            decl_top = n.parent.parent is not None and n.parent.parent.type == 'program'
            (top[sf] if decl_top else local[sf]).update(ids_in(n.child_by_field_name('name'), src))
        elif n.type == 'formal_parameters':
            local[sf].update(ids_in(n, src))
        elif n.type in ('arrow_function', 'catch_clause'):
            local[sf].update(ids_in(n.child_by_field_name('parameter'), src))

# Cibles : noeuds du graphe correspondant a un global, definis dans un seul fichier
defs, by_loc = defaultdict(list), {}
for n in nodes:
    sf = n.get('source_file') or ''
    if n.get('file_type') != 'code' or sf not in trees:
        continue
    label = n.get('label', '')
    name = label[:-2] if label.endswith('()') else label
    loc = n.get('source_location') or ''
    if label.endswith('()') and loc.startswith('L'):
        by_loc[(sf, int(loc[1:]))] = n['id']
    if name in top[sf] and n['id'] == stem_id(sf) + '_' + norm(name):
        defs[name].append(n)
ambiguous = {k for k, v in defs.items() if len(v) > 1}
unique = {k: v[0] for k, v in defs.items() if len(v) == 1}
file_of = {n['id']: n.get('source_file') for n in nodes}
existing = {frozenset((e['source'], e['target'])) for e in links}


def enclosing(node, sf):
    p = node.parent
    while p is not None:
        if p.type in FUNC_TYPES:
            for cand in (p, p.parent):  # `const f = () => ...` : le noeud est sur le declarateur
                if cand is not None and (sf, cand.start_point[0] + 1) in by_loc:
                    return by_loc[(sf, cand.start_point[0] + 1)]
        p = p.parent
    return stem_id(sf)


RANK = {'calls': 0, 'indirect_call': 1, 'references': 2}
best = {}
for sf, (src, root) in trees.items():
    for node in walk(root):
        if node.type != 'identifier' or node.parent is None:
            continue
        name = text(node, src)
        target = unique.get(name)
        if target is None or target['source_file'] == sf or name in local[sf] or name in top[sf]:
            continue
        par = node.parent
        if not target.get('label', '').endswith('()'):
            rel, conf, score, ctx = 'references', 'EXTRACTED', 1.0, 'global'
        elif par.type == 'call_expression' and par.child_by_field_name('function') == node:
            rel, conf, score, ctx = 'calls', 'EXTRACTED', 1.0, 'call'
        else:
            rel, conf, score, ctx = 'indirect_call', 'INFERRED', 0.85, 'argument'
        source = enclosing(node, sf)
        key = frozenset((source, target['id']))
        if key in existing or len(key) == 1:
            continue
        # Une seule arete par paire (graphe non oriente, non multi) : l'appel direct prime
        if key not in best or RANK[rel] < RANK[best[key]['relation']]:
            best[key] = {
                'source': source, 'target': target['id'], 'relation': rel, '_origin': ORIGIN,
                'confidence': conf, 'confidence_score': score, 'context': ctx,
                'source_file': sf, 'source_location': f'L{node.start_point[0] + 1}', 'weight': 1.0,
            }
final = list(best.values())

print(f'{len(unique)} globaux uniques ({len(ambiguous)} noms ambigus ignores : {sorted(ambiguous)[:10]})')
print(f'Aretes inter-fichiers : {len(final)}', dict(Counter(e['relation'] for e in final)))
for (a, b), c in Counter((e['source_file'], file_of[e['target']]) for e in final).most_common(10):
    print(f'  {c:4d}  {a} -> {b}')

if not DRY:
    g['links'] = links + final
    GP.write_text(json.dumps(g, indent=2, ensure_ascii=False), encoding='utf-8')
    subprocess.run([sys.executable, '-m', 'graphify', 'cluster-only', '.'], check=True)
