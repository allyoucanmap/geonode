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

import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import useStyles from '../hooks/useStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import useRequest from '../hooks/useRequest';
import ReactTooltip from 'react-tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';
import ResponseError from './ResponseError';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { FormattedMessage } from 'react-intl';

export default function Calendar({ label = '', tooltip = () => 'tooltip', resourceType = 'layers', startDate, endDate, request }) {
    const [selected, setSelected] = useState(null);
    const [response, loading, error] = useRequest(request, { resourceType }, [ resourceType ]);
    const { items = [], maxCount } = response || {};
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
                align="center">
                {label}
            </Typography>
            {loading
            ? <CircularProgress className={classes.progress} />
            : error
                ? <ResponseError {...error} label={label}/>
                : <div className="calendar-heatmap-container">
                    <CalendarHeatmap
                        values={items}
                        startDate={startDate}
                        endDate={endDate}
                        onClick={(properties) => setSelected(properties)}
                        tooltipDataAttrs={(properties = {}) =>
                            ({ 'data-tip': tooltip({count: properties.count || 0}) })}
                        classForValue={(properties) => {
                            if (!properties) return 'color-empty';
                            const colorClassName = `color-scale-${maxCount < 7 ? properties.count : Math.floor(properties.count / maxCount * 6) + 1}`;
                            return `${colorClassName}${selected && properties.date ===  selected.date ? ' selected-day' : ''}`;
                        }}/>
                    <ReactTooltip/>
                </div>}
            {selected &&
            <div className="scroll-table flex-cell">
                <Typography
                    component="h4"
                    variant="body1"
                    gutterBottom
                    align="center">
                    {selected.formatDate}
                </Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><FormattedMessage id="name" defaultMessage="Name"/></TableCell>
                            <TableCell><FormattedMessage id="owner" defaultMessage="Owner"/></TableCell>
                            <TableCell align="right"><FormattedMessage id="time" defaultMessage="Time"/></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(selected.items || []).map(({ id, title, name, owner, formatHour }) => (
                            <TableRow
                                key={name}>
                                <TableCell component="th" scope="row">
                                    {title || name || `Identifier: ${id}`}
                                </TableCell>
                                <TableCell>{owner}</TableCell>
                                <TableCell align="right">{formatHour}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>}
        </Paper>
    );
}
