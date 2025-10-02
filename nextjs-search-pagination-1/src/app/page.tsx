export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            API Articles Next.js 15
          </h1>
          
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
            API REST complète pour la gestion d'articles avec validation Zod, gestion d'erreurs et pagination
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">🚀 Fonctionnalités</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>✅ CRUD complet des articles</li>
                <li>✅ Validation avec Zod</li>
                <li>✅ Gestion d'erreurs centralisée</li>
                <li>✅ Pagination et recherche</li>
                <li>✅ TypeScript strict</li>
                <li>✅ Stockage In-Memory</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">🛠️ Technologies</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Next.js 15 (App Router)</li>
                <li>• TypeScript</li>
                <li>• Zod (validation)</li>
                <li>• Tailwind CSS</li>
                <li>• API Routes</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">📚 Endpoints API</h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded font-mono text-sm">GET</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles</code>
                <span className="text-gray-600 dark:text-gray-400">- Lister les articles (avec pagination)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded font-mono text-sm">POST</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles</code>
                <span className="text-gray-600 dark:text-gray-400">- Créer un article</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded font-mono text-sm">GET</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles/[id]</code>
                <span className="text-gray-600 dark:text-gray-400">- Obtenir un article</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded font-mono text-sm">PUT</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles/[id]</code>
                <span className="text-gray-600 dark:text-gray-400">- Modifier un article</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded font-mono text-sm">DELETE</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles/[id]</code>
                <span className="text-gray-600 dark:text-gray-400">- Supprimer un article</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded font-mono text-sm">GET</span>
                <code className="text-gray-800 dark:text-gray-200">/api/articles/search</code>
                <span className="text-gray-600 dark:text-gray-400">- Recherche avancée</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Démarrez le serveur de développement pour tester l'API
            </p>
            <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded text-gray-800 dark:text-gray-200">
              npm run dev
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
