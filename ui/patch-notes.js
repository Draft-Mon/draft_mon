/* ==== SOMMAIRE ====
   Historique des mises à jour (PATCH_NOTES, du plus récent au plus ancien) + la fenêtre qui les
   affiche, et la phrase d'accroche aléatoire du bouton du menu principal (SPLASH_TEXTS).
   PATCH_NOTES[0] est toujours la version courante. Repères : le contenu détaillé de chaque version
   est en haut du fichier ; les fonctions d'affichage (renderPatchNotes/openPatchNotes) sont en bas,
   juste avant SPLASH_TEXTS. Le tout premier écran affiché au chargement du jeu est en toute fin de
   fichier (showScreen('screenMenu')).
==== */
const PATCH_NOTES = [
  {
    version: 'v0.12',
    title: 'v0.12 — Team Builder Update',
    subVersions: [
      {
        version: 'v0.12.1',
        title: 'v0.12.1 — Méga-Évolutions manquantes',
        categories: [
          {
            icon: phIcon('diamond'), label: 'Méga-Évolutions',
            items: [
              "8 Méga-Évolutions des jeux principaux qui manquaient sont ajoutées : Méga-Mewtwo X, Méga-Jungko, Méga-Braségali, Méga-Laggron, Méga-Latias, Méga-Latios, Méga-Diancie et Méga-Rayquaza",
              "Méga-Rayquaza n'a pas de Méga-Gemme : comme dans les vrais jeux, il se Méga-Évolue en combat s'il connaît Draco-Ascension",
              "16 nouvelles Méga-Évolutions de l'extension Méga-Dimension de Pokémon Légendes Z-A : Méga-Raichu X et Y, Méga-Éoko, Méga-Étouraptor, Méga-Heatran, Méga-Darkrai, Méga-Golemastoc, Méga-Mistigrix, Méga-Crabominable, Méga-Sarmuraï, Méga-Magearna, Méga-Zeraora, Méga-Scovilain, Méga-Floréclat, Méga-Nigirigon et Méga-Glaivodo",
              "Leurs Méga-Gemmes sont vendues par le Marchand Itinérant (onglets « Méga Gemme » et « Méga Z-A »)",
              "Nouveau talent Habanéruption (Méga-Scovilain) : brûle l'attaquant à chaque capacité offensive subie, même sans contact",
              "Souffle Delta (Méga-Rayquaza) a sa description dans le Pokédex mais reste sans effet codé pour l'instant",
              "Méga-Heatran, Méga-Darkrai, Méga-Magearna, Méga-Zeraora et Méga-Nigirigon gardent le talent de leur forme normale, faute de talent officiel connu pour l'instant"
            ]
          }
        ]
      },
      {
        version: 'v0.12.2',
        title: 'v0.12.2 — Sets de tournoi',
        categories: [
          {
            icon: phIcon('trophy'), label: 'Sets de tournoi',
            items: [
              "Nouveaux sets tirés des statistiques des tournois et parties classées de Smogon/Pokémon Showdown (septembre 2026), Pokémon Champions en priorité : jusqu'à 5 sets par Pokémon pour 717 espèces",
              "Tour : un adversaire n'a plus un seul set possible, il en tire un au hasard parmi ses sets de tournoi (les plus joués sortent plus souvent)",
              "Mode Facile : chaque Pokémon reçoit son set le plus joué en tournoi"
            ]
          },
          {
            icon: phIcon('wrench'), label: 'Builder d’équipe',
            items: [
              "Nouveaux sets prédéfinis « Tournoi » (les mêmes que ceux de la Tour, plus les sets de Méga-Évolution) et « VGC » (le plus joué en combat double), en plus des analyses Smogon",
              "Comparateur : le bouton « Personnaliser » permet de modifier entièrement l'adversaire (objet, talent, nature, EV, IV, type Téracristal, attaques), à partir d'un set prédéfini ou non ; il reste sauvegardé",
              "Menaces : chaque adversaire est testé avec son set le plus joué en tournoi"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Les Méga-Gemmes de l'extension Méga-Dimension (dont la Floréclatite) et les Méga-Gemmes Z ont maintenant leur vrai sprite"
            ]
          }
        ]
      },
      {
        version: 'v0.12.3',
        title: 'v0.12.3 — Bracelets & mécaniques des Boss',
        categories: [
          {
            icon: phIcon('key'), label: 'Bracelets',
            items: [
              "Nouvel onglet « Bracelets » au Pokéshop : Méga-Bracelet, Bracelet Z et Bracelet Dynamax",
              "Il faut maintenant le bracelet correspondant pour Méga-Évoluer, utiliser une Capacité Z ou Dynamaxer (un seul achat par partie) ; la Téracristallisation demande toujours l'Orbe Téracristal"
            ]
          },
          {
            icon: phIcon('crown'), label: 'Boss',
            items: [
              "Les Maîtres de Type peuvent désormais utiliser une mécanique : Méga-Évolution, Téracristallisation, Capacité Z ou Dynamax, tirée au hasard",
              "Un Boss n'en a une que si tu as toi-même débloqué une mécanique (un bracelet ou un Orbe Téracristal) ; à partir de l'étage 50, il en a toujours une",
              "C'est l'as de son équipe (son dernier Pokémon) qui s'en sert, une fois par combat ; les Mini-Boss et les dresseurs normaux n'en ont pas"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Le Facteur Gigamax a sa propre icône (il partageait celle du Bracelet Dynamax)"
            ]
          }
        ]
      }
    ],
    categories: [
      {
        icon: phIcon('wrench'), label: 'Builder d’équipe',
        items: [
          "Nouveau bouton « Builder d'équipe » sur l'accueil : un outil à part, totalement indépendant des parties de draft et de la Tour",
          "Jusqu'à 10 équipes de 6 Pokémon, renommables et sauvegardées dans le navigateur",
          "Aucune limite hors de la base de données du jeu : toutes les espèces (tous stades, branches et formes), tous les objets tenus, talents, natures, EV/IV, types Téracristal et attaques",
          "Comparateur : choisis un adversaire et son set pour voir, attaque par attaque et des deux côtés, la fourchette de dégâts et le verdict (OHKO garanti/possible, 2HKO...), plus qui attaque en premier — calculé avec le vrai moteur de combat du jeu",
          "Menaces : toutes les formes finales du jeu sont testées contre ton build, et celles qui le mettent K.O. en 2 coups au plus tout en gagnant l'échange sont listées (un clic ouvre la menace dans le comparateur)",
          "Résumé d'équipe : les 6 Pokémon avec objet, talent, nature, répartition d'EV, stats finales et attaques, la couverture défensive par type et les adversaires qui menacent au moins la moitié de l'équipe",
          "Plus de 2700 sets prédéfinis issus des analyses Smogon (générations 9, 8 et 7) pour 950 espèces, en plus des sets du jeu et du build automatique",
          "Import / Export au format Pokémon Showdown"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Méga-Évolutions Z',
        items: [
          "Méga-Lucario Z, Méga-Absol Z et Méga-Carchacrok Z rejoignent le jeu, avec leurs Méga-Gemmes Z vendues par le Marchand Itinérant",
          "Méga-Lucario et Méga-Carchacrok affichaient le sprite (et le talent) d'un autre Pokémon : corrigé",
          "Les formes de Silvallié, Zacian, Zamazenta, Sylveroy et Ogerpon ont enfin leur sprite"
        ]
      },
      {
        icon: phIcon('book-open'), label: 'Pokédex',
        items: [
          "Les Méga-Évolutions et les formes Gigamax ont leur propre carte, juste après leur Pokémon de base, avec deux nouvelles raretés filtrables « Méga » et « Gigamax » (elles n'apparaissent jamais au draft)",
          "Chaque fiche affiche maintenant l'efficacité des types du Pokémon en attaque, en plus de ses faiblesses et résistances en défense",
          "Plus de 10 000 attaques manquantes ajoutées aux movepools : chaque lignée peut désormais apprendre toutes les capacités du jeu auxquelles elle a droit"
        ]
      },
      {
        icon: phIcon('paw-print'), label: 'Ranch',
        items: [
          "Les Pokémon recrutés au Ranch arrivent maintenant prêts à combattre (talent, nature, EV et 4 attaques) dans toutes les difficultés — ils arrivaient sans attaques en Normal et Difficile",
          "Nouveau : le Maître des Capacités refait le set d'un Pokémon de l'équipe (talent, nature, EV, attaques classées Physiques / Spéciales / Statut) pour 100 pièces"
        ]
      },
      {
        icon: phIcon('coins'), label: 'Boutiques',
        items: [
          "Bouton « Vendre » au Pokéshop et chez le Marchand Itinérant : les objets se revendent à 60% de leur prix",
          "Nouvel onglet « Vendre » au Pokéshop, qui liste tout le contenu du sac"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Combats',
        items: [
          "Changer de Pokémon est une action complète pour tout le monde : quand l'adversaire rappelle son Pokémon, le remplaçant n'attaque plus dans le même tour"
        ]
      },
      {
        icon: phIcon('device-mobile'), label: 'Mobile & interface',
        items: [
          "Nouvelle bannière en titre de l'accueil, et nouveau logo",
          "Le nom des Maîtres de Type ne déborde plus de son bandeau en combat",
          "Le journal de combat ne recouvre plus les PV de ton Pokémon sur les petits écrans",
          "Les menus déroulants s'ouvrent vers le haut quand la place manque en bas, et n'appellent plus le clavier à l'ouverture sur écran tactile"
        ]
      }
    ]
  },
  {
    version: 'v0.11',
    title: 'v0.11 — Safari Update',
    categories: [
      {
        icon: phIcon('dna'), label: 'Système d’Affinité',
        items: [
          "Chaque lignée a désormais un niveau d'Affinité (0 à 5, acquis pour toujours) qui augmente ses chances d'apparaître au draft, au Ranch et parmi les recrues de combat, jusqu'à ×2 au niveau maximum",
          "L'Affinité profite à toute la lignée, branches comprises (ex. faire monter Évoli boost les 8 Évolitions en même temps)",
          "Les équipes adverses de la Tour ne sont pas concernées : l'Affinité ne joue que sur ce que le joueur peut recruter"
        ]
      },
      {
        icon: phIcon('cookie'), label: 'Bonbons d’Affinité',
        items: [
          "Nouvelle monnaie permanente (entre toutes les parties, comme les Jetons de Tour) : chaque combat gagné en rapporte 0 à 3 (davantage contre un Mini-Boss ou un Boss), affichée et mise en évidence sur l'écran d'étage et au Campement",
          "L'argent et les Bonbons sont maintenant présentés dans des pastilles colorées bien visibles plutôt que noyés dans le texte, pour bien montrer que ce sont des ressources importantes"
        ]
      },
      {
        icon: phIcon('leaf'), label: 'Maison Safari',
        items: [
          "Nouveau bâtiment du Campement à apparition aléatoire (indépendante du Marchand Itinérant) : 10 Safari Balls offertes par visite pour capturer des Pokémon sauvages un par un",
          "4 actions à chaque rencontre : Safari Ball, Caillou (double la capture et la fuite pendant quelques tours), Appât (les divise), ou Fuite — le Pokémon peut aussi s'enfuir de lui-même à chaque tour",
          "Les Pokémon capturés ne sont jamais gardés : le Professeur les récupère pour ses recherches et donne des Bonbons d'Affinité en échange (davantage pour les captures rares, pseudo-légendaires ou légendaires)"
        ]
      },
      {
        icon: phIcon('flask'), label: 'Le Professeur',
        items: [
          "Depuis la Maison Safari, investis tes Bonbons d'Affinité dans la lignée de ton choix parmi tout le Pokédex (recherche et filtre par rareté) pour la faire monter en niveau, un peu à la fois",
          "Le coût augmente avec la rareté de la lignée (Rare, Pseudo-légendaire, Légendaire) et avec le niveau déjà atteint"
        ]
      },
      {
        icon: phIcon('book-open'), label: 'Pokédex',
        items: [
          "Chaque fiche affiche maintenant le niveau d'Affinité de la lignée, son multiplicateur, le taux d'apparition avant/après boost, et la progression vers le prochain niveau",
          "Nouveau filtre « Boostées » et compteur du nombre de lignées boostées dans le Pokédex"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.11.1',
        title: 'v0.11.1 — Habillage & Corrections',
        categories: [
          {
            icon: phIcon('sparkle'), label: 'Identité visuelle',
            items: [
              "Refonte complète de l'interface dans un style Pokémon officiel moderne (palette rouge/or chaleureuse, polices Fredoka/Nunito), retrait de toute trace de violet (y compris dans l'arène de combat et les décors du Campement)",
              "Design aplati : retrait des néons/ombres portées/dot-grid, coins moins arrondis, hover plus discrets",
              "Toutes les icônes ont désormais une couleur liée à leur sens (pièces en or, soin en vert, poison en violet, eau en bleu...) au lieu d'être monochromes",
              "Bouton de fermeture agrandi (zone tactile 44×44) sur toutes les fenêtres, et ajouté à la sélection de difficulté qui n'en avait pas",
              "Sprite principal et boutons d'évolution agrandis dans l'éditeur d'équipe, pour mieux voir le Pokémon sur PC comme sur mobile"
            ]
          },
          {
            icon: phIcon('diamond'), label: 'Rareté repensée',
            items: [
              "La rareté d'une lignée se base désormais sur les stats de base de son évolution finale, et toute la lignée (y compris ses formes à embranchement draftables) partage la même rareté plutôt que de varier selon le stade",
              "Nouveau palier « Peu Commun » ; la rareté « Évolution » a disparu",
              "Les oiseaux légendaires de Galar (Artikodin/Électhor/Sulfura) sont enfin classés Légendaire — ils ne figuraient dans aucune liste de rareté",
              "Les formes non-draftables (ex. Éthernatos Infinimax) affichent un badge « Injouable » dédié, et ne sont plus accessibles ni au draft/aux rencontres, ni même en évoluant depuis l'éditeur"
            ]
          },
          {
            icon: phIcon('crown'), label: 'Tour de Combat',
            items: [
              "Les équipes adverses n'ont plus jamais de Légendaire/Fabuleux avant l'étage 21, et jamais plus d'un par équipe ensuite",
              "Ciblage des attaques et indicateur d'efficacité corrigés en combat double (2v2)",
              "L'événement Chemin Instable fait vraiment grimper ou chuter d'étage selon l'issue"
            ]
          },
          {
            icon: phIcon('repeat'), label: 'Combats',
            items: [
              "Possibilité de choisir le Pokémon qui entre après une capacité à self-switch (Demi-Tour, Change Éclair, Relais...)"
            ]
          },
          {
            icon: phIcon('backpack'), label: 'Objets & Pokédex',
            items: [
              "17 objets tenus de boost de type manquants ajoutés (Charbon, Eau Mystique, Aimant, Croc Dragon...)",
              "Sprites manquants ajoutés pour les formes de Necrozma"
            ]
          },
          {
            icon: phIcon('cookie'), label: 'Affinité',
            items: [
              "Paliers d'affinité considérablement relevés, et bonbons gagnés en combat réduits d'environ moitié pour ralentir la progression"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.10',
    title: 'v0.10 — Gen 9 Update : Paldea & Téracristallisation',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "111 nouveaux Pokémon ajoutés (région de Paldea, Pokédex complet 1 → 1017), dont les 3 starters, les 4 Pokémon du Fléau, le Trio Fidèle, Bafouinard (et ses 3 Masques), tous les Pokémon Paradoxe passés et futurs, la nouvelle lignée pseudo-légendaire Frigibax/Frigodragma/Baxcalibur, Miraidon et Koraidon, Terapagos et Pecharunt",
          "4 nouvelles lignées de Formes de Paldea, sélectionnables indépendamment de leurs versions Kanto au draft (Axoloto de Paldea, et les 3 races de Tauros de Paldea : Combative, Flamboyante, Aquatique)",
          "Le contenu des extensions Le Masque Turquoise et Le Disque Indigo ajouté : Poltchageist/Sencha Cha, Applique/Pommenectar, Archalu-Pont, et les Pokémon Paradoxe additionnels"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Capacités',
        items: [
          "36 nouvelles attaques de Génération 9 (Collision, Électro-Ruée, Lame Psy, Toupie Mortelle, Talon Marteau, Chaîne Maligne, Désastre, Négo-Tranchante, Bombe Nombre, Masse Titanesque, Pluie de Pépites...)",
          "Deux nouvelles attaques (Collision, Électro-Ruée) infligent 33% de dégâts supplémentaires si le coup est super efficace, comme dans les vrais jeux"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Talents',
        items: [
          "36 nouveaux talents de Génération 9, dont plusieurs avec un vrai effet codé en combat : Protosynthèse et Quark Chargée (boostent la statistique la plus élevée du porteur sous Zénith / Zone Électrique), les 4 talents Fléau (réduisent une statistique de tous les autres Pokémon présents), Sel Purifiant (immunité totale aux altérations de statut, résiste au Spectre), Corps Cuit (immunité au Feu, booste la Défense), Cœur d'Or (immunité aux capacités de statut), et Chaîne Toxique (empoisonne gravement au contact)",
          "Les autres nouveaux talents (Opportuniste, Commandant, Zéro à Héros, Synchro Masque, Téraforme Zéro...) ont leur description dans le Pokédex mais restent sans effet mécanique codé pour l'instant"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Téracristallisation',
        items: [
          "Nouvelle mécanique de combat, au même titre que la Méga-Évolution et le Dynamax : l'Orbe Tera, vendu par le Marchand Itinérant, permet à son porteur de se Téracristalliser une fois par combat",
          "Le Type Tera de chaque Pokémon se choisit dans la fenêtre Équipe (par défaut, son premier type) ; une fois activée en combat via le bouton dédié, la Téracristallisation dure jusqu'à la fin du combat (contrairement au Dynamax, limité à 3 tours)",
          "Le porteur devient mono-type de son Type Tera pour l'attaque et la défense, et bénéficie d'un bonus STAB de x2 (au lieu de x1.5) si ce type correspond à l'un de ses types d'origine — exactement comme dans les vrais jeux"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.10.1',
        title: 'v0.10.1 — Méga-Évolutions de Pokémon Légendes Z-A',
        categories: [
          {
            icon: phIcon('diamond'), label: 'Méga-Évolutions',
            items: [
              "26 nouvelles Méga-Évolutions inédites, introduites dans Pokémon Légendes Z-A, ajoutées à des lignées déjà présentes dans le Pokédex : Méga-Dracolosse (Dragon/Vol), Méga-Empiflor (Plante/Poison), Méga-Mélodelfe (Fée/Vol), Méga-Staross (Eau/Psy), Méga-Méganium (Plante/Fée), Méga-Aligatueur (Eau/Dragon), Méga-Airmure, Méga-Momartik, Méga-Roitiflam, Méga-Minotaupe, Méga-Brutapode, Méga-Baggaïd, Méga-Ohmassacre, Méga-Lugulabre, Méga-Blindépique, Méga-Goupelin, Méga-Amphinobi, Méga-Némélios, Floette (Fleur Éternelle), Méga-Golgopathe (Roche/Combat), Méga-Kravarech, Méga-Brutalibré, Méga-Sepiatroce, Méga-Zygarde, Méga-Draïeul et Méga-Hexadron",
              "Chaque Méga-Évolution s'obtient via sa propre Méga-Gemme, vendue par le Marchand Itinérant (nouvel onglet dédié « Méga Z-A »), et s'équipe comme n'importe quel objet tenu dans la fenêtre Équipe",
              "9 nouveaux talents de Méga-Évolution accompagnent ces formes (Multi-Écaille, Boyaux Dehors, Inflexible, Furie Ultime, Foreuse Perçante, Survoltage, Crinière Ardente, Zénith Suprême, Dracomorphose) ; les autres réutilisent des talents déjà existants dans le Pokédex (Force Pure, Rebond, Alerte Neige, Brise Moule, Coque Armure, Intimidation, Infiltration, Anti-Bombe, Lévitation, Protéen, Aura Féérique, Griffe Solide, Régénération, Annule Garde, Contestation, Rupture Aura, Acharné...)"
            ]
          }
        ]
      },
      {
        version: 'v0.10.2',
        title: 'v0.10.2 — Refonte visuelle : Combat, Campement & Accueil',
        categories: [
          {
            icon: phIcon('sword'), label: 'Écran de combat',
            items: [
              "L'écran de combat occupe désormais tout l'écran, sur téléphone comme sur ordinateur, et tient entièrement dans la fenêtre sans avoir à défiler",
              "Vraie arène de combat en arrière-plan : classique (violette) contre un dresseur normal, et aux couleurs du type du Maître de Type affronté (Eau = bleue, Feu = orange, Glace = bleu clair, Normal = neutre...) avec brume, sol dégradé et zone au sol sous chaque combattant",
              "L'arène et le module d'actions forment une seule fenêtre de combat : l'adversaire en haut à droite (sprite agrandi, barre de PV au-dessus), ton Pokémon en bas à gauche, puis l'historique, les mécaniques et les attaques regroupés en bas à droite",
              "Les 3 boutons de mécanique (Dynamax, Méga, Téracristallisation) sont toujours affichés, à la même hauteur exacte que la grille des attaques, et la Capacité Z passe dans une bannière dédiée quand elle est disponible",
              "« Changer de Pokémon » et « Sac » sont rangés derrière un bouton hamburger qui les révèle au clic"
            ]
          },
          {
            icon: phIcon('tent'), label: 'Campement',
            items: [
              "Le Campement est entièrement refait en plein écran, comme une vraie scène : bâtiments dessinés (Centre Pokémon, Poké Mart, Ranch avec sa clôture et sa grange, échoppe du Marchand Itinérant) au lieu d'icônes",
              "Toute ton équipe en vie est installée autour du feu de camp, chaque Pokémon sur sa propre bûche (6 places), et les 3 Pokémon proposés par le Ranch sont visibles directement dans son enclos",
              "Le bâtiment « Équipe » est remplacé par un bouton hamburger donnant accès à la modification d'équipe et au sac",
              "Ambiance de camp installé à l'intérieur de la Tour : grande salle de pierre avec arche et piliers, plafond qui se perd dans le noir, torches, bannières, tour de guet, tentes en retrait, brume et braises qui montent du feu",
              "Les Pokémon du camp et de l'enclos sont nettement agrandis pour être plus visibles"
            ]
          },
          {
            icon: phIcon('house'), label: 'Accueil',
            items: [
              "Le logo de tour à côté du titre est retiré et « Tour de Combat » passe sous « Draft Mon »",
              "Le texte d'accroche penché est plus grand, plus net, et n'est plus coupé par le haut de la page",
              "Nouvelle animation en bas à droite : un dresseur gravit un escalier en restant sur place pendant que l'escalier défile, avec une vraie marche (pieds posés sur les marches, balancement des jambes et des bras, buste et tête vivants). L'escalier colle au bas de la page, et l'animation reste visible en arrière-plan sur mobile"
            ]
          },
          {
            icon: phIcon('book-open'), label: 'Pokédex : Pokémon manquants',
            items: [
              "5 Pokémon qui manquaient au Pokédex sont ajoutés : Scalpereur (dernière évolution de Scalproie), Courrousinge (évolution de Colossinge), Farigiraf (évolution de Girafarig), Deusolourdo (évolution d'Insolourdo) et Ire-Foudre, un Pokémon Paradoxe légendaire",
              "Scalproie et Scalpereur apprennent Négo-Tranchante"
            ]
          },
          {
            icon: phIcon('device-mobile'), label: 'Adaptation à tous les écrans',
            items: [
              "Tous les écrans s'adaptent au téléphone (portrait et paysage), à la tablette et à l'ordinateur : tailles des Pokémon en combat ajustées à la hauteur disponible, combats en double et bannière des jumeaux compactés, Campement sans défilement en paysage",
              "Les fenêtres (sac, équipe, Ranch, notes de mise à jour...) ne dépassent plus de l'écran, et les grilles du Dex, du draft et de l'équipe passent sur deux colonnes sur les écrans moyens"
            ]
          }
        ]
      },
      {
        version: 'v0.10.3',
        title: 'v0.10.3 — Corrections de combat, talents & attaques',
        categories: [
            {
              icon: phIcon('dna'), label: 'Talents & attaques : vérification complète',
              items: [
                "Les talents de tous les Pokémon (1 084 stades, formes Méga comprises) ont été vérifiés un par un et corrigés d'après les données officielles : chaque stade d'évolution a maintenant ses propres talents (par exemple Chrysacier n'a plus les talents de Chenipan mais Mue, Papilusion a Œil Composé et Lentiteintée), avec le talent caché en dernière position",
                "Les talents inventés sont retirés (par exemple « Cercle d'Énergie » pour Bulbizarre, « Dégobage » pour Carapuce ou « Transistor » pour Pichu) et les talents cités par des Pokémon mais jamais décrits dans le jeu ont maintenant leur description (Normalise, Frein, Heavy Metal, Rage Poison, Filature...)",
                "Les listes d'attaques de toutes les lignées ont été vérifiées : environ 4 500 attaques qu'un Pokémon ne peut jamais apprendre dans les jeux officiels ont été retirées (par exemple Charge pour Salamèche ou Psyko pour Pikachu), et environ 2 080 attaques apprises par niveau dans les derniers jeux et jusqu'ici absentes ont été ajoutées",
                "Les attaques réservées à une branche d'évolution (Rafflesia, Joliflor...) ont aussi été vérifiées",
                "Crocs Feu et Crocs Éclair sont ajoutées au jeu, et les Crocs (Feu, Givre, Éclair) et Poings (Feu, Glace, Éclair) élémentaires sont donnés à tous les Pokémon qui peuvent officiellement les apprendre (255 attaques ajoutées sur 130 lignées)",
                "Toutes les attaques qu'un Pokémon peut apprendre officiellement par tutorat ou par reproduction (Ronflement, Vantardise, Coup d’Boule, Queue de Fer, Onde de Choc...) sont ajoutées à ceux qui ne les avaient pas : environ 5 750 attaques sur 554 lignées, ce qui porte la liste médiane à 47 attaques par lignée"
              ]
            },
            {
              icon: phIcon('sword'), label: 'Attaques : chacune vérifiée',
              items: [
                "Les 834 attaques du jeu ont été testées une par une en combat et comparées aux données officielles : plus aucune n'a d'erreur ni d'effet manquant",
                "Corrections de type (Morsure passe Ténèbres ; Charme, Doux Baiser et Rayon Lune passent Fée ; Nitro Crash passe Combat ; Salaison passe Roche ; Hommage Posthume passe Spectre) et de catégorie (Danse Fleurs, Relâche, Ball’Météo, Brouhaha et Tranch’Air deviennent spéciales, Plongée devient physique, Cauchemar devient une capacité de statut)",
                "Priorités ajoutées : Riposte, Voile Miroir, Vendetta, Mitra-Poing, Carapiège, Bec-Canon, Cyclone, Téléport passent en priorité négative ; Reflet Magik, Saisie, Sheauriken et Patience passent en priorité positive ; Gliss’Herbe n'est prioritaire que sous Champ Herbu",
                "16 attaques à frappes multiples frappent enfin plusieurs fois (Double Pied, Dard-Nuée, Furie, Torgnoles, Poing Comète, Picanon, Pilonnage, Combo-Griffe, Triple Pied, Cogne, Stalactite, Balle Graine, Boule Roc...), Baston frappe une fois par Pokémon debout, et les effets secondaires des attaques à frappes multiples (poison de Double Dard, peur d'Écrous d’Poing...) s'appliquent enfin",
                "Étreinte, Ligotage, Danse Flammes, Claquoir, Siphon et Tourbi-Sable piègent enfin la cible et lui infligent des dégâts à chaque tour ; Mawashi Geri et Piqué font parfois reculer, Électacle peut paralyser et Kokiyarme peut empoisonner",
                "18 capacités de statut qui ne faisaient rien fonctionnent enfin : Attraction, Encore, Tourmente, Dépit, Clairvoyance, Flair, Lien du Destin, Rancune, Tourniquet, Camouflage, Conversion, Conversion 2, Reflet Magik, Possessif, Saisie, Cauchemar, Change-Côté et Thérémonie",
                "Nouvelles mécaniques : recharge après Ultralaser, Hydroblast, Rafale Feu, Végé-Attaque et consorts ; taux de coup critique élevé (Tranche, Coup Croix, Lame de Roc, Griffe Ombre...) et coups toujours critiques ; attaques qui ne ratent jamais (Météores, Aéropique, Onde de Choc, Aurasphère...) ; Mania, Colère, Danse Fleurs et Grand Courroux durent 2 à 3 tours puis rendent confus ; Roulade, Ball'Glace et Taillade gagnent en puissance à chaque tour ; Patience, Coup Bas, Bluff, Escarmouche, Mitra-Poing et Carapiège suivent leurs vraies conditions ; Pied Voltige et Pied Sauté blessent le lanceur en cas d'échec ; Casse-Brique et Psycho-Croc détruisent les écrans ; Larcin et Clepto-Mânes volent objet et bonus de stats ; Force Nature, Ball’Météo et Champlification changent de type selon le terrain ou la météo"
              ]
            },
            {
              icon: phIcon('sparkle'), label: 'Nouvelles attaques & puissances officielles',
              items: [
                "237 attaques qui manquaient au jeu sont ajoutées, avec leur nom, leur type, leur puissance, leur précision, leurs PP et leur description officiels : Boutefeu, Rapace, Vampi-Poing, Éco-Sphère, Telluriforce, Change Éclair, Pisto-Poing, Aqua-Jet, Ébullition, Plaie Croix, Mégafouet, Vampigraine, Atterrissage, Hurlement, Clonage, Distorsion, Vent Arrière, Gravité, Exuviation, Machination, Papillodanse, Anti-Brume, Zone Étrange, Zone Magique et bien d'autres",
                "Elles sont données aux Pokémon qui peuvent officiellement les apprendre (par niveau, tutorat, reproduction ou CT) : près de 10 900 apprentissages ajoutés, la liste médiane passe à 66 attaques par lignée",
                "La puissance de toutes les attaques est maintenant celle des jeux officiels (152 attaques modifiées : Tonnerre passe de 70 à 90, Lance-Flammes à 90, Surf à 90, Ultralaser à 150, Damoclès à 120...). Les attaques à frappes multiples utilisent la puissance officielle par frappe",
                "Toutes les attaques ont maintenant leur effet spécial : Clonage (le clone encaisse les coups), Distorsion, Vent Arrière, Gravité, Lance-Boue, Zone Étrange, Zone Magique, Embargo, Anti-Soin, Air Veinard, Coup d'Main, Par Ici / Poudre Fureur, Vœu Soin / Danse Lune, Second Souffle, Photocopie, Moi d'Abord, À la Queue, Après Vous, les échanges de stats et de types, les protections à effet (Piège de Fil, Rempart Brûlant, Tatamigaeshi, Prévention)...",
                "Effets des attaques offensives : puissance selon le poids (Balayage, Nœud Herbe, Tacle Lourd, Tacle Feu), selon la Vitesse (Gyroballe, Boule Élek), selon les PV (Presse, Essorage, Giclédo, Pression Extrême), selon les stats (Force Ajoutée, Arrogance, Poing de Colère), Fulmifer, Dernier Recours, Tout ou Rien, Tricherie, Choc Psy, Synchropeine, Draco-Queue et Projection qui forcent le changement, Picore et Piqûre qui mangent la baie, Dégommage, Don Naturel, Téra Explosion...",
                "Demi-Tour, Eau Revoir et Change Éclair font enfin revenir le lanceur, et Copie ne fait plus planter le combat quand c'est un adversaire qui l'utilise. Close Combat, Pouvoir Antique, Vent Argenté, Draco-Ascension, Acide Malique et Tour Rapide ont maintenant leurs bonnes variations de statistiques"
              ]
            },
            {
              icon: phIcon('tag-simple'), label: 'Noms officiels & mécaniques complétées',
              items: [
                "Les 834 attaques portent maintenant leur nom français officiel (234 renommées : Balayage, Colère, Larcin, Hantise, Clepto-Mânes, Carapiège, Sheauriken, Kokiyarme, Pouvoir Antique, Champ Herbu...), et Implore et Ombre Portée sont ajoutées avec leurs apprentissages officiels",
                "Hantise a sa vraie puissance (90) et traverse les protections",
                "Poursuite frappe avec une puissance doublée un Pokémon qui quitte le combat ; Frénésie augmente l'Attaque à chaque coup reçu ; Chant Canon double si un autre Pokémon l'a déjà utilisé ce tour ; Flamme Croix et Éclair Croix se renforcent l'un l'autre ; Vengeance double si un allié est tombé au tour précédent ; Trépignement, Cent Rancunes, Vaste Pouvoir et Force G suivent leurs vraies conditions",
                "Puissance Cachée prend le type déterminé par les IV du Pokémon, et Jugement / Coup Varia-Type prennent le type de la plaque ou de la mémoire tenue ; Retour et Frustration ont une puissance fixe de 102",
                "Plasma Punch électrise les capacités du tour, Jackpot rapporte de l'argent en Tour de Combat, Rayon Spectral, Choc Météore et Photo-Geyser ignorent le talent de la cible, Sanction Suprême neutralise le talent d'une cible qui a déjà agi, et Brouhaha empêche les Pokémon de s'endormir tant qu'il dure",
                "Aire d'Eau, Aire de Feu et Aire d'Herbe se combinent enfin en combat double : si deux alliés utilisent deux Aires différentes dans le même tour, elles fusionnent en une seule attaque de puissance 150 et créent un effet de camp pendant 4 tours (Eau + Feu : Arc-en-ciel, chances des effets secondaires doublées ; Feu + Herbe : Mer de Feu, 1/8 des PV perdus par tour chez l'adversaire hors Feu ; Herbe + Eau : Marécage, Vitesse adverse divisée par 4). Les effets s'affichent à côté des Poké Balls",
                "Techno-Buster change de type selon le Module tenu (Module Choc : Électrik, Pyro : Feu, Cryo : Glace, Aqua : Eau), en vente chez le Marchand Itinérant ; Jugement ne réagit plus qu'aux Plaques et Coup Varia-Type qu'aux Mémoires"
              ]
            },
            {
              icon: phIcon('brain'), label: 'IA & équipes des étages avancés',
              items: [
                "L'IA des dresseurs progresse avec les étages (4 niveaux : étages 1-4, 5-11, 12-24, 25+ ; les Mini-Boss et Boss montent d'un cran). Dès l'étage 5 elle estime les vrais dégâts de chaque capacité, repère les K.O., utilise les capacités prioritaires pour finir un Pokémon plus rapide et évite les capacités inutiles (immunités de type ou de talent comme Lévitation ou Absorbe-Eau)",
                "Dès l'étage 12, elle joue les capacités de statut au bon moment : elle se soigne quand ce n'est pas vain, monte ses stats seulement quand tu ne peux pas la mettre à mal, pose Piège de Roc / Picots, endort ou paralyse (sans viser les types immunisés), utilise Vampigraine, Clonage, Écrans, Vent Arrière, Distorsion, la météo, Provoc ou Hurlement selon la situation",
                "Dès l'étage 12 en combat simple, l'adversaire peut rappeler son Pokémon quand le duel est mal engagé (il fait peu de dégâts, en subit beaucoup ou ses stats sont tombées) pour envoyer un coéquipier qui encaisse le coup et prend l'avantage. Il ne change jamais deux tours de suite, en nombre limité, subit les pièges d'entrée et peut être rattrapé par Poursuite. Aux étages 25+ il connaît les capacités de ton Pokémon actif pour anticiper ses dégâts, change plus souvent et se protège face aux capacités à charge",
                "Le remplaçant envoyé après un K.O. est choisi selon le duel réel (dégâts dans les deux sens) dès l'étage 5, plus seulement selon les types",
                "Le Campement (Pokéshop, Ranch, Centre Pokémon, Marchand Itinérant) s'affiche maintenant aussi après une victoire contre un Mini-Boss, comme après un Boss, au lieu du simple Centre de soin rapide d'avant",
                "Les équipes adverses sont composées plus intelligemment dès l'étage 5 : plusieurs candidats sont tirés puis on garde ceux qui forment la meilleure équipe (stats élevées, faiblesses communes évitées, résistances et couvertures complémentaires, mélange d'attaquants physiques et spéciaux, au moins un Pokémon rapide). Les Pokémon puissants sont de plus en plus favorisés dans les tirages, et l'as de l'équipe passe en dernier à partir de l'étage 10",
                "Les attaques des adversaires sont mieux choisies : meilleur STAB de chaque type, couverture des types non touchés super efficacement, puis jusqu'à 2 capacités utiles (soin, montée de stats, pièges, statut, Distorsion...) aux étages avancés au lieu de simplement les plus puissantes",
                "Les adversaires ont des EV et une nature adaptés à leur rôle (attaquant rapide ou Pokémon défensif) et tiennent des objets à partir de l'étage 6 : Orbe Vie, baies, Restes, Ceinture Force, Veste de Combat, et dès l'étage 12 Bandeau / Lunettes / Mouchoir Choix",
                "Correction : en combat double, quand il ne reste plus qu'un Pokémon d'un camp après un K.O., l'écran plantait et le combat restait bloqué ; le survivant passe maintenant sur le terrain principal"
              ]
            },
            {
              icon: phIcon('mountains'), label: 'Corrections de combat',
              items: [
                "Les pièges d'entrée fonctionnent enfin : Piège de Roc (dégâts selon la faiblesse au type Roche), Picots (jusqu'à 3 couches, de plus en plus douloureux), Pics Toxik (jusqu'à 2 couches, nouvelle capacité qui empoisonne) et Toile Gluante (baisse la Vitesse) sont posés sur le camp adverse et touchent chaque Pokémon qui entre ensuite en combat (changement, remplaçant après un K.O., Hurlement, Change-Éclair...)",
                "Picots, Pics Toxik et Toile Gluante ne touchent pas les Pokémon Vol ni ceux avec Lévitation ; un Pokémon Poison au sol absorbe les Pics Toxik. Tour Rapide et Toupie Éclat éliminent les pièges du camp de leur lanceur. Les pièges posés s'affichent à côté des Poké Balls de chaque camp, et les dresseurs adverses savent maintenant les utiliser",
                "« Pointes » est renommée Picots, et Pics Toxik est ajoutée à plusieurs Pokémon Poison (Nidoran, Rozbouton, Mimigal, Qwilfish, Rapion, Cradopaud, Miamiasme, Germéclat)",
                "Un bouton Z rejoint Dynamax, Méga et Téracristal dans la colonne des mécaniques de combat : il est grisé (avec une infobulle qui explique pourquoi) tant que le Pokémon ne tient pas de Cristal Z ou n'a aucune attaque offensive du bon type, au lieu du bandeau qui n'apparaissait que quand la Capacité Z était utilisable",
                "Les boutons Dynamax, Méga et Téracristal ne disparaissent plus après le premier combat : la colonne des mécaniques restait masquée après un écran de choix (Pokémon suivant après un K.O., cible en combat double, changement de Pokémon) et ne revenait plus pour les combats suivants",
                "Le gel n'est plus interminable : un Pokémon gelé dégèle toujours au bout de 3 tours perdus au maximum (20 % de chance de dégel à chaque tour comme avant), et les capacités Feu comme Roue de Feu ou Feu Sacré dégèlent leur lanceur"
              ]
            }
        ]
      },
      {
        version: 'v0.10.4',
        title: 'v0.10.4 — Chromatiques, Méga en combat & Infinimax',
        categories: [
            {
              icon: phIcon('book-open'), label: 'Pokédex : Pokémon manquants & fiches détaillées',
              items: [
                "Nymphali, l'évolution Fée d'Évoli, était absente de la lignée ; ajoutée aux côtés des 7 autres Évolis",
                "Métamorph et Tapatoès, totalement absents du jeu, sont ajoutés",
                "Toxizap n'avait que Salarsen (Forme Ampérée) : Salaquin (Forme Placide) est ajoutée comme seconde évolution possible",
                "La lignée de Verpom était codée comme une évolution en chaîne (Pomdrapi évoluant en Dratatin) alors que ce sont deux évolutions distinctes de Verpom, comme Flapple/Appletun dans les vrais jeux ; corrigé",
                "Les deux formes de Shifours (Style Farouche / Style Aqua) n'avaient pas de numéro de Pokédex enregistré, ce qui pouvait casser leur sprite ; corrigé",
                "Chaque carte du Dex est maintenant cliquable et ouvre une fiche complète : stats de base, talents avec description, chaîne d'évolution cliquable pour naviguer d'un stade à l'autre, et movepool complet",
                "Le bouton d'évolution de l'éditeur d'équipe affiche maintenant le sprite du stade ou de la branche cible, pas seulement son nom"
              ]
            },
            {
              icon: phIcon('dna'), label: 'Points d’Effort (EV)',
              items: [
                "La répartition des EV passe d'une base 252 à une base 32 par statistique (comme sur Pokémon Champion), pour être plus lisible : c'est un raccourci d'affichage, le bonus réel de statistique obtenu au maximum reste rigoureusement identique à avant",
                "Un plafond global de 66 points d'EV au total s'ajoute au plafond de 32 par statistique, avec un total affiché dans l'éditeur d'équipe"
              ]
            },
            {
              icon: phIcon('sparkle'), label: 'Pokémon Chromatiques (Shiny)',
              items: [
                "Chaque Pokémon proposé en draft ou au Ranch a désormais 0,2 % de chance d'apparaître sous sa forme chromatique, tirée au moment même où il est proposé (donc visible avant de le choisir)",
                `Un Pokémon chromatique choisi le reste pour toujours (sprite et pastille ${phIcon('sparkle')} affichés partout : équipe, combat, Ranch, PC, sac) ; s'il n'est pas choisi, la chance est perdue`
              ]
            },
            {
              icon: phIcon('book-open'), label: 'Fiche Dex détaillée',
              items: [
                "Corrigé : la fiche détaillée d'un Pokémon du Dex ne s'ouvrait plus au clic sur une carte",
                "Le mode développeur ne demande plus la manipulation cachée (7 clics + code) : il s'active directement via un bouton dans le menu principal",
                "La fiche Dex permet maintenant de prévisualiser la forme chromatique d'un Pokémon, ainsi que ses formes Méga et Gigamax quand il en possède",
                "Une barre de recherche est ajoutée à la liste des capacités de la fiche, et le movepool est désormais séparé en trois catégories (Physique / Spéciale / Statut) au lieu d'être mélangé"
              ]
            },
            {
              icon: phIcon('spiral'), label: 'Nouveau Pokémon',
              items: [
                "Éthernatos Infinimax ajouté comme forme alternative d'Éthernatos, avec un spawn en draft encore plus rare qu'un légendaire"
              ]
            },
            {
              icon: phIcon('repeat'), label: 'Métamorph : Morphing & talent Imposteur',
              items: [
                "Métamorph n'apprend plus que Morphing, sa seule capacité, au lieu d'un movepool complet, comme dans les vrais jeux",
                "Morphing copie réellement l'adversaire ciblé : nom, apparence, types, talent, statistiques (hors PV) et ses 4 capacités (5 PP chacune), et ce jusqu'à ce que Métamorph change de camp",
                "Le talent Imposteur, jusque-là purement descriptif, déclenche désormais cette même transformation automatiquement dès l'entrée en combat de son porteur"
              ]
            },
            {
              icon: phIcon('diamond'), label: 'Refonte de la Méga-Évolution',
              items: [
                "La Méga-Évolution devient une mécanique de combat au même titre que le Dynamax et la Téracristallisation : le Pokémon doit tenir sa Méga-Gemme et se Méga-Évolue manuellement durant le combat via un bouton dédié, au lieu d'être automatique dès que l'objet est équipé",
                "Une fois activée, la Méga-Évolution dure jusqu'à la fin du combat, même si le Pokémon change et revient ensuite ; il redevient normal une fois le combat terminé"
              ]
            },
            {
              icon: phIcon('film-reel'), label: 'Animations d’activation',
              items: [
                "Le Dynamax, la Téracristallisation, la Méga-Évolution et les Capacités Z ont désormais chacun une animation dédiée au moment de leur activation (halo, anneaux d'énergie, éclats, particules), inspirée du style de Pokémon Showdown"
              ]
            },
            {
              icon: phIcon('device-mobile'), label: 'Combat mobile & confort d’interface',
              items: [
                "La puissance et les PP des attaques n'étaient plus coupés par des « ... » faute de place sur mobile : le détail passe à la ligne au lieu d'être tronqué, en portrait comme en paysage ; en paysage très compact, la colonne d'attaques devient défilable en dernier recours pour ne jamais rien cacher",
                "Une barre de recherche apparaît dans les longs menus déroulants (Nature, Talent, choix d'une attaque...) dès qu'il y a plus de 8 options",
                "L'écran de défaite affiche maintenant toute l'équipe du dresseur qui t'a vaincu (K.O./grisés comme la tienne, avec un repère sur ceux qui étaient encore sur le terrain), pas seulement ses Pokémon encore debout au moment du K.O.",
                `Un bouton ${phIcon('magnifying-glass')} Détails est ajouté sur chaque Pokémon des écrans de changement en combat (volontaire et après un K.O.) et de la fenêtre Équipe : stats réelles, talent, objet tenu, statut et les 4 attaques avec type/catégorie/puissance, sans devoir rouvrir l'éditeur d'équipe`
              ]
            },
            {
              icon: phIcon('wrench'), label: 'Corrections diverses',
              items: [
                "Mortier Matcha ne boostait que l'Attaque du lanceur et n'avait aucun autre effet : il draine maintenant la moitié des dégâts infligés et peut brûler la cible, comme dans les vrais jeux",
                "Le type affiché d'un Pokémon transformé (Téracristallisé, Méga-Évolué...) ne correspondait pas toujours à son type réel du moment dans certains écrans (pastille de type en combat, liste de changement, fenêtre du sac) ; corrigé partout",
                "Corrigé : jouer une capacité pouvait faire sauter le sprite de ton Pokémon en haut à gauche de l'écran de combat le temps de l'animation, à cause des effets visuels de capacité qui perturbaient sa position ; il reste maintenant bien en place"
              ]
            }
        ]
      }
    ]
  },
  {
    version: 'v0.9',
    title: 'v0.9 — Gen 8 Update : Galar & Dynamax/Gigamax',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "88 nouveaux Pokémon ajoutés (région de Galar, Pokédex complet 1 → 890), dont les 3 starters, Zacian et Zamazenta (avec leurs formes Épée Sacrée/Bouclier Royal via objet tenu) et Éthernatos",
          "14 nouvelles lignées de Formes de Galar, sélectionnables indépendamment de leurs versions Kanto/Johto au draft (Miaouss, Ponyta, Ramoloss, Canarticho, Smogogo, M. Mime, Artikodin, Électhor, Sulfura, Corayon, Zigzaton, Daruman, Tuniversion et Stunfisk de Galar)",
          "Les Pokémon des deux extensions ajoutés : Wushours pouvant devenir Shifours Style Farouche ou Style Aqua via objet tenu, Zarude, Régieleki, Régidrago, Blizzeval, Spectreval, et Sylveroy pouvant fusionner avec l'un des deux pour devenir Monture Glace ou Monture Spectre"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Capacités',
        items: [
          "89 nouvelles attaques de Génération 8 (Damoclès Corporel, Roue Libre, Ballon Pyro, Bras Articulé, Draco-Flèches, Frappes Déferlantes, Triple Axel, Poltergeist, Faisceau d'Acier...)",
          "Movepool enrichi pour de nombreuses lignées Gen 1-7 avec ces nouvelles attaques, selon leur type et leur thème",
          "Damoclès Corporel calcule ses dégâts à partir de la Défense du lanceur plutôt que de son Attaque, et Bras Articulé change de catégorie physique/spéciale selon la statistique la plus haute du lanceur, comme dans les vrais jeux"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Talents',
        items: [
          "29 nouveaux talents de Génération 8, dont plusieurs avec un vrai effet codé en combat : Libéro (change de type comme Protéen), Corps Fatal et Âme Vagabonde (déclenchés au contact), Armure Miroir (renvoie les baisses de statistiques), Écailles Glacées (réduit les dégâts spéciaux subis), Voile Pastel (immunité au poison), Punk Rock (renforce/résiste aux capacités sonores), Turbo Vapeur (Vitesse à fond si touché par le Feu ou l'Eau), Transistor et Mâchoire du Dragon (renforcent leur type), Esprit d'Acier (renforce l'Acier du porteur et de ses alliés), Hennissement Glacial/Sinistre (boost après un KO, comme Éclosion), Instinct Gorille (Attaque boostée mais bloqué sur la première capacité), Chute Cotonneuse et Crache-Sable (déclenchés en prenant des dégâts)",
          "Les autres nouveaux talents (Ramasse Ball, Mûrissement, Tête de Gel, Mimétisme...) ont leur description dans le Pokédex mais restent sans effet mécanique codé pour l'instant"
        ]
      },
      {
        icon: phIcon('circle'), label: 'Dynamax & Gigamax',
        items: [
          "Nouveau système de Dynamax : une fois par combat, un Pokémon peut Dynamaxer pendant 3 tours, ses PV actuels et max augmentant de 50%",
          "Pendant le Dynamax, chaque capacité offensive choisie devient une Capacité Max du même type, avec une puissance boostée selon la table de conversion officielle",
          "Nouvel objet tenu Facteur Gigamax : les lignées Gigamax-éligibles obtiennent en plus le nom officiel de leur Capacité G-Max, et pour une quinzaine d'entre elles (Gorythmic, Pyrobut, Lézargus, Dracaufeu, Corvaillus, Monthracite, Salarsen, Scolocendre, Angoliath...) un vrai effet bonus (dégâts fixes élevés, statut garanti, piège, tempête de sable, endormissement différé...)"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.9.1',
        title: 'v0.9.1 — Légendes Arceus Update : Hisui',
        categories: [
          {
            icon: phIcon('book-open'), label: 'Pokédex & Contenu',
            items: [
              "12 nouvelles lignées de Formes de Hisui (région de Hisui), sélectionnables indépendamment de leurs versions Kanto/Johto/Unova au draft (Caninos, Voltorbe, Typhlosion, Qwilfish, Farfuret, Clamiral, Fragilady, Zorua, Gueriaigle, Colimucus, Séracrawl et Archéduc d'Hisui)",
              "7 nouvelles évolutions inédites : Cerbyllin (Cerfrousse), Hachécateur (nouvelle branche d'évolution d'Insécateur, aux côtés de Cizayox), Ursaking (Ursaring), Paragruel (Bargantua), Farfurex (Farfuret de Hisui) et Qwilpik (Qwilfish de Hisui)",
              "Amovénus rejoint Boréas, Fulguris et Démétéros : une forme Totémique via le Miroir Sacré, déjà vendu par le Marchand Itinérant"
            ]
          },
          {
            icon: phIcon('sword'), label: 'Capacités & Talents',
            items: [
              "Les nouvelles lignées apprennent les capacités propres à Légendes Arceus déjà présentes dans le Pokédex (Griffe Fatale, Bouclier Psy, Tempête Printanière, Triple Flèches, Tranchant Sans Fin, Hache de Pierre, Rafale des Cimes...)",
              "2 nouveaux talents avec un vrai effet codé en combat : Incisif (+50% de puissance pour les capacités tranchantes) et Querelleur (les capacités Normal/Combat touchent les Pokémon Spectre)",
              "Les autres talents attribués (Frisk, Illusion, Rattled, Mold Breaker, Healer, Contrary, Sharpness et bien d'autres) réutilisent les talents déjà existants dans le Pokédex"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.8',
    title: 'v0.8 — Gen 7 Update : Alola & Capacités Z',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "88 nouveaux Pokémon ajoutés (région d'Alola, Pokédex complet 1 → 809), dont les 3 starters, les Gardiens des Îles (Tokorico, Tokopiyon, Tokotoro, Tokopisco), Cosmog/Cosmovum évoluant en Solgaleo ou Lunala, Necrozma et ses 3 fusions, Magearna, Marshadow, Zeraora, et Meltan/Melmetal",
          "Les 11 Ultra-Chimères ajoutées (Zéroïd, Mouscoto, Cancrelove, Câblifère, Bamboiselle, Katagami, Engloutyran, Vémini/Mandrillon, Ama-Ama, Pierroteknik), toutes dotées du talent Éclosion",
          "10 nouvelles lignées de Formes d'Alola, sélectionnables indépendamment de leurs versions Kanto au draft (Rattata, Sabelette, Goupix, Taupiqueur, Miaouss, Racaillou, Tadmorv, Noadkoko, Ossatueur et Raichu d'Alola)",
          "Necrozma peut fusionner avec Solgaleo ou Lunala (ou devenir Ultra-Necrozma) via 3 nouveaux objets tenus, vendus par le Marchand Itinérant, sur le même principe que la Méga-Évolution",
          "Lougaroc (Forme Diurne/Nocturne/Crépusculaire) et Plumeline (Styles Flamenco/Pom-Pom/Hula/Buyō) sont désormais de vraies branches d'évolution aux stats/types distincts, sur le même principe qu'Évoli",
          "Silvallié change de type selon la Mémoire tenue (17 nouvelles Mémoires chez le Marchand Itinérant), sur le même principe qu'Arceus et ses Plaques",
          "Météno affiche désormais l'une de ses 7 couleurs de noyau au hasard, purement cosmétique, comme les formes de Zarbi"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Capacités',
        items: [
          "47 nouvelles attaques de Génération 7 (Roc Éclair, Écran Aurore, Ruade Puissante, Laser Prismatique, Danse Révélation, Étranglement, Crocs Psy, Lame Solaire, Marteau Glace, Multi-Coups...)",
          "Movepool enrichi pour de nombreuses lignées Gen 1-6 avec ces nouvelles attaques, selon leur type et leur thème"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Talents & Capacités Z',
        items: [
          "~30 nouveaux talents de Génération 7, dont plusieurs avec un vrai effet codé en combat : Éclosion (boost après un KO), les 4 Terrains Surge des Gardiens des Îles, Fantaisie (annule le premier coup subi), Comateux (immunité totale au statut), Armure Prisme / Force Neurale (dégâts super efficaces réduits/augmentés), Banc de Poissons et Corps Blindé (changement de forme selon les PV), Écume (résistance Feu / immunité brûlure / dégâts Eau doublés)",
          "Nouveau système de Capacités Z : 18 Cristaux Z (un par type, ex. Pyrozélite, Aquazélite, Voltazélite...) en vente chez le Marchand Itinérant",
          "En combat, un Pokémon tenant le bon Cristal Z peut déclencher une Capacité Z une fois par combat : la capacité correspondante devient un coup unique surboosté et toujours précis, avec une puissance suivant la vraie table de conversion officielle"
        ]
      }
    ]
  },
  {
    version: 'v0.7',
    title: 'v0.7 — Gen 6 Update : Kalos & Méga-Évolution',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "72 nouveaux Pokémon ajoutés (région de Kalos, Pokédex complet 1 → 721)",
          "Nouveau type Fée, avec le retypage rétroactif officiel de 8 lignées existantes (Mélofée, Rondoudou, Marill, Grodoudou, Togépi, M. Mime, Tarsal/Kirlia/Gardevoir, Mysdibule)",
          "6 nouveaux Pokémon Légendaires/Fabuleux (Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion) et une nouvelle lignée pseudo-légendaire (Mucuscule/Colimucus/Muplodocus)",
          "Movepool enrichi pour de nombreuses lignées existantes avec les nouvelles attaques de Génération 6 pertinentes selon leur thème"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Capacités & Talents',
        items: [
          "48 nouvelles attaques de Génération 6 (Coup Lune, Éclat Insolite, Ronde Trompeuse, Bourrasque Fée, Poing Machine, Diamantron, Douille Électrique, Bang Sonique, Plaquage Volant, Ascension Draco...), avec leurs vraies mécaniques (multi-frappes, dégâts bi-type, pièges, terrains, altérations de stats inversées...)",
          "23 nouveaux talents de Génération 6 avec leurs effets réellement codés en combat (Protéen, Fourrure, Mâchouille, Aura Sombre/Féérique, Lien Parental, Poigne Magique, Bajoues, Sans Contact...)",
          "4 nouveaux Terrains de combat (Herbu, Électrifié, Brumeux, Psychique), chacun avec ses propres effets"
        ]
      },
      {
        icon: phIcon('diamond'), label: 'Méga-Évolution',
        items: [
          "12 Méga-Évolutions ajoutées via de nouveaux objets tenus exclusifs (Florizarre, Dracaufeu X et Y, Tortank, Kangourex, Léviator, Mewtwo Y, Cizayox, Gardevoir, Carchacrok, Lucario, Métalosse), disponibles chez le Marchand Itinérant"
        ]
      },
      {
        icon: phIcon('film-reel'), label: 'Combats',
        items: [
          "Le sprite du Pokémon du joueur est désormais plus grand que celui de l'adversaire, pour renforcer l'impression d'être derrière son propre Pokémon",
          "Les Pokémon affichent maintenant une taille de sprite variable selon leur gabarit réel (les plus imposants comme Onix ou Wailord paraissent nettement plus grands que les plus petits comme Statitik ou Flabébé)"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.7.1',
        title: 'v0.7.1 — Village vivant & Corrections',
        categories: [
          {
            icon: phIcon('house'), label: 'Village',
            items: [
              "Le Village devient une vraie carte interactive : bâtiments illustrés (Pokécentre, Pokéshop, Ranch, Équipe, Marchand) positionnés sur une scène animée avec ciel, nuages et végétation",
              "1 à 2 Pokémon de l'équipe se promènent désormais sur la carte, avec leur sprite animé"
            ]
          },
          {
            icon: phIcon('crown'), label: 'Dresseurs',
            items: [
              "Chaque Maître de Type affiche maintenant un vrai sprite de dresseur officiel associé à son type, au lieu d'un simple emoji"
            ]
          },
          {
            icon: phIcon('music-notes'), label: 'Musique',
            items: [
              "La musique se lance désormais de façon fiable dès la toute première interaction, quel que soit l'endroit cliqué",
              "Chaque ambiance (Menu, Village, Combat) peut désormais contenir plusieurs pistes jouées aléatoirement en playlist, sans jamais répéter deux fois de suite le même morceau",
              "Les combats contre un Maître de Type peuvent désormais avoir leur propre musique dédiée selon le type affronté"
            ]
          },
          {
            icon: phIcon('desktop'), label: 'Interface',
            items: [
              "Les listes de sélection de type et de rareté du Pokédex affichent désormais des pastilles colorées au lieu de texte brut",
              "La sélection de nature affiche la statistique boostée en vert et celle réduite en rouge",
              "Ajout d'un second filtre de type dans le Pokédex, pour rechercher un double-type précis (ex : Feu + Vol)"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Les équipes des Maîtres de Type n'étaient en réalité pas toujours 100% du bon type (un stade ou une forme différente de la lignée pouvait apparaître) : corrigé",
              "Bâillement endormait instantanément la cible au lieu d'agir avec un tour de délai comme dans les vrais jeux : corrigé"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.6',
    title: 'v0.6 — Gen 5 Update : Unova',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "156 nouveaux Pokémon ajoutés (région d'Unova, Pokédex complet 1 → 649)",
          "19 nouveaux talents de Génération 5 ajoutés avec leurs vraies descriptions officielles (Victorieux, Contestation, Mode Zen, Illusion, Garde Magik, Défaitiste, Herbivore, Épine de Fer, Turbo Brasier, Téra-Voltage...)",
          "13 nouveaux Pokémon Légendaires/Fabuleux (Victini, Cobalion, Terrakion, Virizion, Tornadus, Thundurus, Reshiram, Zekrom, Landorus, Kyurem, Keldeo, Meloetta, Genesect) et 2 nouvelles lignées pseudo-légendaires (Coupenotte/Tranchodon, Solochi/Trioxhydre)",
          "5 nouveaux Pokémon Rares (Zorua/Zoroark, Larvesta/Volcarona, Druddigon, Tirtouga/Carracosta, Archen/Archeops)"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.6.1',
        title: 'v0.6.1 — Formes alternatives & Marchand',
        categories: [
          {
            icon: phIcon('eye'), label: 'Objets de forme',
            items: [
              "Nouveaux objets tenus exclusifs : Orbe Platiné (Giratina → Forme Originelle), Gracidée (Shaymin → Forme Ciel), Miroir Sacré (Boréas, Fulguris ou Démétéros → Forme Totémique) et 5 appareils pour Motisma (Chauffe, Lavage, Frigo, Ventilateur, Tondeuse)",
              "16 Plaques pour Arceus, chacune changeant son type selon la Plaque équipée",
              "Équiper ou retirer un objet de forme recalcule immédiatement le type, les stats et le talent du Pokémon concerné"
            ]
          },
          {
            icon: phIcon('magic-wand'), label: 'Marchand Itinérant',
            items: [
              "Nouveau PNJ au Village : 20% de chance d'apparaître à chaque visite, il vend exclusivement les objets de forme"
            ]
          },
          {
            icon: phIcon('film-reel'), label: 'Combats',
            items: [
              "Les Pokémon en combat affichent désormais leur sprite animé (style Noir & Blanc) au lieu du sprite statique, avec repli automatique vers le sprite statique si l'animation n'est pas disponible"
            ]
          },
          {
            icon: phIcon('desktop'), label: 'Interface',
            items: [
              "Le menu principal fusionne Nouvelle partie / Continuer / Boosts dans un seul bouton ▶ Jouer",
              "Textes agrandis sur l'écran d'accueil et les Notes de mise à jour pour une meilleure lisibilité"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Dialga et Palkia ne possèdent plus Télépathe",
              "Giratina a maintenant Lévitation comme seul talent"
            ]
          }
        ]
      },
      {
        version: 'v0.6.2',
        title: 'v0.6.2 — Combats de jumeaux',
        categories: [
          {
            icon: phIcon('users'), label: 'Combat double',
            items: [
              "Sur les étages normaux (ni Mini-Boss, ni Boss), petite chance (~12%) de tomber sur un duo de jumeaux et de devoir les affronter en vrai combat double : 2 Pokémon actifs simultanément de chaque côté",
              "Récompense en argent légèrement supérieure à un combat normal pour compenser la difficulté accrue"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.5',
    title: 'v0.5 — Gen 4 Update : Sinnoh',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "107 nouveaux Pokémon ajoutés (région de Sinnoh, Pokédex complet 1 → 493)",
          "18 lignées existantes reçoivent leur évolution ou pré-évolution de Génération 4 (Magnézone, Lucario, Tangrowth, Yanmega, Mamoswine, Weavile, Honchkiss, Roserade, Porygon-Z, Bébés Happiny/Mime Jr./Bonsly/Munchlax/Mantyke/Chingling...)",
          "2 nouvelles évolutions pour Évoli : Phyllali et Givrali",
          "7 nouvelles attaques de Génération 4 (Aurasphère, Close Combat, Exploforce, Draco-Météore, Dracochoc, Demi-Tour, Piège de Roc)",
          "14 nouveaux Pokémon Légendaires/Fabuleux (le Trio du Lac, Dialga, Palkia, Heatran, Regigigas, Giratina, Cresselia, Phione, Manaphy, Darkrai, Shaymin, Arceus) et Carchacrok en pseudo-légendaire"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.5.1',
        title: 'v0.5.1 — Progression & Rééquilibrage',
        categories: [
          {
            icon: phIcon('ticket'), label: 'Jetons de Tour',
            items: [
              "Nouvelle monnaie méta gagnée à la défaite selon l'étage atteint (taux différent par difficulté, pour éviter le hard farm en Facile)",
              "Boutique de Boosts (accessible au menu) : déblocages permanents et globaux — Bourse de départ, Trousse de secours, Carte de fidélité, Draft assisté"
            ]
          },
          {
            icon: phIcon('first-aid-kit'), label: 'Centre Pokémon',
            items: [
              "En mode Difficile, une halte de soin gratuite apparaît désormais après chaque Mini-Boss (en plus du Village après les Boss)"
            ]
          },
          {
            icon: phIcon('dice-five'), label: 'Événements aléatoires',
            items: [
              "25% de chance d'un événement après un étage normal, avec un texte lié à l'étage atteint",
              "2 événements sûrs (Bourse oubliée, Source curative) et 6 événements risqués (Buisson suspect, Champignons étranges, Distributeur mystérieux, Passage instable, Marchand louche, Nid sauvage)",
              "Chaque échec risqué coûte toujours de l'argent ou un objet ; en Difficile, s'ajoute un vrai statut aléatoire ou un Pokémon bloqué pour le combat suivant"
            ]
          },
          {
            icon: phIcon('sword'), label: 'Rééquilibrage des dresseurs',
            items: [
              "Chaque Boss est désormais un vrai Maître de Type (équipe 100% du même type, circuit sans répétition sur les 17 types par run)",
              "IA excellente pour les Boss : choisit toujours la meilleure attaque et le meilleur Pokémon de relève selon les types",
              "Les légendaires sont désormais bien plus rares dans les équipes des dresseurs non-Boss (taux mesuré ~14% → ~1%)",
              "Nouveau système de badges (un par type de Maître battu), suivi séparément par difficulté et affiché dans l'écran Score"
            ]
          },
          {
            icon: phIcon('prohibit'), label: 'Anti-boucle',
            items: [
              "Quitter vers le menu en plein combat met le combat en pause (même dresseur, mêmes PV) au lieu de l'abandonner : tout reprend exactement où on l'a laissé au retour",
              "Une défaite supprime désormais la sauvegarde en cours, impossible de recharger pour retenter le même combat en boucle"
            ]
          },
          {
            icon: phIcon('medal'), label: 'Badges',
            items: [
              "Les badges utilisent maintenant les vraies icônes de type sur une pièce grise, au lieu d'émojis"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "9 noms français erronés du Pokédex corrigés (dont Tyranocif, Granbull, Cadoizo, Lovdisc, Terhal) et le numéro de Zarbi restauré",
              "203 capacités avaient une précision fausse (repli silencieux à 95%) : toutes corrigées à leur vraie valeur officielle",
              "Surpuissance, Close Combat, Draco-Météore, Surchauffe et Psycho Boost n'affaiblissaient jamais réellement le lanceur : corrigé",
              "Prescience touchait le Pokémon présent sur le terrain à la résolution au lieu de suivre sa cible d'origine : corrigé",
              "Ténacité rendait le Pokémon immortel indéfiniment (l'effet n'était jamais réinitialisé) : corrigé",
              "Les Maîtres de Type n'avaient en réalité jamais une équipe 100% du même type en jeu (paramètre manquant à l'appel) : corrigé",
              "Le meilleur étage ne se rechargeait plus après un rafraîchissement de la page : corrigé"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.4',
    title: 'v0.4 — Gen 3 Update : Hoenn',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "135 nouveaux Pokémon ajoutés (région de Hoenn, Pokédex complet 1 → 386)",
          "20 nouveaux talents de Génération 3 (Fermeté, Garde Mystik, Cran, Crachin, Sécheresse, Sable Volant, Marque Ombre, Ventouse, Air Lock, Peau Dure, Turbo, Déguisement...)",
          "45 nouvelles attaques de Génération 3 (Danse Draco, Feu Follet, Surchauffe, Calmesprit, Provoc, Souvenir, Sabotage...)",
          "Restructuration des évolutions à embranchements façon Évoli (Chenipotte, Arakdo)"
        ]
      },
      {
        icon: phIcon('backpack'), label: 'Objets & Village',
        items: [
          "30 objets ajoutés avec sprites et effets officiels (Potions à paliers, anti-statuts, Baies, objets stratégiques comme Bandeau Choix, Orbe Vie, Veste de Combat...)",
          "Pokéshop réorganisé en 3 onglets par catégorie",
          "Nouveau système de PC (6 emplacements, accessible via le Pokécentre)",
          "Boutons Sac et Équipe accessibles depuis la Tour et le Village",
          "Le Ranch devient un mini-draft de recrutement (3 choix, 1 seul Pokémon gardé)"
        ]
      },
      {
        icon: phIcon('bug'), label: 'Corrections',
        items: [
          "Immunités de type aux altérations de statut corrigées (Poison/Acier immunisés au poison, Feu à la brûlure, Glace au gel)",
          "Correction du seuil de déclenchement de la Baie Oran"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.4.1',
        title: 'v0.4.1 — Combat & Interface Update',
        categories: [
          {
            icon: phIcon('music-notes'), label: 'Musique',
            items: [
              "Musiques d'ambiance différentes pour le Menu, le Village et les Combats",
              `Bouton ${phIcon('gear')} Paramètres avec réglage du volume`
            ]
          },
          {
            icon: phIcon('sword'), label: 'Interface de combat',
            items: [
              "Suppression du cadre autour des combattants, sprite vu de dos pour ton Pokémon",
              "Pastilles de type compactes (icône seule) au lieu des badges texte",
              "Nouvelles icônes de statut (Poison, Brûlure, Paralysie, Sommeil, Confusion, Gel)",
              "Historique de combat défilant sur plusieurs tours",
              "Bannière du dresseur adverse mise en avant, avec liseré doré (Boss) ou violet (Mini-Boss)",
              "Zone de terrain et zone d'actions clairement séparées visuellement"
            ]
          },
          {
            icon: phIcon('spiral'), label: 'Mécaniques de combat',
            items: [
              "Animations d'attaque selon le type (icône dédiée, projectile pour les Spéciales, impact pour les Physiques)",
              "Les capacités à charge (Lance-Soleil, Coud'Krâne, Coupe-Vent, Vol, Tunnel, Plongée) prennent réellement 2 tours, avec enchaînement automatique",
              "Vol/Tunnel/Plongée rendent invulnérable pendant la charge, sauf face à Séisme, Ampleur, Lame du Vide, Tornade, Ouragan, Fatal-Foudre, Stratopercut, Surf et Siphon",
              "Prescience frappe désormais 2 tours après son utilisation"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Correction de la fiabilité des sprites Pokémon et des icônes d'objets/baies/potions",
              "Le Ranch ne se retire plus à l'infini en changeant d'onglet",
              "Correction des boutons \"Changer de Pokémon\" et \"Sac\" qui ne répondaient plus en combat"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.3',
    title: 'v0.3 — Gen 2 Update : Johto',
    categories: [
      {
        icon: phIcon('book-open'), label: 'Pokédex & Contenu',
        items: [
          "100 Pokémon de la Génération 2 ajoutés (région de Johto complète, hors Zarbi)",
          "Évolutions ajoutées : Crobat, Steelix, Blissey, Kingdra, Scizor, Porygon2...",
          "Nouvelles branches d'évolution : Bellossom, Politoed, Slowking, Espeon, Umbreon"
        ]
      },
      {
        icon: phIcon('lightning'), label: 'Types & Capacités',
        items: [
          "2 nouveaux types : Acier et Ténèbres, avec leurs efficacités",
          "Nouvelles capacités Acier/Ténèbres (Tête de Fer, Vibrobscur, Coup Bas...)"
        ]
      }
    ],
    subVersions: [
      {
        version: 'v0.3.1',
        title: 'v0.3.1 — Équilibrage Update',
        categories: [
          {
            icon: phIcon('sliders'), label: 'Modes de difficulté',
            items: [
              "Ajout de 3 modes de difficulté au lancement d'une partie",
              "Facile : draft de Pokémon déjà entièrement évolués, avec des builds prêts à l'emploi",
              "Normal : draft classique, PV restaurés après chaque combat",
              "Difficile : draft classique, PV et altérations d'état conservés d'un combat à l'autre"
            ]
          },
          {
            icon: phIcon('book-open'), label: 'Contenu',
            items: [
              "Nouvelles attaques ajoutées",
              "Movepool des Pokémon enrichi"
            ]
          },
          {
            icon: phIcon('bug'), label: 'Corrections',
            items: [
              "Traduction des attaques, talents et natures corrigée"
            ]
          },
          {
            icon: phIcon('floppy-disk'), label: 'Sauvegarde',
            items: [
              "Système de sauvegarde à 5 emplacements"
            ]
          }
        ]
      }
    ]
  },
  {
    version: 'v0.2',
    title: 'v0.2 — Village Update',
    categories: [
      {
        icon: phIcon('sword'), label: 'Tour de combat',
        items: [
          "PV persistants entre les combats",
          "Système d'argent - gains après chaque combat",
          "Mini-boss tous les 5 étages, Boss tous les 10"
        ]
      },
      {
        icon: phIcon('house'), label: 'Village',
        items: [
          "Village de repos débloqué après chaque Boss",
          "Pokécentre, Pokéshop, Ranch et PC au Village"
        ]
      },
      {
        icon: phIcon('backpack'), label: 'Objets & Équipe',
        items: [
          "Sac utilisable en combat et entre les combats",
          "Objets tenus (Baie Oran, Reste, Ceinture Force...)",
          "Objets stratégiques en récompense boss",
          "Gestion d'équipe avec changement de lead"
        ]
      }
    ]
  },
  {
    version: 'v0.1',
    title: 'v0.1 — Gen 1 Update : Kanto',
    categories: [
      {
        icon: phIcon('target'), label: 'Draft & Builder',
        items: [
          "Draft de 6 Pokémon Gen 1 (région de Kanto)",
          "Builder complet EV/IV/Nature/Talent/Attaques"
        ]
      },
      {
        icon: phIcon('sword'), label: 'Combat & Pokédex',
        items: [
          "Tour de combat avec 17 archétypes de dresseurs",
          "Système de combat au tour par tour",
          "Pokédex avec filtres"
        ]
      }
    ]
  }
];
const SPLASH_TEXTS = [
  "Gen 8 est disponible !",
  "Le Dynamax arrive !",
  "Déclenche ton Gigamax !",
  "Légendes : Arceus débarque !",
  "Les Formes de Hisui sont là !",
  "Construis ton équipe de rêve !",
  "Les Méga Z débarquent !"
];
// Génère le contenu HTML d'une entrée de patch note (liste de catégories avec icône, ou simple liste à puces).
function renderPatchNoteBody(v){
  if(v.categories){
    return v.categories.map(c => `
      <div class="patchnotes-category">
        <div class="patchnotes-category-label">${c.icon} ${c.label}</div>
        <ul>${c.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>`).join('');
  }
  return `<ul>${v.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
}
// Génère le bloc (repliable) d'une sous-version, réutilisé dans la liste défilante de sous-versions.
function renderSubVersionBlock(sv){
  return `
    <div class="patchnotes-version patchnotes-subversion">
      <div class="patchnotes-version-header">
        <span class="patchnotes-chevron">▸</span>
        <span class="patchnotes-version-title">${sv.title}</span>
      </div>
      <div class="patchnotes-version-content" style="display:none;">
        ${renderPatchNoteBody(sv)}
      </div>
    </div>`;
}
// Génère la liste complète des versions (repliables, la plus récente dépliée par défaut). Les
// sous-versions (ex. v0.10.1, v0.10.2) sont affichées en tête de leur version parente, de la plus
// récente à la plus ancienne, dans une liste défilante indépendante.
function renderPatchNotes(){
  return PATCH_NOTES.map((v,idx) => {
    const expanded = idx===0;
    const subs = (v.subVersions||[]).slice().reverse();
    return `
    <div class="patchnotes-version">
      <div class="patchnotes-version-header">
        <span class="patchnotes-chevron">${expanded?'▾':'▸'}</span>
        <span class="patchnotes-version-title">${v.title}</span>
      </div>
      <div class="patchnotes-version-content"${expanded?'':' style="display:none;"'}>
        ${subs.length ? `<div class="patchnotes-subversions">${subs.map(renderSubVersionBlock).join('')}</div>` : ''}
        ${renderPatchNoteBody(v)}
      </div>
    </div>`;
  }).join('');
}
// Ouvre la fenêtre des notes de mise à jour (accessible depuis le bouton d'accroche du menu).
function openPatchNotes(){
  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';
  overlay.id = 'patchNotesOverlay';
  overlay.innerHTML = `
    <div class="patchnotes-modal">
      <button class="patchnotes-close" id="patchNotesCloseBtn">${phIcon('x')}</button>
      <h2>◆ NOTES DE MISE À JOUR ◆</h2>
      ${renderPatchNotes()}
    </div>`;
  document.body.appendChild(overlay);
  const close = ()=> overlay.remove();
  document.getElementById('patchNotesCloseBtn').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
  overlay.querySelectorAll('.patchnotes-version-header').forEach(header=>{
    header.onclick = ()=>{
      const content = header.nextElementSibling;
      const chevron = header.querySelector('.patchnotes-chevron');
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? '' : 'none';
      chevron.textContent = isHidden ? '▾' : '▸';
    };
  });
}
document.getElementById('splashTextBtn').textContent = SPLASH_TEXTS[Math.floor(Math.random()*SPLASH_TEXTS.length)];
document.getElementById('splashTextBtn').onclick = openPatchNotes;

/* =================== START =================== */
showScreen('screenMenu');
