# Cours Complet: Validation avec Zod dans Next.js
## Du Débutant à l'Avancé

---

## Table des Matières

### Niveau Débutant
1. [Introduction à Zod](#1-introduction-à-zod)
2. [Premiers Schémas](#2-premiers-schémas)
3. [Types de Base](#3-types-de-base)
4. [Validation Simple](#4-validation-simple)

### Niveau Intermédiaire
5. [Transformations](#5-transformations)
6. [Schémas Composés](#6-schémas-composés)
7. [Validation dans les API Routes](#7-validation-dans-les-api-routes)
8. [Gestion des Erreurs](#8-gestion-des-erreurs)

### Niveau Avancé
9. [z.coerce vs Transformations Manuelles](#9-zcoerce-vs-transformations-manuelles)
10. [Patterns Avancés](#10-patterns-avancés)
11. [Intégration Next.js 15](#11-intégration-nextjs-15)
12. [Optimisations et Bonnes Pratiques](#12-optimisations-et-bonnes-pratiques)

---

# NIVEAU DÉBUTANT

## 1. Introduction à Zod

### Qu'est-ce que Zod?

Zod est une bibliothèque TypeScript de validation de schémas. Elle permet de:
- Valider des données à l'exécution (runtime)
- Générer automatiquement des types TypeScript
- Créer des messages d'erreur personnalisés

### Installation

```bash
npm install zod
```

### Premier Exemple

```typescript
import { z } from 'zod'

// Définir un schéma
const userSchema = z.object({
  name: z.string(),
  age: z.number()
})

// Valider des données
const result = userSchema.parse({ name: "Alice", age: 25 })
// result = { name: "Alice", age: 25 }

// Si les données sont invalides, une erreur est lancée
userSchema.parse({ name: "Bob", age: "30" }) // Erreur!
```

---

## 2. Premiers Schémas

### Schéma Simple des Projets

Les deux projets utilisent le même schéma de base pour les articles:

```typescript
// Extrait des deux projets: src/lib/validation.ts
import { z } from 'zod'

export const createArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean()
})
```

### Comprendre z.object()

`z.object()` crée un schéma pour un objet JavaScript:

```typescript
// Schéma
const schema = z.object({
  name: z.string(),
  age: z.number()
})

// Données valides
schema.parse({ name: "Alice", age: 25 }) // OK

// Données invalides
schema.parse({ name: "Bob" }) // Erreur: age manquant
schema.parse({ name: "Bob", age: "30" }) // Erreur: age doit être un nombre
```

---

## 3. Types de Base

### Types Primitifs

```typescript
z.string()    // Chaîne de caractères
z.number()    // Nombre
z.boolean()   // Booléen
z.date()      // Date
z.null()      // null
z.undefined() // undefined
```

### Exemple des Projets

```typescript
// Extrait des projets: src/lib/validation.ts
export const createArticleSchema = z.object({
  title: z.string(),           // Type: string
  content: z.string(),         // Type: string
  published: z.boolean(),      // Type: boolean
  tags: z.array(z.string())   // Type: string[]
})
```

### Types Complexes

```typescript
// Tableau
z.array(z.string())              // string[]
z.array(z.number())              // number[]

// Union (ou)
z.union([z.string(), z.number()]) // string | number

// Optionnel
z.string().optional()             // string | undefined

// Nullable
z.string().nullable()             // string | null
```

---

## 4. Validation Simple

### Méthodes de Validation

Zod offre deux méthodes principales:

#### 1. parse() - Lance une erreur

```typescript
const schema = z.string()

try {
  const result = schema.parse("hello") // OK
  console.log(result) // "hello"
  
  schema.parse(123) // Lance une erreur!
} catch (error) {
  console.error("Validation échouée:", error)
}
```

#### 2. safeParse() - Retourne un résultat

```typescript
const schema = z.string()

// Succès
const result1 = schema.safeParse("hello")
if (result1.success) {
  console.log(result1.data) // "hello"
}

// Échec
const result2 = schema.safeParse(123)
if (!result2.success) {
  console.log(result2.error) // Objet ZodError
}
```

### Exemple des Projets

Les deux projets utilisent `safeParse()`:

```typescript
// Extrait des projets: src/app/api/articles/route.ts
export async function POST(request: NextRequest){
  try{
    const body = await request.json()
    
    // Validation avec safeParse
    const validationResult = createArticleSchema.safeParse(body)
    
    if(!validationResult.success){ 
      throw validationResult.error 
    }
    
    // Utiliser les données validées
    const article = articleStore.create(validationResult.data)
    return NextResponse.json({ success:true, data:article })
    
  }catch(error){
    return handleApiError(error)
  }
}
```

---

# NIVEAU INTERMÉDIAIRE

## 5. Transformations

### Qu'est-ce qu'une Transformation?

Une transformation modifie la valeur après validation:

```typescript
// Transformation simple
const trimmedString = z.string().transform(val => val.trim())

trimmedString.parse("  hello  ") // Résultat: "hello"
```

### Exemple du Projet 1: Transformation Manuelle

```typescript
// Projet 1: src/lib/validation.ts
export const paginationSchema = z.object({
  page: z.union([z.string(), z.null()])
    .optional()
    .transform(val => {
      // Transformer string en number
      if (!val) return 1
      const parsed = parseInt(val, 10)
      return parsed || 1
    })
    .pipe(z.number().int().min(1))
})
```

**Décomposition étape par étape:**

```typescript
// Étape 1: Accepter string ou null
z.union([z.string(), z.null()])

// Étape 2: Rendre optionnel (peut être undefined)
.optional()

// Étape 3: Transformer en nombre
.transform(val => {
  if (!val) return 1           // null/undefined → 1
  const parsed = parseInt(val, 10)
  return parsed || 1            // "abc" → NaN → 1
})

// Étape 4: Valider le résultat
.pipe(z.number().int().min(1))  // Doit être un entier >= 1
```

### Exemple d'Utilisation

```typescript
const schema = paginationSchema

// Scénarios possibles:
schema.parse({ page: "5" })      // Résultat: { page: 5 }
schema.parse({ page: null })     // Résultat: { page: 1 }
schema.parse({ page: undefined })// Résultat: { page: 1 }
schema.parse({ page: "abc" })    // Résultat: { page: 1 }
```

---

## 6. Schémas Composés

### Réutilisation de Schémas

Les deux projets démontrent la réutilisation:

```typescript
// Schéma de base pour création
export const createArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean()
})

// Schéma pour mise à jour (tous les champs optionnels)
export const updateArticleSchema = createArticleSchema.partial()
```

### Méthode .partial()

`.partial()` rend tous les champs optionnels:

```typescript
const schema = z.object({
  name: z.string(),
  age: z.number()
})

const partialSchema = schema.partial()

// Équivalent à:
z.object({
  name: z.string().optional(),
  age: z.number().optional()
})

// Validation
partialSchema.parse({ name: "Alice" })        // OK
partialSchema.parse({ age: 25 })              // OK
partialSchema.parse({ name: "Bob", age: 30 }) // OK
partialSchema.parse({})                       // OK
```

### Autres Méthodes Utiles

```typescript
// .pick() - Sélectionner certains champs
const nameOnly = schema.pick({ name: true })
// Équivalent: z.object({ name: z.string() })

// .omit() - Exclure certains champs
const withoutAge = schema.omit({ age: true })
// Équivalent: z.object({ name: z.string() })

// .extend() - Ajouter des champs
const extended = schema.extend({
  email: z.string().email()
})
// z.object({ name, age, email })
```

---

## 7. Validation dans les API Routes

### Structure Complète (des Projets)

```typescript
// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createArticleSchema } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'

export async function POST(request: NextRequest){
  try{
    // 1. Récupérer les données
    const body = await request.json()
    
    // 2. Valider avec Zod
    const validationResult = createArticleSchema.safeParse(body)
    
    // 3. Vérifier le résultat
    if(!validationResult.success){ 
      throw validationResult.error 
    }
    
    // 4. Utiliser les données validées
    const validatedData = validationResult.data
    // TypeScript connaît maintenant le type exact!
    
    // 5. Traiter la requête
    const article = articleStore.create(validatedData)
    
    // 6. Retourner la réponse
    return NextResponse.json({ 
      success: true, 
      data: article 
    }, { status: 201 })
    
  }catch(error){
    // 7. Gérer les erreurs
    return handleApiError(error)
  }
}
```

### Validation des Query Parameters

Les deux projets valident les paramètres d'URL:

```typescript
// src/app/api/articles/route.ts
export async function GET(request: NextRequest){
  const { searchParams } = new URL(request.url)
  
  // Récupérer les paramètres
  const rawParams = {
    page: searchParams.get('page'),     // string | null
    limit: searchParams.get('limit'),   // string | null
    q: searchParams.get('q')            // string | null
  }
  
  // Valider avec Zod
  const result = paginationSchema.safeParse(rawParams)
  
  if(!result.success){
    // Gérer l'erreur de validation
    return NextResponse.json({ 
      success: false, 
      error: result.error 
    }, { status: 400 })
  }
  
  // Utiliser les valeurs validées et transformées
  const { page, limit } = result.data
  // page et limit sont maintenant des numbers!
}
```

---

## 8. Gestion des Erreurs

### Structure d'une ZodError

Quand la validation échoue, Zod crée un objet `ZodError`:

```typescript
import { ZodError } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.number().min(18)
})

try {
  schema.parse({ name: 123, age: 15 })
} catch (error) {
  if (error instanceof ZodError) {
    console.log(error.issues)
    // [
    //   {
    //     code: "invalid_type",
    //     expected: "string",
    //     received: "number",
    //     path: ["name"],
    //     message: "Expected string, received number"
    //   },
    //   {
    //     code: "too_small",
    //     minimum: 18,
    //     path: ["age"],
    //     message: "Number must be greater than or equal to 18"
    //   }
    // ]
  }
}
```

### DIFFÉRENCE IMPORTANTE: error.issues vs error.errors

**Projet 1 - INCORRECT:**
```typescript
// src/lib/errors.ts (Projet 1)
if(error instanceof ZodError){
  return NextResponse.json({
    success: false,
    error: ErrorCodes.VALIDATION_ERROR,
    message: 'Données invalides',
    details: error.errors?.map(err => ({  // BUG: .errors n'existe pas
      path: err.path.join('.'), 
      message: err.message 
    })) || []
  }, { status: 400 })
}
```

**Projet 2 - CORRECT:**
```typescript
// src/lib/errors.ts (Projet 2)
if(error instanceof ZodError){
  return NextResponse.json({
    success: false,
    error: ErrorCodes.VALIDATION_ERROR,
    message: 'Données invalides',
    details: error.issues.map(err => ({   // CORRECT: .issues
      path: err.path.join('.'), 
      message: err.message 
    }))
  }, { status: 400 })
}
```

### Handler Complet des Erreurs

```typescript
// src/lib/errors.ts (Version optimale)
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown){
  console.error('API Error:', error)

  // 1. Erreur de validation Zod
  if(error instanceof ZodError){
    return NextResponse.json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Données invalides',
      details: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))
    }, { status: 400 })
  }

  // 2. Erreur API personnalisée
  if(error instanceof ApiError){
    return NextResponse.json({
      success: false,
      error: error.code,
      message: error.message,
      details: error.details
    }, { status: error.statusCode })
  }

  // 3. Erreur inconnue
  return NextResponse.json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Une erreur interne est survenue'
  }, { status: 500 })
}
```

---

# NIVEAU AVANCÉ

## 9. z.coerce vs Transformations Manuelles

### C'est LA DIFFÉRENCE MAJEURE entre les deux projets

### Qu'est-ce que z.coerce?

`z.coerce` convertit automatiquement les valeurs dans le type attendu:

```typescript
// Sans coerce
z.number().parse("42")  // Erreur! Attend un nombre, reçoit une string

// Avec coerce
z.coerce.number().parse("42")  // OK! Résultat: 42
```

### Projet 1: Approche Manuelle (Verbose)

```typescript
// src/lib/validation.ts (Projet 1)
export const paginationSchema = z.object({
  page: z.union([z.string(), z.null()])
    .optional()
    .transform(val => val ? parseInt(val, 10) || 1 : 1)
    .pipe(z.number().int().min(1)),
    
  limit: z.union([z.string(), z.null()])
    .optional()
    .transform(val => val ? parseInt(val, 10) || 10 : 10)
    .pipe(z.number().int().min(1).max(100))
})

// Nombre de lignes: 8
// Complexité: Élevée
// Lisibilité: Faible
```

### Projet 2: Approche Moderne (z.coerce)

```typescript
// src/lib/validation.ts (Projet 2)
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

// Nombre de lignes: 3
// Complexité: Faible
// Lisibilité: Excellente
```

### Comparaison Détaillée

**Réduction de 62% du code!**

| Aspect | Projet 1 (Manuel) | Projet 2 (z.coerce) |
|--------|-------------------|---------------------|
| Lignes de code | 8 | 3 |
| Caractères | ~350 | ~130 |
| Lisibilité | Difficile | Facile |
| Maintenance | Complexe | Simple |
| Risque d'erreur | Élevé | Faible |

### Comportement de z.coerce

#### z.coerce.number()

```typescript
const schema = z.coerce.number()

schema.parse(42)        // 42
schema.parse("42")      // 42
schema.parse("42.5")    // 42.5
schema.parse("abc")     // NaN (échoue si .int())
schema.parse(true)      // 1
schema.parse(false)     // 0
schema.parse(null)      // 0
schema.parse(undefined) // NaN
schema.parse("")        // 0
```

#### z.coerce.boolean()

```typescript
const schema = z.coerce.boolean()

schema.parse(true)      // true
schema.parse(false)     // false
schema.parse("true")    // true
schema.parse("false")   // true (toute string non-vide!)
schema.parse("1")       // true
schema.parse("0")       // true (attention!)
schema.parse(1)         // true
schema.parse(0)         // false
schema.parse("")        // false
schema.parse(null)      // false
schema.parse(undefined) // false
```

**ATTENTION:** `z.coerce.boolean()` a un comportement particulier avec les strings!

### Solution pour Boolean dans Query Params

```typescript
// Projet 1: Transformation manuelle (correcte)
published: z.union([z.string(), z.null()])
  .optional()
  .transform(val => val ? val === 'true' : undefined)

// Alternative avec coerce:
published: z.string()
  .optional()
  .transform(val => {
    if (val === 'true') return true
    if (val === 'false') return false
    return undefined
  })
```

### Quand Utiliser Quoi?

**Utilisez z.coerce quand:**
- Vous parsez des nombres depuis des query params
- Le comportement par défaut convient
- Vous voulez du code concis

**Utilisez .transform() quand:**
- Vous avez besoin de logique complexe
- Le comportement de coerce ne convient pas
- Vous parsez des booléens depuis des strings

---

## 10. Patterns Avancés

### Pattern 1: Validation Conditionnelle

```typescript
// Exemple: excerpt requis si published = true
const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  published: z.boolean()
}).refine(data => {
  // Si publié, excerpt doit être présent
  if (data.published && !data.excerpt) {
    return false
  }
  return true
}, {
  message: "L'extrait est requis pour les articles publiés",
  path: ["excerpt"]
})
```

### Pattern 2: Validation de Tableau avec Transformation

```typescript
// Projet 1 et 2: Transformation des tags
const searchSchema = z.object({
  tags: z.union([z.string(), z.null()])
    .optional()
    .transform(str => {
      // "tag1,tag2,tag3" → ["tag1", "tag2", "tag3"]
      if (!str?.trim()?.length) return undefined
      return str.split(',')
        .map(t => t.trim())
        .filter(Boolean)
    })
})

// Exemples:
searchSchema.parse({ tags: "react,nextjs" })
// Résultat: { tags: ["react", "nextjs"] }

searchSchema.parse({ tags: " react , nextjs , " })
// Résultat: { tags: ["react", "nextjs"] }

searchSchema.parse({ tags: null })
// Résultat: { tags: undefined }
```

### Pattern 3: Validation avec Messages Personnalisés

```typescript
// Extrait des projets
const createArticleSchema = z.object({
  title: z.string().trim()
    .min(1, 'Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  
  content: z.string()
    .min(10, 'Le contenu doit faire au moins 10 caractères')
    .max(50000, 'Le contenu ne peut pas dépasser 50000 caractères'),
  
  excerpt: z.string()
    .max(500, 'L\'extrait ne peut pas dépasser 500 caractères')
    .optional(),
  
  tags: z.array(z.string().trim().min(1))
    .max(10, 'Maximum 10 tags autorisés')
    .default([])
})
```

### Pattern 4: Chaînage de Transformations

```typescript
const schema = z.string()
  .trim()                        // 1. Enlever espaces
  .toLowerCase()                  // 2. Minuscules
  .transform(s => s.split('-'))  // 3. Split
  .pipe(z.array(z.string()))     // 4. Valider

schema.parse("  HELLO-WORLD  ")
// Résultat: ["hello", "world"]
```

### Pattern 5: Union avec Discriminant

```typescript
// Type discriminé pour différents types d'articles
const articleSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('blog'),
    title: z.string(),
    content: z.string(),
    author: z.string()
  }),
  z.object({
    type: z.literal('video'),
    title: z.string(),
    url: z.string().url(),
    duration: z.number()
  })
])

// Validation
articleSchema.parse({
  type: 'blog',
  title: 'Mon article',
  content: 'Contenu...',
  author: 'Alice'
}) // OK

articleSchema.parse({
  type: 'video',
  title: 'Ma vidéo',
  url: 'https://example.com',
  duration: 300
}) // OK
```

---

## 11. Intégration Next.js 15

### DIFFÉRENCE: Async Params

Next.js 15 introduit des paramètres de route asynchrones pour améliorer les performances.

### Projet 1: Next.js 15 Ready (CORRECT)

```typescript
// src/app/api/articles/[id]/route.ts (Projet 1)
export async function GET(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }  // Promise!
){
  try{
    // Doit await les params
    const { id } = await params
    
    const article = articleStore.findById(id)
    if(!article){ 
      throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') 
    }
    
    return NextResponse.json({ success: true, data: article })
  }catch(error){
    return handleApiError(error)
  }
}
```

### Projet 2: Style Next.js 14 (DEPRECATED)

```typescript
// src/app/api/articles/[id]/route.ts (Projet 2)
export async function GET(
  _req: NextRequest, 
  { params }: { params: { id: string } }  // Synchrone (ancien style)
){
  try{
    // Accès direct (pas de await)
    const article = articleStore.findById(params.id)
    if(!article){ 
      throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') 
    }
    
    return NextResponse.json({ success: true, data: article })
  }catch(error){
    return handleApiError(error)
  }
}
```

### Migration Next.js 14 → 15

**Avant (Next.js 14):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const articleId = params.id
  // ...
}
```

**Après (Next.js 15):**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ...
}
```

### Pourquoi ce Changement?

Next.js 15 rend les params asynchrones pour permettre:
1. Le streaming des réponses plus tôt
2. L'optimisation du rendu côté serveur
3. Une meilleure gestion de la concurrence

---

## 12. Optimisations et Bonnes Pratiques

### Pratique 1: Définir les Schémas Globalement

**BON:**
```typescript
// src/lib/validation.ts
export const articleSchema = z.object({
  title: z.string(),
  content: z.string()
})

// Utiliser partout
import { articleSchema } from '@/lib/validation'
```

**MAUVAIS:**
```typescript
// Redéfinir dans chaque fichier
function handler() {
  const schema = z.object({ ... }) // Redéfinition!
  // ...
}
```

### Pratique 2: Exporter les Types Inférés

```typescript
// src/lib/validation.ts
export const articleSchema = z.object({
  title: z.string(),
  content: z.string()
})

// Exporter le type TypeScript
export type Article = z.infer<typeof articleSchema>

// Utilisation ailleurs
import { Article } from '@/lib/validation'

function processArticle(article: Article) {
  // TypeScript connaît la structure!
}
```

### Pratique 3: Utiliser .default() pour Valeurs par Défaut

```typescript
// Les deux projets utilisent cette pratique
const schema = z.object({
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  page: z.coerce.number().default(1)
})

// Si le champ est absent, la valeur par défaut est utilisée
schema.parse({})
// Résultat: { published: false, tags: [], page: 1 }
```

### Pratique 4: Séparer Validation et Logique Métier

**BON:**
```typescript
// 1. Valider
const result = schema.safeParse(data)
if (!result.success) {
  return handleError(result.error)
}

// 2. Logique métier
const processedData = processBusinessLogic(result.data)

// 3. Persister
await save(processedData)
```

**MAUVAIS:**
```typescript
// Tout mélangé
const data = await request.json()
const processed = await processBusinessLogic(data) // Pas validé!
await save(processed)
```

### Pratique 5: Créer des Schémas Réutilisables

```typescript
// Composants de base
const idSchema = z.string().uuid()
const emailSchema = z.string().email()
const dateSchema = z.coerce.date()

// Schémas composés
const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  createdAt: dateSchema
})

const articleSchema = z.object({
  id: idSchema,
  authorId: idSchema,
  createdAt: dateSchema,
  title: z.string()
})
```

### Pratique 6: Validation en Couches

```typescript
// Couche 1: Validation de base (structure)
const baseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Couche 2: Validation métier
const registrationSchema = baseSchema.refine(
  async (data) => {
    const exists = await checkEmailExists(data.email)
    return !exists
  },
  { message: "Cet email est déjà utilisé" }
)
```

### Pratique 7: Gestion Centralisée des Erreurs

```typescript
// Créer un handler réutilisable (comme dans les projets)
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: 'VALIDATION_ERROR',
      details: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    }, { status: 400 })
  }

  // Autres types d'erreurs...
}

// Utiliser partout
try {
  // ...
} catch (error) {
  return handleApiError(error)
}
```

### Pratique 8: Performance avec .passthrough()

```typescript
// Par défaut, Zod enlève les champs non définis
const strict = z.object({ name: z.string() })
strict.parse({ name: "Alice", age: 25 })
// Résultat: { name: "Alice" } - age supprimé!

// Garder les champs supplémentaires
const passthrough = z.object({ name: z.string() }).passthrough()
passthrough.parse({ name: "Alice", age: 25 })
// Résultat: { name: "Alice", age: 25 }
```

---

## Comparaison Finale: Version Optimale

### Synthèse des Meilleures Pratiques

```typescript
// src/lib/validation.ts - VERSION OPTIMALE
import { z } from 'zod'

// 1. Schémas de base avec validation stricte
export const createArticleSchema = z.object({
  title: z.string().trim()
    .min(1, 'Le titre est requis')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  
  content: z.string()
    .min(10, 'Le contenu doit faire au moins 10 caractères')
    .max(50000, 'Le contenu ne peut pas dépasser 50000 caractères'),
  
  excerpt: z.string()
    .max(500, 'L\'extrait ne peut pas dépasser 500 caractères')
    .optional(),
  
  published: z.boolean().default(false),
  
  tags: z.array(z.string().trim().min(1))
    .max(10, 'Maximum 10 tags autorisés')
    .default([])
})

// 2. Schéma dérivé pour mise à jour
export const updateArticleSchema = createArticleSchema.partial()

// 3. Pagination avec z.coerce (moderne et concis)
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

// 4. Recherche avec transformations intelligentes
export const searchSchema = z.object({
  q: z.string().optional(),
  
  // Boolean: transformation manuelle (plus sûr que coerce)
  published: z.string()
    .optional()
    .transform(val => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),
  
  // Array: split et nettoyage
  tags: z.string()
    .optional()
    .transform(str => {
      if (!str?.trim()?.length) return []
      return str.split(',')
        .map(t => t.trim())
        .filter(Boolean)
    })
})

// 5. Exporter les types TypeScript
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
```

### Route API Complète (Next.js 15)

```typescript
// src/app/api/articles/route.ts - VERSION OPTIMALE
import { NextRequest, NextResponse } from 'next/server'
import { articleStore } from '@/lib/data'
import { 
  createArticleSchema, 
  paginationSchema, 
  searchSchema 
} from '@/lib/validation'
import { handleApiError, createApiError, ErrorCodes } from '@/lib/errors'

// GET avec pagination et recherche
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Valider pagination
    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit')
    })
    
    if (!paginationResult.success) {
      throw createApiError(
        400, 
        ErrorCodes.VALIDATION_ERROR, 
        'Paramètres de pagination invalides'
      )
    }

    // Valider recherche
    const searchResult = searchSchema.safeParse({
      q: searchParams.get('q'),
      published: searchParams.get('published'),
      tags: searchParams.get('tags')
    })
    
    if (!searchResult.success) {
      throw createApiError(
        400, 
        ErrorCodes.VALIDATION_ERROR, 
        'Paramètres de recherche invalides'
      )
    }

    // Extraire données validées
    const { page, limit } = paginationResult.data
    const { q: search, published, tags } = searchResult.data

    // Exécuter la requête
    const result = articleStore.paginate(page, limit, {
      search,
      published,
      tags: tags && tags.length ? tags : undefined
    })

    return NextResponse.json({ 
      success: true, 
      data: result.articles, 
      pagination: result.pagination 
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}

// POST pour créer un article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Valider avec safeParse
    const validationResult = createArticleSchema.safeParse(body)
    
    if (!validationResult.success) { 
      throw validationResult.error 
    }

    // Créer l'article avec données validées
    const article = articleStore.create(validationResult.data)
    
    return NextResponse.json({ 
      success: true, 
      data: article, 
      message: 'Article créé avec succès' 
    }, { status: 201 })
    
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Route Dynamique (Next.js 15)

```typescript
// src/app/api/articles/[id]/route.ts - VERSION OPTIMALE
import { NextRequest, NextResponse } from 'next/server'
import { articleStore } from '@/lib/data'
import { updateArticleSchema } from '@/lib/validation'
import { handleApiError, createApiError, ErrorCodes } from '@/lib/errors'

// GET un article par ID
export async function GET(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }  // Next.js 15
) {
  try {
    // Await params (Next.js 15)
    const { id } = await params
    
    const article = articleStore.findById(id)
    
    if (!article) { 
      throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') 
    }
    
    return NextResponse.json({ success: true, data: article })
    
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT pour mettre à jour
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Valider avec schéma partial
    const validationResult = updateArticleSchema.safeParse(body)
    
    if (!validationResult.success) { 
      throw validationResult.error 
    }

    const article = articleStore.update(id, validationResult.data)
    
    if (!article) { 
      throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') 
    }

    return NextResponse.json({ 
      success: true, 
      data: article, 
      message: 'Article mis à jour avec succès' 
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const deleted = articleStore.delete(id)
    
    if (!deleted) { 
      throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') 
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article supprimé avec succès' 
    })
    
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Handler d'Erreurs Complet

```typescript
// src/lib/errors.ts - VERSION OPTIMALE
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN'
} as const

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  // 1. Erreur Zod
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: ErrorCodes.VALIDATION_ERROR,
      message: 'Données invalides',
      // CORRECT: error.issues (pas error.errors)
      details: error.issues.map(err => ({ 
        path: err.path.join('.'), 
        message: err.message,
        code: err.code
      }))
    }, { status: 400 })
  }

  // 2. Erreur API personnalisée
  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      error: error.code,
      message: error.message,
      details: error.details
    }, { status: error.statusCode })
  }

  // 3. Erreur inconnue
  return NextResponse.json({
    success: false,
    error: ErrorCodes.INTERNAL_ERROR,
    message: 'Une erreur interne est survenue'
  }, { status: 500 })
}

export function createApiError(
  statusCode: number, 
  code: string, 
  message: string, 
  details?: unknown
) {
  return new ApiError(statusCode, code, message, details)
}
```

---

## Récapitulatif: Ce qu'on a Appris

### Niveau Débutant
- Installation et utilisation basique de Zod
- Définition de schémas simples avec z.object()
- Types primitifs (string, number, boolean)
- Validation avec parse() et safeParse()

### Niveau Intermédiaire
- Transformations avec .transform()
- Composition de schémas avec .partial(), .pick(), .omit()
- Intégration dans les API Routes Next.js
- Gestion des erreurs ZodError

### Niveau Avancé
- Différence z.coerce vs transformations manuelles
- Patterns avancés (refine, discriminatedUnion)
- Async params Next.js 15
- Optimisations et bonnes pratiques

### Points Clés des Projets

**Projet 1:**
- Approche manuelle et verbeuse
- Compatible Next.js 15 (async params)
- Génération ID sécurisée (crypto)
- Bug: error.errors au lieu de error.issues

**Projet 2:**
- Approche moderne avec z.coerce
- Code plus concis et lisible
- Meilleure documentation
- Bugs: success:false dans search, params synchrones

**Version Optimale:**
- z.coerce pour nombres (concis)
- .transform() pour booléens (précis)
- async params (Next.js 15)
- error.issues (correct)
- crypto.randomBytes (sécurisé)
- Documentation complète

---

## Exercices Pratiques

### Exercice 1: Créer un Schéma Utilisateur
```typescript
// Créez un schéma pour valider:
// - email (requis, format email)
// - password (requis, min 8 caractères)
// - age (optionnel, nombre >= 18)
// - role (optionnel, "admin" ou "user", défaut: "user")
```

### Exercice 2: Pagination Avancée
```typescript
// Créez un schéma qui:
// - Accepte page et limit depuis query params (strings)
// - Convertit en nombres
// - page: min 1, défaut 1
// - limit: entre 5 et 100, défaut 20
// - Ajoute un champ "offset" calculé: (page - 1) * limit
```

### Exercice 3: Validation de Fichier Upload
```typescript
// Créez un schéma pour valider:
// - filename (requis, pas d'espaces)
// - size (requis, nombre en bytes, max 5MB)
// - type (requis, "image/jpeg" ou "image/png")
```

### Exercice 4: Migration Projet 1 → Optimale
```typescript
// Prenez le paginationSchema du Projet 1
// Convertissez-le pour utiliser z.coerce
// Gardez la même fonctionnalité
```

### Solutions en Fin de Document

---

## Ressources Supplémentaires

- Documentation officielle Zod: https://zod.dev
- Next.js 15 Release Notes: https://nextjs.org/blog/next-15
- TypeScript Handbook: https://www.typescriptlang.org/docs/

---

## Conclusion

Vous avez maintenant une compréhension complète de:

1. Les fondamentaux de Zod
2. Les différences entre les approches manuelle et moderne
3. L'intégration avec Next.js (versions 14 et 15)
4. Les bonnes pratiques de validation
5. La gestion professionnelle des erreurs

Les deux projets ont des forces différentes. Le meilleur code combine:
- La concision de z.coerce (Projet 2)
- La compatibilité Next.js 15 (Projet 1)
- La documentation (Projet 2)
- La sécurité (Projet 1)

Continuez à pratiquer et n'hésitez pas à expérimenter!

