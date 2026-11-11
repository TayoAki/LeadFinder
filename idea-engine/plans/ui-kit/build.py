"""Inline the shared shell into each app: <app>/ui/src.html -> <app>/ui/index.html (single self-contained file)."""
import sys, os
kit = os.path.dirname(os.path.abspath(__file__))
css = open(os.path.join(kit, 'shell.css')).read(); js = open(os.path.join(kit, 'shell.js')).read()
for app in sys.argv[1:]:
    src = open(os.path.join(app, 'ui', 'src.html')).read()
    out = src.replace('/*SHELL_CSS*/', css).replace('/*SHELL_JS*/', js)
    open(os.path.join(app, 'ui', 'index.html'), 'w').write(out)
    print('built', os.path.join(app, 'ui', 'index.html'))
