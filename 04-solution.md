# Discussion d'analyse :


> **Diagnostic** — L’URL `/api/articles` échoue parce que, quand le paramètre est absent, `searchParams.get('page')` renvoie **`null`**. Ce `null` est ensuite passé à **`z.coerce.number()`**, qui le convertit en **`0`** (`Number(null) === 0`). La validation **`.min(1)`** échoue donc, ce qui provoque le **`VALIDATION_ERROR`**.
> Même cause potentielle pour `?page=1&limit=5` si d’autres paramètres non fournis (p. ex. `published`, `tags`) sont transmis tels quels en `null`.


# Réponse IA :


Tu as bien diagnostiqué : **`searchParams.get()` renvoie `null`** quand le param est absent, et **`z.coerce.number()` transforme `null` en `0`** (`Number(null) === 0`) → ça casse sur `.min(1)` → `VALIDATION_ERROR`.

Corrige soit **au point d’appel** (convertir `null` → `undefined`), soit **dans le schéma** (avec `z.preprocess`). Voici les deux options.

# Option A — Fix “au point d’appel” (le plus simple)

Ne passe **jamais** `null` à Zod. Utilise `?? undefined` pour chaque paramètre :

```ts
// Dans ton handler GET
const { searchParams } = new URL(req.url)

const rawPagination = {
  page: searchParams.get('page') ?? undefined,
  limit: searchParams.get('limit') ?? undefined,
}

const rawSearch = {
  q: searchParams.get('q') ?? undefined,
  published: searchParams.get('published') ?? undefined,
  tags: searchParams.get('tags') ?? undefined,
}

const paginationResult = paginationSchema.safeParse(rawPagination)
const searchResult = searchSchema.safeParse(rawSearch)
```

Avec **tes schémas actuels**, ça suffit pour que :

* `/api/articles` → `page=1`, `limit=10`
* `/api/articles?page=1&limit=5` → `page=1`, `limit=5`
* et pas de plantage lié à `null`.

# Option B — Blindage “dans le schéma” (plus robuste)

Encapsule la conversion `null | ""` → `undefined` **dans** le schéma avec `z.preprocess`, ainsi tu es protégé même si quelqu’un oublie `?? undefined` :

```ts
import { z } from 'zod'

const nullishEmptyToUndef = (v: unknown) =>
  v === null || v === '' ? undefined : v

export const paginationSchema = z.object({
  page: z.preprocess(
    nullishEmptyToUndef,               // <- convertit null/"" en undefined
    z.coerce.number().int().min(1).default(1)
  ),
  limit: z.preprocess(
    nullishEmptyToUndef,
    z.coerce.number().int().min(1).max(100).default(10)
  ),
})

export const searchSchema = z.object({
  q: z.preprocess(
    nullishEmptyToUndef,
    z.string().trim().min(1).optional()
  ),
  published: z.preprocess(
    nullishEmptyToUndef,
    z.coerce.boolean().optional()
  ),
  tags: z.preprocess(
    nullishEmptyToUndef,
    z.string()
      .transform(str =>
        str
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      )
      .optional()
  ),
})
```

> Remarque : `q` vide (`q=`) devient `undefined` grâce au `trim().min(1).optional()`.

# (Facultatif) Rendre “tolérant” aux valeurs pourries

Si tu veux éviter un 400 quand `page=abc` ou `limit=` et retomber sur des valeurs par défaut :

```ts
export const paginationSchema = z.object({
  page: z.preprocess(nullishEmptyToUndef,
    z.coerce.number().int().min(1).catch(1) // défaut si invalide/absent
  ),
  limit: z.preprocess(nullishEmptyToUndef,
    z.coerce.number().int().min(1).max(100).catch(10)
  ),
})
```

`.catch(x)` applique **x si la coercition/validation échoue**.

# Check rapide (devrait marcher après fix)

* `GET /api/articles` → `{ page:1, limit:10 }`
* `GET /api/articles?page=1&limit=5` → `{ page:1, limit:5 }`
* `GET /api/articles?q=transformers&published=true&tags=nlp,bert&page=2&limit=3` → OK
* `GET /api/articles?published=true` → OK (et `tags: []` si tu utilises la version “robuste”)

# Petit piège courant (à éviter)

Ne fais pas ceci :

```ts
paginationSchema.safeParse({
  page: searchParams.get('page'),  // <- string | null (dangereux)
  limit: searchParams.get('limit') // <- string | null
})
```

→ Passe toujours `?? undefined`, ou utilise `z.preprocess` comme montré.

Si ça échoue encore, envoie-moi le **log de `result.error.flatten()`** : on verra la clé et la valeur problématiques précisément.
