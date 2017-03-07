#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf.urls import url, include

from geonode.contrib.risks import views

extraction_urls = [
    url(r'^$', views.risk_data_extraction_index, name='data_extraction_index'),
    url(r'loc/(?P<loc>[\w\-]+)/$', views.location_view, name='location_view'),
    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/$', views.hazard_type_view, name='hazard_type'),
    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/at/(?P<at>[\w\-]+)/$', views.location_view, name='analysis_type'),


    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/at/(?P<at>[\w\-]+)/$', views.risk_data_extraction_index, name='data_extraction'),
    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/at/(?P<at>[\w\-]+)/dym/(?P<dym>[\w\-]+)/$', views.risk_data_extraction_index, name='data_extraction_dym'),
    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/at/(?P<at>[\w\-]+)/an/(?P<an>[\w\-]+)/$', views.risk_data_extraction_index, name='data_extraction_analysis'),
    url(r'loc/(?P<loc>[\w\-]+)/ht/(?P<ht>[\w\-]+)/at/(?P<at>[\w\-]+)/an/(?P<an>[\w\-]+)/dym/(?P<dym>[\w\-]+)$', views.risk_data_extraction_index, name='data_extraction_analysis_dym'),
]

urlpatterns = [
    url(r'^cost_benefit/$', views.cost_benefit_index, name='risks_cost_benefit_index'),
    url(r'^risk_data_extraction/', include(extraction_urls, namespace='risks')),
]
