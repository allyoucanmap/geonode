#########################################################################
#
# Copyright (C) 2018 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################
import json
from pathlib import Path

from django import template
from django.conf import settings
from django.contrib.staticfiles import finders
from django.templatetags.static import static
from django.utils.safestring import mark_safe

from geonode import get_version
from geonode.client.extensions import get_client_extensions

register = template.Library()

_APP_DIR = Path(__file__).resolve().parent.parent
_SHARED_RUNTIME = _APP_DIR / "apps" / "shared-runtime.json"
_VENDOR_DIR = _APP_DIR / "static" / "client" / "vendor"
_DEFAULT_DEV_SERVER = "http://localhost:5173"


def _dev_server(app):
    servers = getattr(settings, "CLIENT_VITE_DEV_SERVERS", None) or {}
    if app in servers:
        return servers[app]
    if app == "manage":
        return getattr(settings, "MANAGE_VITE_DEV_SERVER", _DEFAULT_DEV_SERVER)
    return _DEFAULT_DEV_SERVER


def _client_dev(app=None):
    override = getattr(settings, "CLIENT_VITE_DEV", None)
    if isinstance(override, dict) and app in override:
        return bool(override[app])
    return settings.DEBUG


def _import_map_specifiers():
    with open(_SHARED_RUNTIME) as fh:
        chunks = json.load(fh)["chunks"]
    return {specifier: chunk for chunk, specifiers in chunks.items() for specifier in specifiers}


def _find_manifest(app):
    relative = f"{app}/.vite/manifest.json"
    found = finders.find(relative)
    if found:
        return found
    if settings.STATIC_ROOT:
        candidate = Path(settings.STATIC_ROOT) / app / ".vite" / "manifest.json"
        if candidate.exists():
            return str(candidate)
    return None


_manifest_cache = {}


def _load_manifest(app):
    if settings.DEBUG or app not in _manifest_cache:
        path = _find_manifest(app)
        if not path:
            raise RuntimeError(
                f"Client bundle for app '{app}' not found ({app}/.vite/manifest.json). Build it with "
                "`inv build-client` (or `cd geonode/client/apps && pnpm install && pnpm run build`)."
            )
        with open(path) as fh:
            _manifest_cache[app] = json.load(fh)
    return _manifest_cache[app]


def _dev_tags(app, entry):
    base = f"{_dev_server(app)}/static/{app}/"
    return mark_safe(
        "\n".join(
            [
                '<script type="module">',
                f'  import RefreshRuntime from "{base}@react-refresh"',
                "  RefreshRuntime.injectIntoGlobalHook(window)",
                "  window.$RefreshReg$ = () => {}",
                "  window.$RefreshSig$ = () => (type) => type",
                "  window.__vite_plugin_react_preamble_installed__ = true",
                "</script>",
                f'<script type="module" src="{base}@vite/client"></script>',
                f'<script type="module" src="{base}{entry}"></script>',
            ]
        )
    )


@register.simple_tag
def vite_asset(app, entry):
    if _client_dev(app):
        return _dev_tags(app, entry)
    chunk = _load_manifest(app)[entry]
    tags = [f'<script type="module" src="{static(f"{app}/" + chunk["file"])}"></script>']
    for css in chunk.get("css", []):
        tags.append(f'<link rel="stylesheet" href="{static(f"{app}/" + css)}">')
    return mark_safe("\n".join(tags))


@register.simple_tag
def vite_importmap(app=None):
    if _client_dev(app):
        return ""
    version = get_version()
    imports = {
        specifier: f'{static("client/vendor/" + chunk)}?v={version}'
        for specifier, chunk in _import_map_specifiers().items()
    }
    return mark_safe(f'<script type="importmap">{json.dumps({"imports": imports})}</script>')


@register.simple_tag
def vite_vendor_styles(app=None):
    if _client_dev(app):
        return ""
    version = get_version()
    links = [
        f'<link rel="stylesheet" href="{static("client/vendor/" + css.name)}?v={version}">'
        for css in sorted(_VENDOR_DIR.glob("*.css"))
    ]
    return mark_safe("\n".join(links))


@register.simple_tag
def client_extensions_json(app):
    return mark_safe(json.dumps(get_client_extensions(app=app)))
