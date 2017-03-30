/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Rx = require('rxjs');
const Api = require('../api/riskdata');
const {zoomToExtent} = require('../../MapStore2/web/client/actions/map');
const {setupTutorial} = require('../../MapStore2/web/client/actions/tutorial');
const bbox = require('turf-bbox');
const {changeLayerProperties, addLayer} = require('../../MapStore2/web/client/actions/layers');
const assign = require('object-assign');
const {configLayer} = require('../utils/DisasterUtils');
const TutorialPresets = require('../utils/TutorialPresets');
const defaultStep = {
          title: '',
          text: '',
          position: 'bottom',
          type: 'click',
          allowClicksThruHole: true
};
const introStyle = {
    backgroundColor: 'transparent',
    color: '#fff',
    mainColor: '#fff',
    textAlign: 'center',
    header: {
        padding: 5,
        fontFamily: 'Georgia, serif',
        fontSize: '2.8em'
    },
    main: {
        fontSize: '1.0em',
        padding: 5
    },
    footer: {
        padding: 10
    },
    button: {
        color: '#fff',
        backgroundColor: '#078aa3'
    },
    close: {
        display: 'none'
    },
    skip: {
        color: '#fff'
    }
};
const {
    GET_DATA,
    LOAD_RISK_MAP_CONFIG,
    GET_RISK_FEATURES,
    GET_ANALYSIS_DATA,
    INIT_RISK_APP,
    DATA_LOADED,
    ANALYSIS_DATA_LOADED,
    dataLoaded,
    dataLoading,
    dataError,
    featuresLoaded,
    featuresLoading,
    featuresError,
    getFeatures,
    getAnalysisData,
    analysisDataLoaded,
    getData
} = require('../actions/disaster');
const {configureMap, configureError} = require('../../MapStore2/web/client/actions/config');
const getRiskDataEpic = action$ =>
    action$.ofType(GET_DATA).switchMap(action =>
        Rx.Observable.defer(() => Api.getData(action.url).then((data) => {
            return dataLoaded(data, action.cleanState);
        })).retry(1)
        .startWith(dataLoading(true))
        .catch(e => Rx.Observable.of(dataError(e)))
    );
const getRiskMapConfig = action$ =>
    action$.ofType(LOAD_RISK_MAP_CONFIG).switchMap(action =>
            Rx.Observable.fromPromise(Api.getData(action.configName))
                .map(val => [configureMap(val), getFeatures(action.featuresUrl)])
                .mergeAll()
                .catch(e => Rx.Observable.of(configureError(e)))
        );
const getRiskFeatures = (action$, store) =>
    action$.ofType(GET_RISK_FEATURES)
    .audit(() => {
        const isMapConfigured = (store.getState()).mapInitialConfig && true;
        return isMapConfigured && Rx.Observable.of(isMapConfigured) || action$.ofType('MAP_CONFIG_LOADED');
    })
    .switchMap(action =>
        Rx.Observable.defer(() => Api.getData(action.url))
        .retry(1)
        .map(val => [zoomToExtent(bbox(val.features[0]), "EPSG:4326"),
                changeLayerProperties("adminunits", {features: val.features.map((f, idx) => (assign({}, f, {id: idx}))) || []}),
                featuresLoaded(val.features)])
        .mergeAll()
        .startWith(featuresLoading())
        .catch(e => Rx.Observable.of(featuresError(e)))
    );
const getAnalysisEpic = (action$) =>
    action$.ofType(GET_ANALYSIS_DATA).switchMap(action =>
        Rx.Observable.defer(() => Api.getData(action.url))
            .retry(1)
            .map(val => {
                const baseUrl = val.wms && val.wms.baseurl;
                const layers = val.riskAnalysisData && val.riskAnalysisData.additionalLayers || [];
                const actions = [analysisDataLoaded(val)].concat(layers.map((l) => addLayer(configLayer(baseUrl, l[1], `ral_${l[0]}`, l[1].split(':').pop(), false, 'Gis Overlays'))));
                return actions;
            })
            .mergeAll()
            .startWith(dataLoading(true))
            .catch(e => Rx.Observable.of(dataError(e)))
    );
const zoomInOutEpic = (action$, store) =>
        action$.ofType("ZOOM_IN_OUT").switchMap( action => {
            const {riskAnalysis, context} = (store.getState()).disaster;
            const analysisHref = riskAnalysis && `${action.dataHref}${riskAnalysis.context}`;
            return Rx.Observable.defer(() => Api.getData(`${action.dataHref}${context || ''}`))
                .retry(1).
                map(data => [dataLoaded(data), getFeatures(action.geomHref)].concat(analysisHref && getAnalysisData(analysisHref) || []))
                .mergeAll()
                .startWith(dataLoading(true))
                .catch(e => Rx.Observable.of(dataError(e)));
        });
const initStateEpic = action$ =>
    action$.ofType(INIT_RISK_APP) // Wait untile map config is loaded
        .audit( () => action$.ofType('MAP_CONFIG_LOADED'))
        .map(action => {
            const geomHref = action.href.replace('risk_data_extraction', 'geom');
            const analysisHref = action.ac && `${action.href}${action.ac}`;
            return [getData(`${action.href}${action.gc || ''}`), getFeatures(geomHref)].concat(analysisHref && getAnalysisData(analysisHref) || [] );
        }).
        mergeAll();
const changeTutorial = action$ =>
    action$.ofType(DATA_LOADED, ANALYSIS_DATA_LOADED).switchMap( action => {
        return Rx.Observable.of(action.type).map((type) => {
            console.log(TutorialPresets[type]);
            return setupTutorial(TutorialPresets[type], introStyle, '', defaultStep);
        });
        // console.log('ok');
        // return setupTutorial(steps, introStyle, '', defaultStep);
    });

module.exports = {getRiskDataEpic, getRiskMapConfig, getRiskFeatures, getAnalysisEpic, zoomInOutEpic, initStateEpic, changeTutorial};
