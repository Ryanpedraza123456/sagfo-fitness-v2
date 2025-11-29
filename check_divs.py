
with open('App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

catalog_start = -1
catalog_end = -1

for i, line in enumerate(lines):
    if "view === 'catalog'" in line:
        catalog_start = i
    if "view === 'promos'" in line:
        catalog_end = i
        break

if catalog_start != -1 and catalog_end != -1:
    block = "".join(lines[catalog_start:catalog_end])
    open_divs = block.count("<div")
    close_divs = block.count("</div>")
    print(f"Open divs: {open_divs}")
    print(f"Close divs: {close_divs}")
    
    if open_divs != close_divs:
        print("❌ Div mismatch in catalog block!")
    else:
        print("✅ Divs are balanced.")
else:
    print("Could not find catalog block boundaries.")
