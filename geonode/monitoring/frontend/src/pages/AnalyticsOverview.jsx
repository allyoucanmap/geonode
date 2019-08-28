/*
#########################################################################
#
# Copyright (C) 2019 OSGeo
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
*/

import React, { useContext } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useStyles from '../hooks/useStyles';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Divider from '@material-ui/core/Divider';

import {
    getUserAgentFamilyCount,
    getCountriesCount,
    getUserAgentCount,
    getDates,
    getUsersCount,
    getLayersCount,
    getMapsCount,
    getDocumentsCount,
    getRequestHitsCount,
    getRequestVisitorsCount,
    getResourcesHitsList,
    getResourcesVisitorsList
} from '../api';

import { ranges, setTimeRangeProperties } from '../utils/TimeRangeUtils';

import TimeRangeSelect from '../components/TimeRangeSelect';
import Map from '../components/Map';
import Calendar from '../components/Calendar';
import { RequestCounter } from '../components/Counter';
import { RequestTable } from '../components/Table';
import { RequestChart } from '../components/Chart';
import { getDetailsPath } from '../utils/RouteUtils';
import AnalyticsContext from '../context';

export default function Analytics({ maxCount = 10, timeRange = 'year', history }) {
    const classes = useStyles();
    const { getRange } = ranges[timeRange];
    const timeRangeProperties = getRange();
    const { validFrom, validFromLabel, validTo, validToLabel } = timeRangeProperties;
    setTimeRangeProperties(timeRangeProperties);

    const handleUpdate = (params = {}) => {
        history.push(
            getDetailsPath({
                timeRange,
                ...params
            })
        );
    };

    const { homeUrl = {}, layersUrl = {} } = useContext(AnalyticsContext);

    return (
        <Container
            maxWidth="lg"
            className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography
                        component="h1"
                        variant="h6">
                        Total Number of Resources
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Layers"
                        requests={{
                            count: {
                                label: 'Count',
                                request: getLayersCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Maps"
                        requests={{
                            count: {
                                label: 'Count',
                                request: getMapsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Documents"
                        requests={{
                            count: {
                                label: 'Count',
                                request: getDocumentsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Users"
                        requests={{
                            count: {
                                label: 'Count',
                                request: getUsersCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12} className={classes.stickyHeader} style={{ paddingBottom: 0 }}>
                    <TimeRangeSelect
                        timeRange={timeRange}
                        readOnly
                        validFromLabel={validFromLabel}
                        validToLabel={validToLabel}/>
                </Grid>
                <Grid item xs={12}>
                    <RequestChart
                        label="All Requests Count"/>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        component="h1"
                        variant="h6">
                        Total Number of Requests by Resource
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Layers"
                        resourceType="layer"
                        globalTimeRange
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: 'Hits',
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Maps"
                        resourceType="map"
                        globalTimeRange
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: 'Hits',
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Documents"
                        resourceType="document"
                        globalTimeRange
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: 'Hits',
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label={homeUrl.id === undefined ? layersUrl.name : 'Homepage'}
                        resourceType="url"
                        resourceId={homeUrl.id || layersUrl.id}
                        globalTimeRange
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: 'Hits',
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }}  />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Accessed Resources'}
                        onSelect={(resource) => 
                            handleUpdate({
                                resourceType: resource.type,
                                resourceId: resource.id
                            })}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getResourcesVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        header={({ items }) => items && items.length > 0 && <Map id="map-overview" data={items} />}
                        label={'Most Active Countries'}
                        requests={{
                            hits: {
                                label: 'Hits',
                                request: getCountriesCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Used User Agents Family'}
                        requests={{
                            hits: {
                                label: 'Hits',
                                request: getUserAgentFamilyCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Used User Agents'}
                        requests={{
                            hits: {
                                label: 'Hits',
                                request: getUserAgentCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Accessed Layers'}
                        resourceType="layer"
                        onSelect={(resource) => 
                            handleUpdate({
                                resourceType: resource.type,
                                resourceId: resource.id
                            })}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getResourcesVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Accessed Maps'}
                        resourceType="map"
                        onSelect={(resource) => 
                            handleUpdate({
                                resourceType: resource.type,
                                resourceId: resource.id
                            })}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getResourcesVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Accessed Documents'}
                        resourceType="document"
                        onSelect={(resource) => 
                            handleUpdate({
                                resourceType: resource.type,
                                resourceId: resource.id
                            })}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getResourcesVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        maxCount={maxCount}
                        label={'Most Frequently Accessed Urls'}
                        resourceType="url"
                        onSelect={(resource) => 
                            handleUpdate({
                                resourceType: resource.type,
                                resourceId: resource.id
                            })}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getResourcesVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <Calendar
                        label="Layers publication"
                        resourceType="layers"
                        request={getDates}
                        tooltip={({ count = 0 }) => `${count} ${count === 1 ? 'publication' : 'publications'}`}
                        startDate={new Date(validFrom)}
                        endDate={new Date(validTo)} />
                </Grid>
                <Grid item xs={12}>
                    <Calendar
                        label="Documents publication"
                        resourceType="documents"
                        request={getDates}
                        tooltip={({ count = 0 }) => `${count} ${count === 1 ? 'publication' : 'publications'}`}
                        startDate={new Date(validFrom)}
                        endDate={new Date(validTo)} />
                </Grid>
                <Grid item xs={12}>
                    <Calendar
                        label="Maps publication"
                        resourceType="maps"
                        request={getDates}
                        tooltip={({ count = 0 }) => `${count} ${count === 1 ? 'publication' : 'publications'}`}
                        startDate={new Date(validFrom)}
                        endDate={new Date(validTo)} />
                </Grid>
            </Grid>
        </Container>
    );
}