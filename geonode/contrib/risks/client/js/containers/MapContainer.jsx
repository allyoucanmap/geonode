/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {loadMapConfig} = require('../../MapStore2/web/client/actions/config');
const {disasterRiskLayerSelector} = require('../../MapStore2/web/client/selectors/layers');
const MapViewer = connect(() => ({}), {
    loadMapConfig: loadMapConfig.bind(null, "/static/js/config.json", false, "/risks/geom/loc/AF/")
})(require('../../MapStore2/web/client/containers/MapViewer'));
const Legend = connect(disasterRiskLayerSelector)(require('../../MapStore2/web/client/components/TOC/fragments/legend/Legend'));
const {drillUpSelector, switchDimSelector, axesSelector} = require('../selectors/disaster');
const {zoomInOut, toggleDim, setDimIdx, toggleAdminUnit} = require('../actions/disaster');

const DrillUpBtn = connect(drillUpSelector, {zoomOut: zoomInOut})(require('../components/DrillUpBtn'));
const SwitchDimension = connect(switchDimSelector, {toggleDim})(require('../components/SwitchDimension'));
const AxesSelector = connect(axesSelector, {setDimIdx})(require('../components/AxesSelector'));
const SwitchAdminU = connect(({disaster}) => ({
    showSubUnit: disaster.showSubUnit,
    show: disaster.riskAnalysis ? true : false
}), {toggleAdminUnit})(require('../components/SwitchAdminU'));
const FurtherResources = connect(({disaster} = {}) => ({
    analysisType: disaster.riskAnalysis && disaster.riskAnalysis.furtherResources && disaster.riskAnalysis.furtherResources.analysisType || [],
    hazardType: disaster.riskAnalysis && disaster.riskAnalysis.furtherResources && disaster.riskAnalysis.furtherResources.hazardType || []
}))(require('../components/FurtherResources'));
const MapContainer = (props) => (
        <div className="col-sm-5">
            <div id="disaster-map-main-container" className="disaster-map-container">
                <div className="drc">
                    <MapViewer plugins={props.plugins} params={{mapType: "leaflet"}}/>
                </div>
                <div className="container-fluid">
                    <div id="disaster-map-tools" className="btn-group pull-right disaster-map-tools"><SwitchAdminU/><DrillUpBtn/><SwitchDimension/></div>
                </div>
                <div className="container-fluid">
                    <div id="disaster-map-slider" className="row">
                        <AxesSelector/>
                    </div>
                    <div id="disaster-map-legend" className="row">
                        <Legend legendHeigth={20} legendWidth={100}/>
                    </div>
                </div>
            </div>
            <FurtherResources/>
        </div>
);

module.exports = MapContainer;
