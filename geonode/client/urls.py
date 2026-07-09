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
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.urls import path, re_path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

manage_shell = login_required(
    ensure_csrf_cookie(
        TemplateView.as_view(
            template_name="manage/index.html",
            extra_context={"script_name": settings.FORCE_SCRIPT_NAME or ""},
        )
    )
)

urlpatterns = [
    path("jsi18n/", JavaScriptCatalog.as_view(packages=["geonode.client"]), name="manage-javascript-catalog"),
    re_path(r"^.*$", manage_shell, name="manage"),
]
