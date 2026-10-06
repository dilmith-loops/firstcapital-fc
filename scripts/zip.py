import os
import zipfile

with zipfile.ZipFile('firstcapitalpages.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('firstcapitalpages'):
        for f in files:
            full = os.path.join(root, f)
            arc = os.path.relpath(full, 'firstcapitalpages').replace(os.sep, '/')
            z.write(full, arc)

print('Updated firstcapitalpages.zip successfully with Linux-compatible forward slashes!')
