
import os

file_path = 'c:/Users/Donacion/Downloads/sagfo-fitness-catalog/App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Insert import after TransporterDashboard import
# Find the line with TransporterDashboard
insert_index = -1
for i, line in enumerate(lines):
    if "import TransporterDashboard" in line:
        insert_index = i + 1
        break

if insert_index != -1:
    lines.insert(insert_index, "import AdminDashboard from './components/AdminDashboard';\n")
    print(f"Inserted import at line {insert_index + 1}")
else:
    print("Could not find TransporterDashboard import")
    exit(1)

# Calculate start and end lines for deletion
# We want to delete from "interface AdminDashboardProps" to the end of "const AdminDashboard"
start_delete = -1
end_delete = -1

for i, line in enumerate(lines):
    if "interface AdminDashboardProps {" in line:
        start_delete = i
    if "const AdminDashboard: React.FC<AdminDashboardProps>" in line:
        # This is the start of the component, we need to find the matching closing brace
        # But we know from view_file that it ends at line 943 (original)
        # We can just look for the line that was originally 943.
        # However, since we inserted a line, we should rely on content or relative position?
        # Let's rely on the content we saw.
        pass

# Since we know the line numbers from view_file were 34 and 943 (1-based)
# And we inserted 1 line before them.
# The new line numbers are 35 and 944.
# Indices are 34 and 943.
# Let's verify the content at these indices to be safe.

# Original line 34 (index 33) is now index 34.
if "interface AdminDashboardProps" not in lines[34]:
    print(f"Error: Expected interface at index 34, found: {lines[34]}")
    # Search for it
    for i, line in enumerate(lines):
        if "interface AdminDashboardProps" in line:
            start_delete = i
            break
else:
    start_delete = 34

# Original line 943 (index 942) is now index 943.
# It should be "};"
# But "};" is common.
# Let's look for "const App: React.FC" which was at 946 (index 945).
# Now it should be at index 946.
if "const App: React.FC" not in lines[946]:
     print(f"Error: Expected App definition at index 946, found: {lines[946]}")
     # Search for it
     for i in range(len(lines)):
         if "const App: React.FC" in lines[i]:
             # The line BEFORE this (minus some empty lines) is the end of AdminDashboard.
             # In the original file:
             # 943: };
             # 944: 
             # 945: 
             # 946: const App...
             # So we want to delete up to the line before the empty lines before App?
             # Or just delete up to 943.
             
             # Let's just use the hardcoded indices if the check passes.
             pass

# Let's be safer: find the range dynamically.
start_index = -1
for i, line in enumerate(lines):
    if "interface AdminDashboardProps {" in line:
        start_index = i
        break

end_index = -1
for i in range(start_index, len(lines)):
    if "const App: React.FC" in lines[i]:
        end_index = i
        break

# We want to delete from start_index up to (but not including) end_index.
# But we want to keep the empty lines before App?
# Original:
# 943: };
# 944: 
# 945: 
# 946: const App...
# We want to delete 943.
# So we delete from start_index to end_index - 3?
# Let's check the lines before App.
# lines[end_index-1] is empty
# lines[end_index-2] is empty
# lines[end_index-3] is "};" (The end of AdminDashboard)
# So we want to delete up to end_index - 2 (exclusive) -> so up to end_index - 3 (inclusive).
# Actually, let's just delete everything from start_index to end_index, and then insert back a couple of newlines if we want spacing.

if start_index != -1 and end_index != -1:
    print(f"Deleting from {start_index} to {end_index}")
    del lines[start_index:end_index]
    # Insert some spacing
    lines.insert(start_index, "\n\n")
else:
    print("Could not find start or end of block")
    exit(1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Successfully refactored App.tsx")
