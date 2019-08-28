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

import React from 'react';
import { render } from 'react-dom';
import DashboardContainer from './containers/Dashboard';
import { HashRouter, Route, withRouter } from 'react-router-dom'; 
import { createHashHistory } from 'history';
import routes from './routes';
import theme from './theme';
import { ThemeProvider } from '@material-ui/styles';
import useRequest from './hooks/useRequest';
import {
    getServices,
    getResourceTypes,
    getEventTypes,
    getResourceMainUrls
} from './api';
import AnalyticsContext from './context';

import '../theme/overrides.scss';

const history = createHashHistory({});
const Dashboard = withRouter(DashboardContainer);

const parseResourceTypes = function(resourceTypes) {
    const availableResourceTypes = [ 'layer', 'map', 'document', 'url' ];
    return [
        { value: 'all', label: 'All' },
        ...resourceTypes.filter(({ value }) => availableResourceTypes.indexOf(value) !== -1)
    ]
};

const Root = function () {

    const [ servicesResponse, loadingServices ] = useRequest(getServices);
    const [ resourceTypeResponse, loadingResourceTypes ] = useRequest(getResourceTypes);
    const [ eventTypesResponse, loadingEventTypes ] = useRequest(getEventTypes);
    const [ urlResponse, loadingUrls ] = useRequest(getResourceMainUrls);
    const { services = [] } = servicesResponse || {};
    const { resourceTypes = [] } = resourceTypeResponse || {};
    const { eventTypes = [] } = eventTypesResponse || {};

    return (
        <AnalyticsContext.Provider
            value={{ services, resourceTypes: parseResourceTypes(resourceTypes), eventTypes, ...urlResponse }}>
            <ThemeProvider theme={theme}>
                <HashRouter
                    history={history}>
                    <Dashboard
                        loading={loadingServices || loadingResourceTypes || loadingEventTypes || loadingUrls}>
                        {routes.map(route => {
                            return (
                                <Route
                                    key={route.path}
                                    exact={route.exact}
                                    path={route.path}
                                    component={route.component}/>
                            );
                        })}
                    </Dashboard>
                </HashRouter>
            </ThemeProvider>
        </AnalyticsContext.Provider>
    );
}

render(<Root />, document.getElementById('monitoring'));
