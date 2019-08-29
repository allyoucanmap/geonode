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

import moment from 'moment';

let timeRangeProperties = {};

export const setTimeRangeProperties = function(properties) {
    timeRangeProperties = { ...properties };
};

export const getTimeRangeProperties = function() {
    return timeRangeProperties;
};

const getRange = function(type, intervalType, format = 'MMMM Do YYYY, h:mm:ss a', labelFormat = 'MMMM Do YYYY, h:mm:ss a', date) {
    const today = moment(Date.now());
    const validTo = date && moment(date) || today;
    const validFrom = moment(validTo).subtract(1, type);
    const range = moment(validTo).diff(validFrom) / 1000;

    const intervalFrom = moment(validTo).subtract(1, intervalType);
    const interval = moment(validTo).diff(intervalFrom) / 1000;

    const nextDate = moment(validTo).add(1, type);
    return {
        validTo: validTo.toISOString().replace('T', ' ').split('.')[0],
        validFrom: validFrom.toISOString().replace('T', ' ').split('.')[0],
        range,
        validToLabel: validTo.format(labelFormat),
        validFromLabel: validFrom.format(labelFormat),
        format,
        interval,
        nextDate: nextDate.isSameOrAfter(today) ? undefined : nextDate.toISOString(),
        previousDate: validFrom.toISOString()
    };
};

export const ranges = {
    day: {
        label: 'day',
        getRange: date => getRange('day', 'hour', 'LT', 'MMM Do ddd YYYY (LT)', date)
    },
    week: {
        label: 'week',
        getRange: date => getRange('week', 'day', 'Do ddd', 'MMM Do dddd YYYY', date)
    },
    month: {
        label: 'month',
        getRange: date => getRange('month', 'week', 'MMM Do', 'MMMM Do YYYY', date)
    },
    year: {
        label: 'year',
        getRange: date => getRange('year', 'month', 'MMM YYYY', 'MMMM YYYY', date)
    }
};
