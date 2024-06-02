from flask import Flask
from routes import setup_routes
app = Flask(__name__)
setup_routes(app)
if __name__ == '__main__':
    from dotenv import load_dotenv
    import os
    load_dotenv()
    debug_mode = os.getenv('DEBUG', 'False').lower() in ['true', '1', 't']
    app.run(debug=debug_mode)