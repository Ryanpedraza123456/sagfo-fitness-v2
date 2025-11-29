## CORRECCIÓN NECESARIA EN App.tsx

**Problema**: El componente Hero tiene props incorrectas y falta el contenido del catálogo.

**Líneas a reemplazar**: 709-742

**Contenido actual (INCORRECTO)**:
```tsx
        {view === 'catalog' && (
          <>
            <Hero
              onCartClick={() => setIsCartOpen(true)}
              products={products}
              orders={orders}
              events={events}
              galleryImages={galleryImages}
              profiles={profiles}
              onEditProduct={handleEditProduct}
              onOpenCreateProductModal={handleOpenCreateProductModal}
              onEditHero={() => setIsEditHeroModalOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              whatsAppNumber={whatsAppNumber}
              onUpdateWhatsAppNumber={handleUpdateWhatsAppNumber}
              onSaveEvent={handleSaveEvent}
              onDeleteEvent={handleDeleteEvent}
              onOpenEventModal={handleOpenEventModal}
              onAddGalleryImage={handleAddGalleryImage}
              onDeleteGalleryImage={handleDeleteGalleryImage}
              refetchAll={refetchAll}
              onOpenUserModal={handleOpenUserModal}
              onDeleteProfile={handleDeleteProfile}
              displayByCategory={displayByCategory}
              onSetDisplayByCategory={handleSetDisplayByCategory}
              bankAccounts={bankAccounts}
              onAddBankAccount={handleAddBankAccount}
              onDeleteBankAccount={handleDeleteBankAccount}
              sealUrl={sealUrl}
              onUpdateSeal={handleUpdateSeal}
              onUpdateItemStatus={handleUpdateItemStatus}
              onAssignTransporter={handleAssignTransporter}
            />
        )}
```

**Contenido correcto (DEBE SER)**:
```tsx
        {view === 'catalog' && (
          <>
            <Hero
              onCartClick={() => setIsCartOpen(true)}
              slides={heroSlides}
              isAdmin={isAdmin}
              onEdit={() => { if (isAdmin) setIsEditHeroModalOpen(true); }}
              onPromosClick={() => navigateToView('promos')}
            />
            <div id="catalog" className="w-full px-1 md:px-4 py-8">
              <div className="w-full bg-white dark:bg-[#111] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-neutral-200/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-hidden p-4 sm:p-8 md:p-12 border border-neutral-200 dark:border-white/5 relative">
                <ProductListHeader
                  sortOrder={sortOrder}
                  onSortChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={handleCategoryChange}
                />
              </div>

              {categoryFilter === 'Maquinaria' && (
                <>
                  {machinery.length > 0 ? (
                    <ProductGrid
                      products={machinery}
                      onProductClick={handleProductClick}
                      onToggleCompare={handleToggleCompare}
                      comparisonList={comparisonList}
                      isAdmin={isAdmin}
                      onEditProduct={handleEditProduct}
                    />
                  ) : (
                    <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl mt-6">
                      <h2 className="text-2xl font-bold text-neutral-400">No hay maquinaria disponible.</h2>
                      <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                    </div>
                  )}
                </>
              )}

              {categoryFilter === 'Accesorios' && (
                <>
                  {accessories.length > 0 ? (
                    <ProductGrid
                      products={accessories}
                      onProductClick={handleProductClick}
                      onToggleCompare={handleToggleCompare}
                      comparisonList={comparisonList}
                      isAdmin={isAdmin}
                      onEditProduct={handleEditProduct}
                    />
                  ) : (
                    <div className="text-center py-20 bg-neutral-100 dark:bg-zinc-800 rounded-3xl mt-6">
                      <h2 className="text-2xl font-bold text-neutral-400">No hay accesorios disponibles.</h2>
                      <p className="mt-2 text-neutral-500">Vuelve pronto para ver nuestros productos.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'dashboard' && isAdmin && (
          <AdminDashboard
            products={products}
            orders={orders}
            events={events}
            galleryImages={galleryImages}
            profiles={profiles}
            onEditProduct={handleEditProduct}
            onOpenCreateProductModal={handleOpenCreateProductModal}
            onEditHero={() => setIsEditHeroModalOpen(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            whatsAppNumber={whatsAppNumber}
            onUpdateWhatsAppNumber={handleUpdateWhatsAppNumber}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenEventModal={handleOpenEventModal}
            onAddGalleryImage={handleAddGalleryImage}
            onDeleteGalleryImage={handleDeleteGalleryImage}
            onOpenUserModal={handleOpenUserModal}
            onDeleteProfile={handleDeleteProfile}
            displayByCategory={displayByCategory}
            onSetDisplayByCategory={handleSetDisplayByCategory}
            bankAccounts={bankAccounts}
            onAddBankAccount={handleAddBankAccount}
            onDeleteBankAccount={handleDeleteBankAccount}
            sealUrl={sealUrl}
            onUpdateSeal={handleUpdateSeal}
            onUpdateItemStatus={handleUpdateItemStatus}
            onAssignTransporter={handleAssignTransporter}
          />
        )}
```
