# *batterie d’URL à tester* pour  `GET /api/articles` (pagination + search)




# GET /api/articles — cas OK (200)

### Pagination simple

1. `http://localhost:3000/api/articles`
   → `page=1`, `limit=10`, `q=undefined`, `published=undefined`, `tags=[]`

2. `http://localhost:3000/api/articles?page=1&limit=5`
   → `page=1`, `limit=5`

3. `http://localhost:3000/api/articles?page=3&limit=20`
   → `page=3`, `limit=20`

### Search simple

4. `http://localhost:3000/api/articles?q=deep+learning`
   → `q="deep learning"`, `tags=[]`, `published=undefined`, `page=1`, `limit=10`

5. `http://localhost:3000/api/articles?published=true`
   → `published=true`, `tags=[]`, `page=1`, `limit=10`

6. `http://localhost:3000/api/articles?published=false`
   → `published=false`, `tags=[]`, `page=1`, `limit=10`

7. `http://localhost:3000/api/articles?tags=ai,ml,nextjs`
   → `tags=["ai","ml","nextjs"]`, `page=1`, `limit=10`

8. `http://localhost:3000/api/articles?tags= ai, ,  nlp , bert  `
   → `tags=["ai","nlp","bert"]`, `page=1`, `limit=10`

### Combinaisons utiles

9. `http://localhost:3000/api/articles?q=transformers&published=true&tags=nlp,bert&page=2&limit=6`
   → `q="transformers"`, `published=true`, `tags=["nlp","bert"]`, `page=2`, `limit=6`

10. `http://localhost:3000/api/articles?published=1&tags=security,devops&page=4`
    → `published=true` (coerce), `tags=["security","devops"]`, `page=4`, `limit=10`

11. `http://localhost:3000/api/articles?published=0&q=  `
    → `published=false`, `q` ignoré (vide), `tags=[]`, `page=1`, `limit=10`

12. `http://localhost:3000/api/articles?tags=`
    → `tags=[]`, `page=1`, `limit=10`

---

# GET /api/articles — cas qui devraient ÉCHOUER (400)

> Avec ton schéma actuel (sans `.catch(...)`), `z.coerce.number().int().min(1)` va **rejeter** `0`, `-5`, `""`, ou un texte non numérique.

13. `http://localhost:3000/api/articles?page=0`
    → **400 VALIDATION_ERROR** (page < 1)

14. `http://localhost:3000/api/articles?limit=0`
    → **400 VALIDATION_ERROR** (limit < 1)

15. `http://localhost:3000/api/articles?limit=101`
    → **400 VALIDATION_ERROR** (limit > 100)

16. `http://localhost:3000/api/articles?page=-2&limit=10`
    → **400 VALIDATION_ERROR**

17. `http://localhost:3000/api/articles?page=abc&limit=10`
    → **400 VALIDATION_ERROR** (coerce number échoue)

18. `http://localhost:3000/api/articles?limit=`
    → **400 VALIDATION_ERROR** (`limit=""` → coerce → 0 → min(1) échoue)

19. `http://localhost:3000/api/articles?published=banana`
    → **400 VALIDATION_ERROR** (coerce boolean échoue)

> Si tu veux que certains de ces cas “pourris” retombent sur les valeurs par défaut au lieu de 400, passe à l’approche avec `.catch(...)` ou `preprocess` qu’on a vue plus haut.

---

# Notes importantes pour éviter les faux négatifs

* Lorsque tu construis l’objet pour `safeParse`, pense à **convertir `null` → `undefined`** :

  ```ts
  const raw = {
    q: searchParams.get('q') ?? undefined,
    published: searchParams.get('published') ?? undefined,
    tags: searchParams.get('tags') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  }
  ```

  Sans ça, `default(1)`/`default(10)` ne s’appliquent pas correctement (et `null` peut être coercé en `0`).

* Si tu passes des clés non prévues par le schéma et que tu utilises `.strict()` quelque part, Zod renverra “Unrecognized key”. Dans ce cas, ajoute la clé au schéma, **ou** appelle `.strip()`.

---

# POST /api/articles — tester `createArticleSchema`

### 20) Cas OK (201 attendu côté route si tu crées l’article)

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first article",
    "content": "This is a long enough content with more than 10 chars.",
    "published": true,
    "tags": ["ai","ml"]
  }'
```

* `excerpt` est optionnel
* `published` par défaut est `false` si absent
* `tags` par défaut `[]` si absent

### 21) Cas INVALIDES (400 VALIDATION_ERROR)

* **Titre manquant**

  ```bash
  -d '{ "content": "content suffisant" }'
  ```
* **Content trop court**

  ```bash
  -d '{ "title": "Ok", "content": "short" }'
  ```
* **Trop de tags**

  ```bash
  -d '{ "title": "Ok", "content": "contenu valide", "tags": ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11"] }'
  ```
* **Tag vide**

  ```bash
  -d '{ "title": "Ok", "content": "contenu valide", "tags": ["ai", ""] }'
  ```

> Attends des `details` du type `{ path: "title", message: "...", ... }` grâce à ton `handleApiError`.

---

# (Optionnel) Tester `ApiError` personnalisées

Si, dans une route, tu fais :

```ts
import { createApiError, ErrorCodes } from "@/lib/errors"
throw createApiError(401, ErrorCodes.UNAUTHORIZED, "Missing token")
```

Tu dois obtenir :

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Missing token",
  "details": null
}
```

Idem pour un `FORBIDDEN` (403) :

```ts
throw createApiError(403, ErrorCodes.FORBIDDEN, "Only admins can create")
```

