import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the promos view after the catalog view and before the dashboard view
old_section = """        {view === 'dashboard' && isAdmin && (
          <AdminDashboard"""

new_section = """        {view === 'promos' && (
          <>
            <div className="w-full px-1 md:px-4 py-8">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <button
                    onClick={() => navigateToView('catalog')}
                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver al Catálogo
                  </button>
                </div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Promociones Especiales</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">Aprovecha nuestras ofertas exclusivas</p>
                
                {promoProducts.length > 0 ? (
                  <ProductGrid
                    products={promoProducts}
                    onProductClick={handleProductClick}
                    onToggleCompare={handleToggleCompare}
                    comparisonList={comparisonList}
                    isAdmin={isAdmin}
                    onEditProduct={handleEditProduct}
                  />
                ) : (
                  <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl">
                    <h2 className="text-2xl font-bold text-neutral-400">No hay promociones activas por el momento.</h2>
                    <p className="mt-2 text-neutral-500">¡Vuelve pronto para ver nuestras ofertas!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'dashboard' && isAdmin && (
          <AdminDashboard"""

content = content.replace(old_section, new_section)

# Write the corrected content
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added promos view successfully!")
