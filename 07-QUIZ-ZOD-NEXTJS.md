# Quiz: Validation Zod dans Next.js
## 50 Questions - Tous Niveaux

---

## Instructions

- 50 questions réparties par niveau de difficulté
- Répondez sans regarder les documents
- Les réponses sont à la fin du fichier
- Bon apprentissage!

---

## PARTIE 1: NIVEAU DÉBUTANT (Questions 1-15)

### Question 1
Quelle méthode permet d'installer Zod dans un projet?
```
A) npm install @zod/core
B) npm install zod
C) npm install zodjs
D) npm install validation-zod
```

### Question 2
Quel import est correct pour utiliser Zod?
```typescript
A) import zod from 'zod'
B) import { Zod } from 'zod'
C) import { z } from 'zod'
D) import * as zod from 'zod'
```

### Question 3
Quelle est la différence entre `parse()` et `safeParse()`?
```
A) parse() est plus rapide
B) parse() lance une erreur, safeParse() retourne un objet résultat
C) safeParse() est deprecated
D) Aucune différence
```

### Question 4
Comment créer un schéma pour un objet avec Zod?
```typescript
A) z.shape({ name: z.string() })
B) z.object({ name: z.string() })
C) z.struct({ name: z.string() })
D) z.interface({ name: z.string() })
```

### Question 5
Quel est le type primitif pour une chaîne de caractères?
```typescript
A) z.str()
B) z.text()
C) z.string()
D) z.varchar()
```

### Question 6
Comment rendre un champ optionnel dans Zod?
```typescript
A) z.string().optional()
B) z.string().nullable()
C) z.string().required(false)
D) z.optional(z.string())
```

### Question 7
Comment définir une valeur par défaut?
```typescript
A) z.string().defaultValue("test")
B) z.string().default("test")
C) z.string().fallback("test")
D) z.string().withDefault("test")
```

### Question 8
Si `safeParse()` réussit, où se trouvent les données validées?
```typescript
A) result.value
B) result.data
C) result.output
D) result.validated
```

### Question 9
Comment créer un schéma pour un tableau de strings?
```typescript
A) z.list(z.string())
B) z.array(z.string())
C) z.arrayOf(z.string())
D) z.string().array()
```

### Question 10
Quel modificateur ajoute une validation de longueur minimale?
```typescript
A) z.string().length(5)
B) z.string().minLength(5)
C) z.string().min(5)
D) z.string().minimum(5)
```

### Question 11
Comment générer un type TypeScript depuis un schéma Zod?
```typescript
A) type User = z.typeof<typeof userSchema>
B) type User = z.infer<typeof userSchema>
C) type User = z.type<typeof userSchema>
D) type User = typeof userSchema.type
```

### Question 12
Si `safeParse()` échoue, où se trouve l'erreur?
```typescript
A) result.error
B) result.errors
C) result.failure
D) result.exception
```

### Question 13
Comment valider un email avec Zod?
```typescript
A) z.string().email()
B) z.email()
C) z.string().isEmail()
D) z.string().format('email')
```

### Question 14
Que retourne `z.boolean().parse(true)`?
```typescript
A) "true"
B) 1
C) true
D) Boolean(true)
```

### Question 15
Comment combiner deux types possibles (union)?
```typescript
A) z.or([z.string(), z.number()])
B) z.union([z.string(), z.number()])
C) z.either(z.string(), z.number())
D) z.oneOf([z.string(), z.number()])
```

---

## PARTIE 2: NIVEAU INTERMÉDIAIRE (Questions 16-30)

### Question 16
Que fait la méthode `.partial()` sur un schéma?
```
A) Valide seulement une partie du schéma
B) Rend tous les champs optionnels
C) Sépare le schéma en deux parties
D) Supprime la moitié des champs
```

### Question 17
Comment transformer une valeur après validation?
```typescript
A) z.string().transform(val => val.toUpperCase())
B) z.string().map(val => val.toUpperCase())
C) z.string().convert(val => val.toUpperCase())
D) z.string().modify(val => val.toUpperCase())
```

### Question 18
Que fait `.pipe()` dans Zod?
```
A) Exécute plusieurs schémas en parallèle
B) Envoie le résultat à un autre schéma pour validation supplémentaire
C) Crée un pipeline de transformations
D) Connecte Zod à une base de données
```

### Question 19
Comment sélectionner certains champs d'un schéma existant?
```typescript
A) schema.select({ name: true })
B) schema.pick({ name: true })
C) schema.filter({ name: true })
D) schema.only({ name: true })
```

### Question 20
Quelle est la propriété correcte pour accéder aux erreurs de validation Zod?
```typescript
A) error.errors
B) error.issues
C) error.messages
D) error.validationErrors
```

### Question 21
Comment exclure certains champs d'un schéma?
```typescript
A) schema.omit({ password: true })
B) schema.exclude({ password: true })
C) schema.without({ password: true })
D) schema.remove({ password: true })
```

### Question 22
Dans une ZodError, que contient `issue.path`?
```
A) Le chemin du fichier
B) Le chemin vers le champ invalide (ex: ["user", "email"])
C) Le chemin HTTP de l'API
D) Le stacktrace de l'erreur
```

### Question 23
Comment ajouter des champs à un schéma existant?
```typescript
A) schema.extend({ email: z.string() })
B) schema.add({ email: z.string() })
C) schema.append({ email: z.string() })
D) schema.merge({ email: z.string() })
```

### Question 24
Que fait `.trim()` sur un schéma string?
```
A) Limite la longueur
B) Enlève les espaces avant/après
C) Supprime tous les espaces
D) Coupe après N caractères
```

### Question 25
Comment valider un nombre entier?
```typescript
A) z.number().integer()
B) z.number().int()
C) z.int()
D) A et B sont corrects
```

### Question 26
Comment créer une validation personnalisée?
```typescript
A) z.string().validate(val => val.length > 5)
B) z.string().custom(val => val.length > 5)
C) z.string().refine(val => val.length > 5)
D) z.string().check(val => val.length > 5)
```

### Question 27
Dans Next.js, que retourne `searchParams.get('page')` si le paramètre est absent?
```typescript
A) undefined
B) null
C) ""
D) 0
```

### Question 28
Comment créer un schéma qui accepte soit string soit number?
```typescript
A) z.string() || z.number()
B) z.union([z.string(), z.number()])
C) z.or(z.string(), z.number())
D) z.stringOrNumber()
```

### Question 29
Quelle méthode permet de garder les champs non définis dans le schéma?
```typescript
A) .passthrough()
B) .allowUnknown()
C) .keepExtra()
D) .preserveUnknown()
```

### Question 30
Comment valider un tableau avec un maximum de 10 éléments?
```typescript
A) z.array(z.string()).max(10)
B) z.array(z.string()).maxLength(10)
C) z.array(z.string()).limit(10)
D) z.array(z.string()).maximum(10)
```

---

## PARTIE 3: NIVEAU AVANCÉ (Questions 31-45)

### Question 31
Quelle est la différence principale entre Projet 1 et Projet 2?
```
A) La version de Zod utilisée
B) L'approche de validation (manuelle vs z.coerce)
C) Le langage (JavaScript vs TypeScript)
D) Le framework (Next.js 14 vs 15)
```

### Question 32
Que fait `z.coerce.number()`?
```
A) Force une erreur si ce n'est pas un nombre
B) Convertit automatiquement la valeur en nombre
C) Vérifie que c'est un nombre coercible
D) Crée un nombre aléatoire
```

### Question 33
Que retourne `Number(null)` en JavaScript?
```typescript
A) null
B) undefined
C) NaN
D) 0
```

### Question 34
Pourquoi `searchParams.get('page') ?? undefined` est nécessaire avec `.default()`?
```
A) Pour améliorer les performances
B) Parce que .default() s'applique à undefined, pas à null
C) Pour la compatibilité TypeScript
D) Ce n'est pas nécessaire
```

### Question 35
Dans Next.js 15, quel est le type de `params` dans les routes dynamiques?
```typescript
A) { id: string }
B) Promise<{ id: string }>
C) Params<{ id: string }>
D) AsyncParams<{ id: string }>
```

### Question 36
Comment accéder à l'ID dans une route Next.js 15?
```typescript
A) params.id
B) await params.id
C) const { id } = await params
D) params.get('id')
```

### Question 37
Dans le Projet 1, quelle propriété est utilisée (incorrectement) pour les erreurs Zod?
```typescript
A) error.errors
B) error.issues
C) error.validations
D) error.problems
```

### Question 38
Quel schéma du Projet 1 est le plus verbeux?
```
A) createArticleSchema
B) updateArticleSchema
C) paginationSchema
D) searchSchema
```

### Question 39
Que fait `.nullish()` dans Zod?
```
A) Accepte uniquement null
B) Accepte null ET undefined
C) Rejette null et undefined
D) Convertit en null
```

### Question 40
Combien de lignes économise le Projet 2 pour paginationSchema?
```
A) 2 lignes
B) 3 lignes
C) 5 lignes
D) 8 lignes
```

### Question 41
Que retourne `z.coerce.boolean().parse("false")`?
```typescript
A) false
B) true
C) "false"
D) undefined
```

### Question 42
Quelle méthode crypto est utilisée dans Projet 1 pour generateId()?
```typescript
A) crypto.randomUUID()
B) crypto.randomBytes()
C) crypto.getRandomValues()
D) Math.random()
```

### Question 43
Comment créer un discriminated union dans Zod?
```typescript
A) z.discriminated('type', [...])
B) z.discriminatedUnion('type', [...])
C) z.union.discriminated('type', [...])
D) z.tagged('type', [...])
```

### Question 44
Dans quel projet trouve-t-on le bug `success:false` pour une requête valide?
```
A) Projet 1
B) Projet 2
C) Les deux
D) Aucun
```

### Question 45
Quelle est la méthode sécurisée pour générer des IDs en production?
```typescript
A) Math.random().toString(36)
B) Date.now().toString()
C) crypto.randomBytes(16).toString('hex')
D) UUID.v4()
```

---

## PARTIE 4: QUESTIONS PRATIQUES (Questions 46-50)

### Question 46
Quel code est CORRECT pour valider les query params?
```typescript
// Option A
const result = schema.safeParse({
  page: searchParams.get('page')
})

// Option B
const result = schema.safeParse({
  page: searchParams.get('page') ?? undefined
})
```
```
A) Option A seulement
B) Option B seulement
C) Les deux sont corrects
D) Aucun n'est correct
```

### Question 47
Quel schéma accepte null pour un paramètre absent?
```typescript
// Option A
z.coerce.number().default(1)

// Option B
z.union([z.string(), z.null()])
  .transform(val => val ? parseInt(val) : 1)
  .pipe(z.number())

// Option C
z.string().optional().default("1")
```
```
A) Option A
B) Option B
C) Option C
D) Toutes les options
```

### Question 48
Comment transformer "tag1,tag2,tag3" en ["tag1", "tag2", "tag3"]?
```typescript
// Option A
z.string().split(',')

// Option B
z.string().transform(s => s.split(','))

// Option C
z.array(z.string())

// Option D
z.string().toArray(',')
```
```
A) Option A
B) Option B
C) Option C
D) Option D
```

### Question 49
Quelle approche est la plus moderne et concise?
```typescript
// Option A (Projet 1)
z.union([z.string(), z.null()])
  .optional()
  .transform(val => val ? parseInt(val, 10) || 1 : 1)
  .pipe(z.number().int().min(1))

// Option B (Projet 2)
z.coerce.number().int().min(1).default(1)
```
```
A) Option A
B) Option B
C) Les deux sont équivalentes
D) Aucune n'est recommandée
```

### Question 50
Dans quel ordre les méthodes Zod sont-elles appliquées?
```typescript
z.string()
  .trim()
  .transform(s => s.toLowerCase())
  .min(3)
```
```
A) min → trim → transform
B) trim → min → transform
C) trim → transform → min
D) transform → trim → min
```

---

# RÉPONSES

## PARTIE 1: NIVEAU DÉBUTANT

**Question 1: B** - `npm install zod`
- Zod s'installe simplement avec le package "zod"

**Question 2: C** - `import { z } from 'zod'`
- L'import standard et recommandé

**Question 3: B** - `parse()` lance une erreur, `safeParse()` retourne un objet résultat
- `parse()`: Lance une ZodError en cas d'échec
- `safeParse()`: Retourne `{ success: true, data }` ou `{ success: false, error }`

**Question 4: B** - `z.object({ name: z.string() })`
- La syntaxe standard pour créer un schéma d'objet

**Question 5: C** - `z.string()`
- Type primitif pour les chaînes de caractères

**Question 6: A** - `z.string().optional()`
- Rend le champ optionnel (peut être undefined)

**Question 7: B** - `z.string().default("test")`
- Définit une valeur par défaut si undefined

**Question 8: B** - `result.data`
- Les données validées sont dans la propriété `data`

**Question 9: B** - `z.array(z.string())`
- Syntaxe pour un tableau d'éléments

**Question 10: C** - `z.string().min(5)`
- Validation de longueur minimale pour strings

**Question 11: B** - `type User = z.infer<typeof userSchema>`
- Inférence de type TypeScript depuis un schéma Zod

**Question 12: A** - `result.error`
- L'objet ZodError est dans la propriété `error`

**Question 13: A** - `z.string().email()`
- Validation d'email intégrée

**Question 14: C** - `true`
- Parse retourne la valeur telle quelle si valide

**Question 15: B** - `z.union([z.string(), z.number()])`
- Union de plusieurs types possibles

---

## PARTIE 2: NIVEAU INTERMÉDIAIRE

**Question 16: B** - Rend tous les champs optionnels
- `.partial()` transforme tous les champs requis en optionnels

**Question 17: A** - `z.string().transform(val => val.toUpperCase())`
- `.transform()` permet de modifier la valeur après validation

**Question 18: B** - Envoie le résultat à un autre schéma pour validation supplémentaire
- `.pipe()` chaîne les validations en série

**Question 19: B** - `schema.pick({ name: true })`
- Sélectionne certains champs d'un schéma

**Question 20: B** - `error.issues`
- Les erreurs Zod sont stockées dans `issues`, pas `errors`

**Question 21: A** - `schema.omit({ password: true })`
- Exclut certains champs d'un schéma

**Question 22: B** - Le chemin vers le champ invalide
- Ex: `["user", "email"]` pour `user.email`

**Question 23: A** - `schema.extend({ email: z.string() })`
- Ajoute des champs à un schéma existant

**Question 24: B** - Enlève les espaces avant/après
- Trim supprime les whitespaces au début et à la fin

**Question 25: D** - A et B sont corrects
- `.integer()` et `.int()` sont des alias

**Question 26: C** - `z.string().refine(val => val.length > 5)`
- `.refine()` permet des validations personnalisées

**Question 27: B** - `null`
- `searchParams.get()` retourne `null` si absent (jamais `undefined`)

**Question 28: B** - `z.union([z.string(), z.number()])`
- Union pour accepter plusieurs types

**Question 29: A** - `.passthrough()`
- Garde les champs non définis dans le schéma

**Question 30: A** - `z.array(z.string()).max(10)`
- Limite le nombre d'éléments maximum

---

## PARTIE 3: NIVEAU AVANCÉ

**Question 31: B** - L'approche de validation (manuelle vs z.coerce)
- Projet 1: Transformations manuelles verbales
- Projet 2: Utilisation de z.coerce (moderne et concis)

**Question 32: B** - Convertit automatiquement la valeur en nombre
- `z.coerce` fait la conversion automatique

**Question 33: D** - `0`
- `Number(null)` retourne `0` (piège important!)

**Question 34: B** - Parce que `.default()` s'applique à undefined, pas à null
- `searchParams.get()` retourne `null`, donc `.default()` ne s'applique pas
- `?? undefined` convertit `null` en `undefined`

**Question 35: B** - `Promise<{ id: string }>`
- Dans Next.js 15, params est asynchrone

**Question 36: C** - `const { id } = await params`
- Il faut await params dans Next.js 15

**Question 37: A** - `error.errors` (incorrect)
- Le Projet 1 utilise `.errors` au lieu de `.issues`

**Question 38: C** - `paginationSchema`
- 8 lignes dans Projet 1 vs 3 lignes dans Projet 2

**Question 39: B** - Accepte null ET undefined
- `.nullish()` = `.nullable().optional()`

**Question 40: C** - 5 lignes
- Projet 1: 8 lignes, Projet 2: 3 lignes (économie de 5 lignes)

**Question 41: B** - `true`
- Toute string non vide devient `true` avec `z.coerce.boolean()`

**Question 42: B** - `crypto.randomBytes()`
- Méthode sécurisée pour générer des IDs

**Question 43: B** - `z.discriminatedUnion('type', [...])`
- Syntaxe pour les unions discriminées

**Question 44: B** - Projet 2
- Bug dans `/api/articles/search` (success:false au lieu de true)

**Question 45: C** - `crypto.randomBytes(16).toString('hex')`
- Méthode cryptographiquement sûre

---

## PARTIE 4: QUESTIONS PRATIQUES

**Question 46: B** - Option B seulement
- Avec `.default()`, il faut convertir `null` en `undefined`

**Question 47: B** - Option B
- Accepte explicitement `null` avec `z.union([z.string(), z.null()])`

**Question 48: B** - `z.string().transform(s => s.split(','))`
- Transformation pour split la string

**Question 49: B** - Option B (Projet 2)
- z.coerce est plus moderne, concis et idiomatique

**Question 50: C** - trim → transform → min
- Les méthodes sont appliquées dans l'ordre d'écriture
- D'abord validation/normalisation (trim), puis transformation, puis validation finale (min)

---

## Barème de Notation

- **45-50 points**: Expert Zod! Vous maîtrisez tous les concepts
- **35-44 points**: Niveau avancé - Quelques révisions recommandées
- **25-34 points**: Niveau intermédiaire - Continuez à pratiquer
- **15-24 points**: Niveau débutant - Relisez les documents
- **0-14 points**: Révisez les bases et refaites le quiz

---

## Points Clés à Retenir

### Top 10 des Erreurs à Éviter

1. **Utiliser `error.errors` au lieu de `error.issues`**
   ```typescript
   // ❌ FAUX
   error.errors.map(...)
   
   // ✅ CORRECT
   error.issues.map(...)
   ```

2. **Oublier `?? undefined` avec searchParams et .default()**
   ```typescript
   // ❌ FAUX (null → 0 → erreur)
   page: searchParams.get('page')
   
   // ✅ CORRECT
   page: searchParams.get('page') ?? undefined
   ```

3. **Ne pas await params dans Next.js 15**
   ```typescript
   // ❌ FAUX
   export async function GET(req, { params }) {
     const id = params.id
   }
   
   // ✅ CORRECT
   export async function GET(req, { params }: { params: Promise<{id:string}> }) {
     const { id } = await params
   }
   ```

4. **Confondre `.optional()` et `.nullable()`**
   ```typescript
   .optional()  // undefined autorisé
   .nullable()  // null autorisé
   .nullish()   // null ET undefined autorisés
   ```

5. **Utiliser z.coerce.boolean() avec des strings**
   ```typescript
   // ❌ PIÈGE: "false" devient true!
   z.coerce.boolean().parse("false") // true
   
   // ✅ MIEUX: transformation manuelle
   z.string().transform(v => v === 'true')
   ```

6. **Ne pas utiliser safeParse() dans les APIs**
   ```typescript
   // ❌ RISQUÉ
   const data = schema.parse(body) // Lance une erreur
   
   // ✅ SÛR
   const result = schema.safeParse(body)
   if (!result.success) { /* gérer l'erreur */ }
   ```

7. **Oublier que Number(null) = 0**
   ```javascript
   Number(null)      // 0 (pas NaN!)
   Number(undefined) // NaN
   Number("")        // 0
   ```

8. **Ne pas exporter les types inférés**
   ```typescript
   // ❌ Type dupliqué manuellement
   interface User {
     name: string
     age: number
   }
   
   // ✅ Type inféré
   const userSchema = z.object({
     name: z.string(),
     age: z.number()
   })
   type User = z.infer<typeof userSchema>
   ```

9. **Valider les params mais pas le body**
   ```typescript
   // ❌ INCOMPLET
   const body = await request.json()
   const article = create(body) // Pas validé!
   
   // ✅ COMPLET
   const body = await request.json()
   const result = schema.safeParse(body)
   if (!result.success) { return error }
   const article = create(result.data)
   ```

10. **Ne pas gérer les erreurs ZodError spécifiquement**
    ```typescript
    // ❌ GÉNÉRIQUE
    catch (error) {
      return { error: "Erreur" }
    }
    
    // ✅ SPÉCIFIQUE
    catch (error) {
      if (error instanceof ZodError) {
        return { errors: error.issues }
      }
      // Autres erreurs...
    }
    ```

---

## Ressources pour Approfondir

1. **Documentation officielle Zod**: https://zod.dev
2. **Next.js 15 - Async Params**: https://nextjs.org/blog/next-15
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Prochaines Étapes

Après ce quiz, vous devriez:

1. Relire les sections où vous avez fait des erreurs
2. Pratiquer avec des projets réels
3. Expérimenter avec z.coerce vs transformations manuelles
4. Migrer un projet Next.js 14 → 15
5. Créer vos propres schémas de validation complexes

Bon courage!

