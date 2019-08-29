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
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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
                <Grid item xs={12}>
                    <Typography
                        component="h1"
                        variant="h6">
                        <FormattedMessage id="totalRequestsNumberByResource" defaultMessage="Total Number of Requests by Resource"/>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label={<FormattedMessage id="layers" defaultMessage="Layers"/>}
                        resourceType="layer"
                        timeRange={timeRange}
                        date={date}
                        globalTimeRange
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label={<FormattedMessage id="maps" defaultMessage="Maps"/>}
                        resourceType="map"
                        timeRange={timeRange}
                        date={date}
                        globalTimeRange
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label={<FormattedMessage id="documents" defaultMessage="Documents"/>}
                        resourceType="document"
                        timeRange={timeRange}
                        date={date}
                        globalTimeRange
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <RequestCounter
                        label={homeUrl.id === undefined ? layersUrl.name : <FormattedMessage id="homepage" defaultMessage="Homepage"/>}
                        resourceType="url"
                        timeRange={timeRange}
                        date={date}
                        resourceId={homeUrl.id || layersUrl.id}
                        globalTimeRange
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getRequestHitsCount
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
                                Icon: PersonIcon,
                                request: getRequestVisitorsCount
                            }
                        }}  />
                </Grid>
                <Grid item xs={12}>
                    <Divider />
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
                                    label={<FormattedMessage id="selectResourceCategory" defaultMessage="Select Resource Category"/>}
                                    value={resourceTypeValue}
                                    onChange={({ value }) => handleUpdate({
                                        resourceType: value,
                                        resourceId: undefined,
                                        eventType: undefined
                                    })}
                                    suggestions={resourceTypes
                                        .map(({ label, ...option }) => ({
                                            ...option,
                                            label: <FormattedMessage id={(label || '').toLowerCase()} defaultMessage={label}/>
                                        }))}/>
                            </div>
                            <div style={{ flex: 1}}>
                                {resourceId !== undefined && <Chip
                                    size="small"
                                    label={<FormattedMessage
                                        id="selectedResource"
                                        defaultMessage="Selected Resource {resource}"
                                        values={{ resource: resourceId }}/>}
                                    onDelete={() => handleUpdate({ resourceId: undefined })}
                                    className={classes.chip}
                                    color="primary"/>}
                                {eventType !== undefined && <Chip
                                    size="small"
                                    label={<FormattedMessage
                                        id="selectedEventType"
                                        defaultMessage="Selected Event {eventType}"
                                        values={{ eventType }}/>}
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
                        label={<FormattedMessage
                            id="requestCountTitle"
                            defaultMessage="Requests Count ({resourceType})"
                            values={{ resourceType: resourceId !== undefined
                                ? resourceId
                                : resourceType
                                    }}/>}
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
                        label={<FormattedMessage
                            id="frequentlyAccessedResources"
                            defaultMessage="Frequently Accessed Resources"/>}
                        onSelect={(resource) =>
                            handleUpdate({
                                resourceId: resource.id === resourceId
                                        ? undefined
                                        : resource.id
                            })}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getResourcesHitsList
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
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
                        label={<FormattedMessage
                            id="frequentlyUsedEvents"
                            defaultMessage="Frequently Used Events"/>}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                Icon: VisibilityIcon,
                                request: getEventsHitsList
                            },
                            visitors: {
                                label: <FormattedMessage id="uniqueVisits" defaultMessage="Unique Visits"/>,
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
                        label={<FormattedMessage id="mostActiveVisitors" defaultMessage="Most Active Visitors"/>}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="visits" defaultMessage="Visits"/>,
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
                        label={<FormattedMessage id="mostActiveCountries" defaultMessage="Most Active Countries"/>}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
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
                        label={<FormattedMessage id="mostActiveUserAgentsFamily" defaultMessage="Most Frequently Used User Agents Family"/>}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
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
                        label={<FormattedMessage id="mostActiveUserAgents" defaultMessage="Most Frequently Used User Agents"/>}
                        requests={{
                            hits: {
                                label: <FormattedMessage id="hits" defaultMessage="Hits"/>,
                                request: getUserAgentCount
                            }
                        }} />
                </Grid>
            </Grid>
        </Container>
    );
}