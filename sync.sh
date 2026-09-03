#!/bin/bash
# Pull the three shared timing tools from the iOS project folder into the web app,
# adding the web shell includes. Run this after editing any of:
#   countdown.html / adverse.html / support.html
# then redeploy the web/ folder.
set -e
cd "$(dirname "$0")"
SRC="../BTCC countdown"

for f in countdown.html adverse.html support.html; do
  cp "$SRC/$f" "$f"
done

python3 - <<'EOF'
HEAD_ADD = (
'<meta name="apple-mobile-web-app-title" content="BTCC Startline">\n'
'<link rel="manifest" href="manifest.webmanifest">\n'
'<link rel="apple-touch-icon" href="img/icon-180.png">\n'
'<link rel="stylesheet" href="nav.css">\n'
)
for fn, tool in {"countdown.html":"countdown","adverse.html":"adverse","support.html":"support"}.items():
    s = open(fn, encoding="utf-8").read()
    s = s.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">')
    if "nav.css" not in s:
        s = s.replace("</head>", HEAD_ADD + "</head>", 1)
    if 'data-tool=' not in s:
        s = s.replace("<body>", f'<body data-tool="{tool}">', 1)
    if "nav.js" not in s:
        s = s.replace("</body>", '<script src="nav.js"></script>\n</body>', 1)
    open(fn, "w", encoding="utf-8").write(s)
    print("synced", fn)
EOF

# bump the service-worker cache version so installed clients pick up the change
python3 - <<'EOF'
import re
p = "sw.js"
s = open(p).read()
m = re.search(r"btcc-startline-v(\d+)", s)
n = int(m.group(1)) + 1
s = re.sub(r"btcc-startline-v\d+", f"btcc-startline-v{n}", s)
open(p, "w").write(s)
print("sw cache -> v%d" % n)
EOF
