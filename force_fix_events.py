import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the end of the catalog view and insert the missing sections.
# The context is:
#               )}
#             </div>
#           </>
#         )}

# We want to change it to:
#               )}
#             </div> <!-- Close white card -->
#             </div> <!-- Close #catalog -->
#             <EventsSection ... />
#             <GallerySection ... />
#           </>
#         )}

# Let's try to match the end of the accessories block specifically to be safe.
pattern = r'(categoryFilter === \'Accesorios\' &&\s*\(\s*<>.*?)(</>\s*\)\s*</div>\s*</>\s*\)\})'

# Since regex across many lines can be tricky with dotall, let's look for the specific tail.
tail_pattern = r'(\s*\}\)\s*\n\s*</>\s*\n\s*\)\}\s*\n\s*</div>\s*\n\s*</>\s*\n\s*\)\})'

# Actually, let's just look for the string sequence from the view_file output
target = """                </>
              )}
            </div>
          </>
        )}"""

replacement = """                </>
              )}
            </div>
            </div>
            
            <EventsSection events={events} onOpenEventModal={handleOpenEventModal} isAdmin={isAdmin} onDeleteEvent={handleDeleteEvent} />
            <GallerySection images={galleryImages} isAdmin={isAdmin} onAddImage={handleAddGalleryImage} onDeleteImage={handleDeleteGalleryImage} />
          </>
        )}"""

if target in content:
    content = content.replace(target, replacement)
    print("✅ Replaced content successfully using exact string match")
else:
    # Try with normalized whitespace if exact match fails
    print("⚠️ Exact match failed, trying regex...")
    # This regex tries to match the structure flexibly
    regex = r'(\}\)\s*</>\s*\)\}\s*</div>\s*</>\s*\)\})'
    
    if re.search(regex, content, re.DOTALL):
        content = re.sub(regex, r'})\n                </>\n              )}\n            </div>\n            </div>\n            <EventsSection events={events} onOpenEventModal={handleOpenEventModal} isAdmin={isAdmin} onDeleteEvent={handleDeleteEvent} />\n            <GallerySection images={galleryImages} isAdmin={isAdmin} onAddImage={handleAddGalleryImage} onDeleteImage={handleDeleteGalleryImage} />\n          </>\n        )}', content, flags=re.DOTALL)
        print("✅ Replaced content successfully using regex")
    else:
        print("❌ Could not find target content")

# Write the corrected content
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
