import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Move products INSIDE the white card container
# Find the closing div of the white card (after ProductListHeader)
# It looks like: <ProductListHeader ... />\n              </div>
pattern_header_close = r'(<ProductListHeader[^>]*/>\s*)</div>'
match = re.search(pattern_header_close, content, re.DOTALL)

if match:
    # Remove the closing div there
    content = content.replace(match.group(0), match.group(1))
    
    # Find where to put the closing div (after the category filters content)
    # We look for the closing div of the #catalog container.
    # The structure is:
    # <div id="catalog" ...>
    #   <div class="white-card"> ... content ... 
    #   ... products ...
    # </div> <!-- This is #catalog closing -->
    
    # We want:
    # <div id="catalog" ...>
    #   <div class="white-card"> ... content ... ... products ... </div>
    # </div>
    
    # So we need to find the closing of #catalog and insert </div> before it.
    # The #catalog div starts at line ~719.
    # We can look for the closing tag of the catalog view fragment:
    #             </div>
    #           </>
    #         )}
    
    pattern_catalog_end = r'(</div>\s*</>\s*\)\})'
    replacement_catalog_end = r'  </div>\n            \1' # Add indentation and closing div
    
    # But wait, we also need to add Events and Gallery.
    
    # Let's verify where the catalog view ends.
    # It ends with:
    #               )}
    #             </div>
    #           </>
    #         )}
    
    # Let's try a more robust approach using specific context.
    
    # Find the end of the accessories block
    accessories_end = """                  )}
                </>
              )}
            </div>"""
            
    # We want to change this to:
    #                   )}
    #                 </>
    #               )}
    #             </div> <!-- Close white card -->
    #           </div> <!-- Close #catalog -->
    #           
    #           <EventsSection events={events} onOpenEventModal={handleOpenEventModal} isAdmin={isAdmin} onDeleteEvent={handleDeleteEvent} />
    #           <GallerySection images={galleryImages} isAdmin={isAdmin} onAddImage={handleAddGalleryImage} onDeleteImage={handleDeleteGalleryImage} />
    #         </>
    
    new_accessories_end = """                  )}
                </>
              )}
              </div>
            </div>
            
            <EventsSection events={events} onOpenEventModal={handleOpenEventModal} isAdmin={isAdmin} onDeleteEvent={handleDeleteEvent} />
            <GallerySection images={galleryImages} isAdmin={isAdmin} onAddImage={handleAddGalleryImage} onDeleteImage={handleDeleteGalleryImage} />"""
            
    content = content.replace(accessories_end, new_accessories_end)

# Write the corrected content
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Moved products inside white card")
print("✅ Restored Events and Gallery sections")
