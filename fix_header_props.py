import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the ProductListHeader props to include all required props
old_header = """                <ProductListHeader
                  sortOrder={sortOrder}
                  onSortChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={handleCategoryChange}
                />"""

new_header = """                <ProductListHeader
                  sortOrder={sortOrder}
                  onSortChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={handleCategoryChange}
                  searchTerm={searchTerm}
                  onSearchChange={(e) => setSearchTerm(e.target.value)}
                  muscleFilter={muscleFilter}
                  onMuscleFilterChange={(muscle) => setMuscleFilter(muscle)}
                />"""

content = content.replace(old_header, new_header)

# Write the corrected content
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed ProductListHeader props successfully!")
print("✅ Added searchTerm and onSearchChange")
print("✅ Added muscleFilter and onMuscleFilterChange")
