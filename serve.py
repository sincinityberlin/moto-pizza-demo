import functools
import http.server
import os
import socketserver

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
PORT = 8843

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    httpd.serve_forever()
