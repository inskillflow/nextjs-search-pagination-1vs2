# Comprendre null vs undefined avec Zod et searchParams

## Le Problème

Pourquoi ce code fonctionne:
```typescript
const paginationResult = paginationSchema.safeParse({ 
  page: searchParams.get('page') ?? undefined, 
  limit: searchParams.get('limit') ?? undefined 
})
```

Mais pas celui-ci:
```typescript
const paginationResult = paginationSchema.safeParse({ 
  page: searchParams.get('page'), 
  limit: searchParams.get('limit') 
})
```

---

## Explication Détaillée

### 1. Que Retourne searchParams.get()?

```typescript
const searchParams = new URLSearchParams('?page=5&limit=10')

searchParams.get('page')    // "5" (string)
searchParams.get('limit')   // "10" (string)
searchParams.get('search')  // null (paramètre absent!)
```

**Point crucial:** `searchParams.get()` retourne:
- `string` si le paramètre existe
- `null` si le paramètre n'existe PAS

Il ne retourne **JAMAIS** `undefined`!

---

### 2. Comment Zod Traite null vs undefined

#### Comportement de .optional()

```typescript
const schema = z.string().optional()

// Accepte undefined
schema.parse(undefined) // OK

// N'accepte PAS null par défaut
schema.parse(null) // Erreur: Expected string, received null
```

**`.optional()`** = Le champ peut être `undefined`, PAS `null`!

#### Comportement de .default()

```typescript
const schema = z.string().default("défaut")

// Utilise la valeur par défaut avec undefined
schema.parse(undefined) // "défaut"

// NE traite PAS null comme absent!
schema.parse(null) // Erreur: Expected string, received null
```

**`.default()`** s'applique seulement à `undefined`, PAS à `null`!

---

### 3. Le Problème avec z.coerce

Prenons le schéma du Projet 2:

```typescript
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})
```

#### Scénario 1: SANS ?? undefined (NE FONCTIONNE PAS)

```typescript
// URL: /api/articles (pas de paramètre page)
const page = searchParams.get('page')
console.log(page) // null

// Valider
const result = paginationSchema.safeParse({ page: null })

// Que se passe-t-il?
// 1. z.coerce.number() convertit null
// 2. Number(null) = 0 en JavaScript!
// 3. .default(1) ne s'applique PAS car la valeur n'est pas undefined
// 4. Résultat: page = 0
// 5. .min(1) échoue! Erreur: Number must be greater than or equal to 1
```

**Démonstration JavaScript:**
```javascript
Number(null)      // 0
Number(undefined) // NaN
Number("")        // 0
Number("5")       // 5
```

#### Scénario 2: AVEC ?? undefined (FONCTIONNE)

```typescript
// URL: /api/articles (pas de paramètre page)
const page = searchParams.get('page') ?? undefined
console.log(page) // undefined (null converti!)

// Valider
const result = paginationSchema.safeParse({ page: undefined })

// Que se passe-t-il?
// 1. La valeur est undefined
// 2. .default(1) s'applique!
// 3. Résultat: page = 1
// 4. Validation réussie!
```

---

### 4. Comparaison Visuelle

```typescript
const schema = z.coerce.number().int().min(1).default(1)

// SANS ?? undefined
searchParams.get('page')           // null (si absent)
↓
z.coerce.number()                  // convertit null
↓
Number(null)                       // 0
↓
.min(1)                           // ÉCHEC! 0 < 1
↓
Erreur de validation


// AVEC ?? undefined
searchParams.get('page') ?? undefined  // undefined (si absent)
↓
.default(1)                           // s'applique!
↓
1                                     // valeur par défaut
↓
.min(1)                              // SUCCÈS! 1 >= 1
↓
Validation réussie
```

---

### 5. Pourquoi le Projet 1 N'a Pas Ce Problème

Regardons le schéma du Projet 1:

```typescript
const paginationSchema = z.object({
  page: z.union([z.string(), z.null()])  // Accepte explicitement null!
    .optional()
    .transform(val => val ? parseInt(val, 10) || 1 : 1)
    .pipe(z.number().int().min(1))
})
```

#### Avec Projet 1 (Fonctionne SANS ?? undefined)

```typescript
// URL: /api/articles (pas de paramètre page)
const page = searchParams.get('page')  // null

// Valider
const result = paginationSchema.safeParse({ page: null })

// Que se passe-t-il?
// 1. z.union([z.string(), z.null()]) accepte null ✓
// 2. .transform(val => val ? ... : 1) traite null comme falsy
// 3. Résultat: return 1
// 4. .pipe(z.number().int().min(1)) valide 1 ✓
// 5. Succès!
```

Le Projet 1 **accepte explicitement null** avec `z.union([z.string(), z.null()])`.

---

## Solutions

### Solution 1: Utiliser ?? undefined (Recommandé)

```typescript
const paginationResult = paginationSchema.safeParse({
  page: searchParams.get('page') ?? undefined,
  limit: searchParams.get('limit') ?? undefined
})
```

**Avantages:**
- Simple et direct
- Fonctionne avec z.coerce et .default()
- Clair sur l'intention

**Inconvénients:**
- Répétitif si beaucoup de paramètres

---

### Solution 2: Fonction Helper

```typescript
function getSearchParam(
  searchParams: URLSearchParams, 
  key: string
): string | undefined {
  return searchParams.get(key) ?? undefined
}

// Utilisation
const paginationResult = paginationSchema.safeParse({
  page: getSearchParam(searchParams, 'page'),
  limit: getSearchParam(searchParams, 'limit')
})
```

---

### Solution 3: Schéma Acceptant null

```typescript
const paginationSchema = z.object({
  page: z.union([z.string(), z.null()])
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).default(1)),
  
  limit: z.union([z.string(), z.null()])
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).max(100).default(10))
})

// Maintenant ça fonctionne sans ?? undefined
const result = paginationSchema.safeParse({
  page: searchParams.get('page'),  // null accepté
  limit: searchParams.get('limit')
})
```

---

### Solution 4: Schéma avec nullish()

```typescript
const paginationSchema = z.object({
  page: z.string()
    .nullish()  // Accepte string | null | undefined
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).default(1)),
  
  limit: z.string()
    .nullish()
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).max(100).default(10))
})
```

**`.nullish()`** = `.nullable().optional()` (accepte null ET undefined)

---

## Tableau Comparatif

| Modificateur | Accepte | Type TypeScript | Valeur par Défaut |
|--------------|---------|-----------------|-------------------|
| `.optional()` | `T \| undefined` | `T \| undefined` | undefined si absent |
| `.nullable()` | `T \| null` | `T \| null` | N/A |
| `.nullish()` | `T \| null \| undefined` | `T \| null \| undefined` | N/A |
| `.default(val)` | `T \| undefined` | `T` | val si undefined |

---

## Tests Complets

### Test 1: z.coerce avec null direct

```typescript
const schema = z.coerce.number().int().min(1).default(1)

// Cas 1: undefined → utilise default
console.log(schema.parse(undefined)) // 1 ✓

// Cas 2: null → converti en 0
try {
  console.log(schema.parse(null))
} catch (e) {
  console.log("Erreur:", e.message) // Number must be >= 1 ✗
}

// Cas 3: "5" → converti en 5
console.log(schema.parse("5")) // 5 ✓

// Cas 4: "" → converti en 0
try {
  console.log(schema.parse(""))
} catch (e) {
  console.log("Erreur:", e.message) // Number must be >= 1 ✗
}
```

### Test 2: Avec ?? undefined

```typescript
const schema = z.coerce.number().int().min(1).default(1)

// Simuler searchParams.get() qui retourne null
const getValue = (key: string) => null

// SANS ?? undefined
try {
  schema.parse(getValue('page')) // null → 0 → Erreur ✗
} catch (e) {
  console.log("Échec sans ??")
}

// AVEC ?? undefined
console.log(schema.parse(getValue('page') ?? undefined)) // 1 ✓
```

### Test 3: Union avec null

```typescript
const schema = z.union([z.string(), z.null()])
  .transform(val => val ?? undefined)
  .pipe(z.coerce.number().int().min(1).default(1))

// Fonctionne avec null direct
console.log(schema.parse(null))      // 1 ✓
console.log(schema.parse(undefined)) // 1 ✓
console.log(schema.parse("5"))       // 5 ✓
```

---

## Recommandation pour les Projets

### Pour Projet 2 (z.coerce)

**Option A: Ajouter ?? undefined partout (Simple)**

```typescript
// src/app/api/articles/route.ts
const paginationResult = paginationSchema.safeParse({
  page: searchParams.get('page') ?? undefined,
  limit: searchParams.get('limit') ?? undefined
})

const searchResult = searchSchema.safeParse({
  q: searchParams.get('q') ?? undefined,
  published: searchParams.get('published') ?? undefined,
  tags: searchParams.get('tags') ?? undefined
})
```

**Option B: Modifier le schéma (Réutilisable)**

```typescript
// src/lib/validation.ts
const paginationSchema = z.object({
  page: z.string()
    .nullish()
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).default(1)),
  
  limit: z.string()
    .nullish()
    .transform(val => val ?? undefined)
    .pipe(z.coerce.number().int().min(1).max(100).default(10))
})

// Maintenant fonctionne sans ?? undefined
const result = paginationSchema.safeParse({
  page: searchParams.get('page'),
  limit: searchParams.get('limit')
})
```

---

## Résumé

### Le Problème en 3 Points

1. **searchParams.get()** retourne `null` si le paramètre est absent (jamais `undefined`)

2. **z.coerce.number()** convertit `null` en `0` (pas en NaN)
   ```javascript
   Number(null) // 0
   ```

3. **.default()** s'applique seulement à `undefined`, PAS à `null`
   ```typescript
   z.coerce.number().default(1).parse(null)      // 0 (pas 1!)
   z.coerce.number().default(1).parse(undefined) // 1 ✓
   ```

### La Solution

Convertir `null` en `undefined` avec `?? undefined`:

```typescript
searchParams.get('page') ?? undefined
```

Ou accepter `null` explicitement dans le schéma:

```typescript
z.string().nullish().transform(val => val ?? undefined)
```

---

## Piège Bonus: Boolean avec coerce

Le même problème existe avec les booléens:

```typescript
const schema = z.coerce.boolean().default(false)

// null → false (pas le default!)
console.log(schema.parse(null))      // false
console.log(schema.parse(undefined)) // false (via default)

// Mais on ne peut pas différencier!
// Solution: transformer null en undefined avant
```

**Mieux vaut utiliser une transformation manuelle pour les booléens:**

```typescript
const schema = z.string()
  .nullish()
  .transform(val => {
    if (val === 'true') return true
    if (val === 'false') return false
    return undefined
  })
```

---

## Conclusion

Le comportement de `searchParams.get()` qui retourne `null` (et non `undefined`) est une source fréquente de bugs avec Zod, surtout avec `.default()` et `z.coerce`.

**Règle d'or:** Toujours convertir `null` en `undefined` quand on utilise `.default()`:

```typescript
searchParams.get('param') ?? undefined
```

Ou accepter explicitement `null` dans votre schéma avec `.nullish()` et le transformer.

