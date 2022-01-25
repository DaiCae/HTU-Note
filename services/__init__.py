
from .note import bp_note
from .reg import bp_reg

def init_app(app):
    app.register_blueprint(bp_note)
    app.register_blueprint(bp_reg)

