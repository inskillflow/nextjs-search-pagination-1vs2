# API Articles Next.js 15

API REST complète pour la gestion d'articles développée avec Next.js 15, TypeScript et l'App Router.

## 🚀 Fonctionnalités

- ✅ **CRUD complet** - Créer, lire, modifier et supprimer des articles
- ✅ **Validation Zod** - Validation stricte des données avec messages d'erreur en français
- ✅ **Gestion d'erreurs centralisée** - Système de gestion d'erreurs cohérent
- ✅ **Pagination** - Navigation efficace dans de grandes collections
- ✅ **Recherche avancée** - Recherche par titre, contenu et tags
- ✅ **TypeScript strict** - Typage complet pour une meilleure fiabilité
- ✅ **Stockage In-Memory** - Données persistantes durant la session
- ✅ **Middleware CORS** - Support pour les requêtes cross-origin
- ✅ **Interface moderne** - Page d'accueil avec documentation

## 🛠️ Technologies

- **Next.js 15** (App Router)
- **TypeScript**
- **Zod** (validation des schémas)
- **Tailwind CSS**
- **API Routes**

## 📁 Structure du projet

```
src/
├── app/
│   ├── api/
│   │   └── articles/
│   │       ├── route.ts           # GET, POST
│   │       ├── [id]/
│   │       │   └── route.ts       # GET, PUT, DELETE par ID
│   │       └── search/
│   │           └── route.ts       # Recherche avancée
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── data.ts                    # Stockage In-Memory
│   ├── utils.ts                   # Utilitaires (UUID, dates)
│   ├── validation.ts              # Schémas Zod
│   └── errors.ts                  # Gestion d'erreurs
├── types/
│   ├── article.ts                 # Types métier
│   └── api.ts                     # Types API
└── middleware.ts                  # Middleware global
```

## 🚀 Installation et démarrage

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Accéder à l'application**
   - Interface : http://localhost:3000
   - API : http://localhost:3000/api/articles

## 📚 Endpoints API

### Articles principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/articles` | Lister les articles (avec pagination) |
| `POST` | `/api/articles` | Créer un nouvel article |
| `GET` | `/api/articles/[id]` | Obtenir un article par ID |
| `PUT` | `/api/articles/[id]` | Modifier un article |
| `DELETE` | `/api/articles/[id]` | Supprimer un article |
| `GET` | `/api/articles/search` | Recherche avancée |

### Paramètres de requête

#### Pagination (GET /api/articles)
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 100)

#### Filtres (GET /api/articles)
- `published` - Filtrer par statut (true/false)
- `tags` - Filtrer par tags (séparés par des virgules)
- `q` - Recherche textuelle

#### Recherche (GET /api/articles/search)
- `q` - Terme de recherche (minimum 2 caractères)

## 🔧 Exemples d'utilisation

### Lister les articles avec pagination
```bash
curl "http://localhost:3000/api/articles?page=1&limit=5"
```

### Créer un article
```bash
curl -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon premier article",
    "content": "Contenu de l'article avec au moins 10 caractères...",
    "published": true,
    "tags": ["nextjs", "api"]
  }'
```

### Rechercher des articles
```bash
curl "http://localhost:3000/api/articles/search?q=Next.js"
```

### Filtrer par statut et tags
```bash
curl "http://localhost:3000/api/articles?published=true&tags=nextjs,react"
```

### Modifier un article
```bash
curl -X PUT "http://localhost:3000/api/articles/[ID]" \
  -H "Content-Type: application/json" \
  -d '{"title": "Titre modifié"}'
```

### Supprimer un article
```bash
curl -X DELETE "http://localhost:3000/api/articles/[ID]"
```

## 📊 Format des réponses

### Réponse de succès
```json
{
  "success": true,
  "data": { /* données */ },
  "message": "Message optionnel",
  "pagination": { /* info pagination si applicable */ }
}
```

### Réponse d'erreur
```json
{
  "success": false,
  "error": "CODE_ERREUR",
  "message": "Description de l'erreur",
  "details": { /* détails optionnels */ }
}
```

## 🏗️ Schéma des données

### Article
```typescript
interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  published: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Création d'article
```typescript
interface CreateArticleDto {
  title: string           // 1-255 caractères
  content: string         // 10-50000 caractères
  excerpt?: string        // max 500 caractères
  published?: boolean     // défaut: false
  tags?: string[]         // max 10 tags
}
```

## ✅ Validation

Le projet utilise Zod pour la validation avec messages d'erreur en français :

- **Titre** : requis, 1-255 caractères
- **Contenu** : requis, 10-50000 caractères
- **Extrait** : optionnel, max 500 caractères
- **Publié** : booléen, défaut false
- **Tags** : tableau de chaînes, max 10 éléments

## 🔐 Gestion d'erreurs

Codes d'erreur standardisés :
- `VALIDATION_ERROR` (400) - Données invalides
- `NOT_FOUND` (404) - Ressource non trouvée
- `INTERNAL_ERROR` (500) - Erreur serveur

## 🚦 Prochaines étapes

Cette structure est prête pour :
- Migration vers PostgreSQL avec Prisma
- Authentification et autorisation
- Cache Redis
- Tests automatisés
- Déploiement en production

## 📝 Licence

Ce projet est développé à des fins éducatives.