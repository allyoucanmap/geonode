/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {loadMapConfig} = require('../actions/disaster');
const MapViewer = connect(() => ({}), {
    loadMapConfig: loadMapConfig.bind(null, "/static/js/config.json", false, "/risks/geom/loc/AF/")
})(require('../../MapStore2/web/client/containers/MapViewer'));

const {drillUpSelector, switchDimSelector, axesSelector} = require('../selectors/disaster');
const {zoom, toggleDim, setDimIdx} = require('../actions/disaster');

const DrillUpBtn = connect(drillUpSelector, {zoomOut: zoom})(require('../components/DrillUpBtn'));
const SwitchDimension = connect(switchDimSelector, {toggleDim})(require('../components/SwitchDimension'));
const AxesSelector = connect(axesSelector, {setDimIdx})(require('../components/AxesSelector'));
const MapContainer = (props) => (
        <div className="col-sm-5">
            <div className="disaster-map-container">
                <div style={{height: 400}}>
                    <MapViewer plugins={props.plugins} params={{mapType: "leaflet"}}/>
                </div>
                <div className="container-fluid">
                    <div className="row text-center">
                        <DrillUpBtn/>
                    </div>
                    <div className="row text-center">
                        <SwitchDimension/>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <AxesSelector/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);

module.exports = MapContainer;
