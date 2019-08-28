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
import get from 'lodash/get';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useStyles from '../hooks/useStyles';
import Autocomplete from '../components/Autocomplete';
import TimeRangeSelect from '../components/TimeRangeSelect';
import { RequestTable } from '../components/Table';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Chip from '@material-ui/core/Chip';
import {
    getResourcesHitsList,
    getResourcesVisitorsList,
    getCountriesCount,
    getEventsHitsList,
    getEventsVisitorsList,
    getVisitorsList,
    getUserAgentFamilyCount,
    getUserAgentCount,
    getRequestHitsCount,
    getRequestVisitorsCount
} from '../api';
import { ranges, setTimeRangeProperties } from '../utils/TimeRangeUtils';
import { RequestChart } from '../components/Chart';
import Map from '../components/Map';
import { getDetailsPath } from '../utils/RouteUtils';
import AnalyticsContext from '../context';
import { RequestCounter } from '../components/Counter';

export default function AnalyticsDetails({ maxCount = 10, match, history }) {
    const classes = useStyles();
    const {
        date,
        resourceId,
        resourceType = 'layer',
        eventType,
        timeRange = 'year'
    } = get(match, 'params') || {};
    const { getRange } = ranges[timeRange];
    const timeRangeProperties = getRange(date);
    const { validFromLabel, validToLabel, nextDate, previousDate } = timeRangeProperties;
    setTimeRangeProperties(timeRangeProperties);

    const { resourceTypes, layersUrl = {}, homeUrl = {} } = useContext(AnalyticsContext);

    const resourceTypeValue = resourceTypes.find(({value}) => resourceType === value) || {};

    const handleUpdate = (params = {}) => {
        history.push(
            getDetailsPath({
                eventType,
                resourceType,
                timeRange,
                date,
                resourceId,
                ...params
            })
        );
    };

    return (
        <Container
            maxWidth="lg"
            className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label="Layers"
                        resourceType="layer"
                        timeRange={timeRange}
                        date={date}
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
                        timeRange={timeRange}
                        date={date}
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
                        timeRange={timeRange}
                        date={date}
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
                        timeRange={timeRange}
                        date={date}
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
                <Grid item xs={12} className={classes.stickyHeader} style={{ paddingBottom: 0 }}>
                    <TimeRangeSelect
                        timeRange={timeRange}
                        validFromLabel={validFromLabel}
                        validToLabel={validToLabel}
                        nextDate={nextDate}
                        previousDate={previousDate}
                        onChange={(newTimeRange, newDate) => handleUpdate({
                            timeRange: newTimeRange,
                            date: newDate
                        })}>
                        <div style={{ display: 'flex', marginTop: 8 }}>
                            <div style={{ flex: 1}}>
                                <Autocomplete
                                    label="Select Resource Category"
                                    value={resourceTypeValue}
                                    onChange={({ value }) => handleUpdate({
                                        resourceType: value,
                                        resourceId: undefined,
                                        eventType: undefined
                                    })}
                                    suggestions={resourceTypes}/>
                            </div>
                            <div style={{ flex: 1}}>
                                {resourceId !== undefined && <Chip
                                    size="small"
                                    label={`Selected Resource ${resourceId}`}
                                    onDelete={() => handleUpdate({ resourceId: undefined })}
                                    className={classes.chip}
                                    color="primary"/>}
                                {eventType !== undefined && <Chip
                                    size="small"
                                    label={`Selected Event ${eventType}`}
                                    onDelete={() => handleUpdate({ eventType: undefined })}
                                    className={classes.chip}
                                    color="primary"/>}
                            </div>
                        </div>
                    </TimeRangeSelect>
                </Grid>
                
                <Grid item xs={12}>
                    <RequestChart
                        date={date}
                        label={resourceId !== undefined
                            ? resourceId
                            : 'Most Frequently Accessed Resources'}
                        resourceType={resourceType}
                        resourceId={resourceId}
                        eventType={eventType}
                        timeRange={timeRange}
                        globalTimeRange/>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        timeRange={timeRange}
                        globalTimeRange
                        date={date}
                        maxCount={maxCount}
                        resourceType={resourceType}
                        selectedId={parseFloat(resourceId)}
                        label={'Most Frequently Accessed Resources'}
                        onSelect={(resource) =>
                            handleUpdate({
                                resourceId: resource.id === resourceId
                                        ? undefined
                                        : resource.id
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
                        }}/>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        timeRange={timeRange}
                        globalTimeRange
                        date={date}
                        maxCount={maxCount}
                        resourceType={resourceType}
                        selectedId={eventType}
                        onSelect={(event) =>
                            handleUpdate({
                                eventType: event.id === eventType
                                        ? undefined
                                        : event.id
                            })}
                        label={'Events'}
                        requests={{
                            hits: {
                                label: 'Hits',
                                Icon: VisibilityIcon,
                                request: getEventsHitsList
                            },
                            visitors: {
                                label: 'Visitors',
                                Icon: PersonIcon,
                                request: getEventsVisitorsList
                            }
                        }}/>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        globalTimeRange
                        timeRange={timeRange}
                        date={date}
                        maxCount={maxCount}
                        resourceId={resourceId}
                        resourceType={resourceType}
                        label={'Visitor'}
                        requests={{
                            hits: {
                                label: 'Visit',
                                request: getVisitorsList
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <RequestTable
                        globalTimeRange
                        date={date}
                        timeRange={timeRange}
                        resourceId={resourceId}
                        resourceType={resourceType}
                        eventType={eventType}
                        maxCount={maxCount}
                        header={({ items }) => items && items.length > 0 && <Map id="map-details" data={items} />}
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
                        globalTimeRange
                        date={date}
                        timeRange={timeRange}
                        resourceId={resourceId}
                        resourceType={resourceType}
                        eventType={eventType}
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
                        globalTimeRange
                        date={date}
                        timeRange={timeRange}
                        maxCount={maxCount}
                        resourceId={resourceId}
                        resourceType={resourceType}
                        eventType={eventType}
                        label={'Most Frequently Used User Agents'}
                        requests={{
                            hits: {
                                label: 'Hits',
                                request: getUserAgentCount
                            }
                        }} />
                </Grid>
            </Grid>
        </Container>
    );
}