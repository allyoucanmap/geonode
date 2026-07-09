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

from django.test import SimpleTestCase

from geonode.client.extensions import _targets_app
from geonode.client.templatetags.vite import _import_map_specifiers, _SHARED_RUNTIME


class TargetsAppTests(SimpleTestCase):
    def test_no_apps_key_targets_all(self):
        self.assertTrue(_targets_app({"id": "x"}, "manage"))

    def test_empty_apps_targets_all(self):
        self.assertTrue(_targets_app({"id": "x", "apps": []}, "manage"))

    def test_listed_app_matches(self):
        self.assertTrue(_targets_app({"id": "x", "apps": ["manage"]}, "manage"))

    def test_unlisted_app_excluded(self):
        self.assertFalse(_targets_app({"id": "x", "apps": ["explore"]}, "manage"))

    def test_none_app_disables_filter(self):
        self.assertTrue(_targets_app({"id": "x", "apps": ["explore"]}, None))


class SharedRuntimeTests(SimpleTestCase):
    def test_import_map_covers_required_specifiers(self):
        specifiers = _import_map_specifiers()
        for required in ("react", "react-dom", "@tanstack/react-query", "@geonode/sdk"):
            self.assertIn(required, specifiers)

    def test_import_map_matches_shared_runtime(self):
        chunks = json.loads(Path(_SHARED_RUNTIME).read_text())["chunks"]
        expected = {s: chunk for chunk, specs in chunks.items() for s in specs}
        self.assertEqual(_import_map_specifiers(), expected)
