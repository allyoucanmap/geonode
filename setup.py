#########################################################################
#
# Copyright (C) 2016 OSGeo
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
from setuptools import setup
from setuptools.command.build_py import build_py
from setuptools.command.sdist import sdist

import os
import shutil
import subprocess
import sys

current_directory = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_directory)

# Bake the client bundle into the sdist/wheel.
CLIENT_BUILD_SCRIPT = os.path.join(current_directory, "geonode", "client", "apps", "build.py")
CLIENT_MANIFEST = os.path.join(
    current_directory, "geonode", "client", "static", "manage", ".vite", "manifest.json"
)


def _ensure_client_build():
    if os.path.exists(CLIENT_MANIFEST) or not os.path.exists(CLIENT_BUILD_SCRIPT):
        return
    result = subprocess.run([sys.executable, CLIENT_BUILD_SCRIPT])
    if not result.returncode:
        return
    if shutil.which("pnpm") or shutil.which("corepack"):
        raise SystemExit(f"management client build failed (exit {result.returncode})")
    sys.stderr.write("WARNING: pnpm/Node not found; management client not built.\n")


class BuildPyWithClient(build_py):
    def run(self):
        _ensure_client_build()
        super().run()


class SdistWithClient(sdist):
    def run(self):
        _ensure_client_build()
        super().run()


setup(
    version=__import__("geonode").get_version(),
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    cmdclass={"build_py": BuildPyWithClient, "sdist": SdistWithClient},
    package_data={
        "": ["*.*"],  # noqa
        "": ["static/*.*"],  # noqa
        "static": ["*.*"],
        "": ["templates/*.*"],  # noqa
        "templates": ["*.*"],
    },
)