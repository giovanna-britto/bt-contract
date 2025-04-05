
from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader("templates"))

def render_template(nome_template: str, context: dict) -> str:
    template = env.get_template(nome_template)
    return template.render(context)
