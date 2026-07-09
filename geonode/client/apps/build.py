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

import shutil
import subprocess
import sys
from pathlib import Path

APPS_DIR = Path(__file__).resolve().parent
LOCKFILE = APPS_DIR / "pnpm-lock.yaml"


def _pnpm_base():
    if shutil.which("pnpm"):
        return ["pnpm"]
    if shutil.which("corepack"):
        return ["corepack", "pnpm"]
    raise SystemExit(
        "[build-client] pnpm not found. Install Node (>=20.19) and `corepack enable pnpm`, "
        "or use the prebuilt bundle shipped in the wheel."
    )


def _run(cmd):
    print(f"[build-client] $ {' '.join(cmd)}  (cwd={APPS_DIR})", flush=True)
    subprocess.run(cmd, cwd=str(APPS_DIR), check=True)


def build_client():
    pnpm = _pnpm_base()
    _run(pnpm + (["install", "--frozen-lockfile"] if LOCKFILE.exists() else ["install"]))
    _run(pnpm + ["run", "build"])
    print("[build-client] done -> geonode/client/static/{client,manage}/", flush=True)


if __name__ == "__main__":
    try:
        build_client()
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.returncode)
