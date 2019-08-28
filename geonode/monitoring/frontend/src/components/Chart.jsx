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

import React, { Fragment } from 'react';
import clsx from 'clsx';
import { Bar, BarChart, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import useStyles from '../hooks/useStyles';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    getResourcesHitsInterval,
    getResourcesVisitorsInterval
} from '../api';
import useRequest from '../hooks/useRequest';
import ResponseError from './ResponseError';


export const RequestChart = function ({ label, timeRange, globalTimeRange, resourceType, resourceId, date, eventType }) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [response, loading] = useRequest(getResourcesHitsInterval, { timeRange: globalTimeRange ? undefined : timeRange,  resourceType, resource: resourceId, eventType }, [ timeRange, resourceId, resourceType, date, eventType ]);
    const { items = [], count: hitsCount, format } = response || {};
    const [userResponse, userLoading, userError] = useRequest(getResourcesVisitorsInterval, { timeRange: globalTimeRange ? undefined : timeRange,  resourceType, resource: resourceId, eventType }, [ timeRange, resourceId, resourceType, date, eventType ]);
    const { items: visitors, count: visitorsCount } = userResponse;
    return (
        <Fragment>
            <Paper className={fixedHeightPaper}>
                <Typography
                    variant="h6"
                    color="primary"
                    gutterBottom>
                    {label}
            </Typography>
                {loading || userLoading
                    ? <CircularProgress className={classes.progress} />
                    : <ResponsiveContainer
                        width="99%"
                        height="100%">
                        <BarChart
                            data={items.map((item, idx) => ({
                                ...item,
                                hits: item.val || 0,
                                visitors: visitors && visitors[idx] && visitors[idx].val || 0
                            }))}
                            margin={{
                                top: 16,
                                right: 16,
                                bottom: 20,
                                left: 24
                            }}>
                            <XAxis
                                dataKey="to"
                                tickFormatter={(value) => moment(value).format(format)}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                fontSize="11"/>
                            <YAxis>
                                <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
                                    Count
                                </Label>
                            </YAxis>
                            <Tooltip
                                labelFormatter={(value) => `Date ${moment(value).format(format)}`} />
                            <Bar type="monotone" dataKey="hits" fill="#2c689c" />
                            <Bar type="monotone" dataKey="visitors" fill="#ff8f31" />
                        </BarChart>
                    </ResponsiveContainer>}
            </Paper>
            <Paper>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            align="center"
                            gutterBottom>
                            <VisibilityIcon style={{ verticalAlign: 'middle' }} /> Hits {hitsCount}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {!userError
                            ? <Typography
                                component="h2"
                                variant="h6"
                                color="primary"
                                align="center"
                                gutterBottom>
                                <PersonIcon style={{ verticalAlign: 'middle' }} /> Visitors {visitorsCount}

                            </Typography>
                            : <ResponseError
                                {...userError}
                                label="Visitors"
                                typography={{
                                    component: 'h2',
                                    variant: 'h6'
                                }} />}
                    </Grid>
                </Grid>
            </Paper>
        </Fragment>
    )
};