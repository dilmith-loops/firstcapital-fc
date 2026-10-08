import os
import zipfile

EXCLUDE_DIRS = {
    ".git",
    ".lovable",
    "node_modules",
    "scratch",
    ".output",
    ".tanstack",
    ".wrangler",
    ".vscode",
    ".idea"
}

EXCLUDE_FILES = {
    ".gitignore",
    ".DS_Store"
}

def should_skip(path_parts, filename):
    for part in path_parts:
        if part in EXCLUDE_DIRS:
            return True
        if part.startswith(".git"):
            return True
        if "lovable" in part.lower():
            return True
    if filename in EXCLUDE_FILES:
        return True
    if filename.startswith(".git"):
        return True
    if filename.endswith(".zip") or filename.endswith(".log"):
        return True
    return False

# 1. Production zip (firstcapitalpages)
prod_zip = 'firstcapital-production.zip'
print(f"Creating {prod_zip}...")
with zipfile.ZipFile(prod_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('firstcapitalpages'):
        rel_root = os.path.relpath(root, 'firstcapitalpages')
        parts = rel_root.split(os.sep) if rel_root != '.' else []
        dirs[:] = [d for d in dirs if not should_skip(parts + [d], d)]
        for f in files:
            if should_skip(parts, f):
                continue
            full = os.path.join(root, f)
            arc = os.path.relpath(full, 'firstcapitalpages').replace(os.sep, '/')
            z.write(full, arc)

# 2. Clean Project zip (source + build)
clean_zip = 'firstcapital-clean-project.zip'
print(f"Creating {clean_zip}...")
with zipfile.ZipFile(clean_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('.'):
        rel_root = os.path.relpath(root, '.')
        parts = rel_root.split(os.sep) if rel_root != '.' else []
        dirs[:] = [d for d in dirs if not should_skip(parts + [d], d)]
        for f in files:
            if should_skip(parts, f):
                continue
            full = os.path.join(root, f)
            arc = os.path.relpath(full, '.').replace(os.sep, '/')
            z.write(full, arc)

print(f"Successfully generated {prod_zip} ({os.path.getsize(prod_zip) // 1024} KB)")
print(f"Successfully generated {clean_zip} ({os.path.getsize(clean_zip) // 1024} KB)")
