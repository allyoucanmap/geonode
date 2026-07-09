#########################################################################
#
# Copyright (C) 2026 OSGeo
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
import logging
from importlib import import_module

from django.apps import apps
from django.conf import settings
from django.templatetags.static import static
from django.utils.module_loading import module_has_submodule

logger = logging.getLogger(__name__)

CLIENT_MODULE = "client"

def _resolve_manifest(obj):
    manifest = obj() if callable(obj) else obj
    if not isinstance(manifest, dict) or "id" not in manifest:
        return None
    return manifest


def _descriptor(manifest):
    if settings.DEBUG and manifest.get("dev"):
        url = manifest["dev"]
    elif manifest.get("static"):
        url = static(manifest["static"])
    else:
        return None
    descriptor = {"id": manifest["id"], "url": url}
    if manifest.get("sdk_range"):
        descriptor["sdkRange"] = manifest["sdk_range"]
    return descriptor


def _targets_app(manifest, app):
    if app is None:
        return True
    targeted = manifest.get("apps")
    return not targeted or app in targeted


def _iter_manifests():
    for app_config in apps.get_app_configs():
        if not module_has_submodule(app_config.module, CLIENT_MODULE):
            continue
        try:
            module = import_module(f"{app_config.name}.{CLIENT_MODULE}")
        except Exception:
            logger.warning("skipping client extension in %r (import failed)", app_config.name, exc_info=True)
            continue
        manifest = getattr(module, "manifest", None)
        if manifest is not None:
            yield app_config.name, manifest


def _discover(app):
    descriptors = {}
    for name, raw in _iter_manifests():
        try:
            manifest = _resolve_manifest(raw)
            if not manifest or not _targets_app(manifest, app):
                continue
            descriptor = _descriptor(manifest)
            if descriptor:
                descriptors[descriptor["id"]] = descriptor
        except Exception:
            logger.warning("skipping client extension in %r", name, exc_info=True)
    return [descriptors[key] for key in sorted(descriptors)]


_CACHE = {}


def get_client_extensions(app=None):
    if settings.DEBUG:
        return _discover(app)
    if app not in _CACHE:
        _CACHE[app] = _discover(app)
    return _CACHE[app]
