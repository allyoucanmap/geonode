const {createSelector} = require('reselect');
const {last, head, isNull} = require('lodash');
const url = require('url');
const navItemsSel = ({disaster = {}}) => disaster.navItems || [];
const riskItemsSel = ({disaster = {}}) => disaster.overview || [];
const hazardTypeSel = ({disaster = {}}) => disaster.hazardType || {};
const analysisTypeSel = ({disaster = {}}) => disaster.analysisType || {};
const notificationsSel = (state) => state.notifications || [];
const currentAnalysisUrlSel = ({disaster = {}}) => disaster.currentAnalysisUrl || '';
const riskAnalysisDataSel = ({disaster = {}}) => disaster.riskAnalysis && disaster.riskAnalysis.riskAnalysisData || {};
const dimSelector = ({disaster = {}}) => disaster.dim || {dim1: 0, dim2: 1, dim1Idx: 0, dim2Idx: 0};
const contextSel = ({disaster = {}}) => disaster.context && !isNull(disaster.context) && disaster.context || '';
const riskAnalysisContextSelector = ({disaster = {}}) => disaster.riskAnalysis && disaster.riskAnalysis.context;
const topBarSelector = createSelector([navItemsSel, riskItemsSel, hazardTypeSel, contextSel],
     (navItems, riskItems, hazardType, context) => ({
        navItems,
        title: (last(navItems) || {label: ''}).label,
        overviewHref: (last(navItems) || {href: ''}).href,
        riskItems,
        activeRisk: hazardType.mnemonic || "Overview",
        context
    }));
const dataContainerSelector = createSelector([riskItemsSel, hazardTypeSel, analysisTypeSel, riskAnalysisDataSel, dimSelector],
    (riskItems, hazardType, analysisType, riskAnalysisData, dim) => ({
        showHazard: hazardType.mnemonic ? true : false,
        hazardTitle: hazardType.mnemonic ? head(riskItems.filter((hz) => hz.mnemonic === hazardType.mnemonic)).title || '' : '',
        hazardType,
        analysisType,
        riskAnalysisData,
        dim
    }));
const drillUpSelector = createSelector([navItemsSel],
     (navItems) => ({
        disabled: navItems.length < 2,
        label: navItems.length > 1 ? (navItems[navItems.length - 2]).label : '',
        href: navItems.length > 1 ? (navItems[navItems.length - 2]).href : '',
        geom: navItems.length > 1 ? (navItems[navItems.length - 2]).geom : ''
    }));
const switchDimSelector = createSelector([riskAnalysisDataSel, dimSelector],
    (riskAnalysisData, dim) => ({
    dimName: riskAnalysisData.data && riskAnalysisData.data.dimensions && riskAnalysisData.data.dimensions[dim.dim2].name
    }));
const axesSelector = createSelector([riskAnalysisDataSel, dimSelector],
    (riskAnalysisData, dim) => ({
    dimension: riskAnalysisData.data && riskAnalysisData.data.dimensions && riskAnalysisData.data.dimensions[dim.dim2],
        activeAxis: dim.dim2Idx
    }));
const shareUrlSelector = createSelector([navItemsSel, contextSel, riskAnalysisContextSelector, dimSelector],
    (navItems, context, riskAnalysisContext, dim) => {
        const {host, pathname, protocol} = url.parse(window.location.href, false);
        return {shareUrl: `${protocol}//${host}${pathname}?init=${JSON.stringify({href: (last(navItems) || {href: ''}).href, gc: context, ac: riskAnalysisContext, d: dim})}`};
    });
const downloadDataSelector = createSelector([notificationsSel, riskAnalysisDataSel],
    (notifications, riskAnalysisData) => (
      {
        download: notifications.filter((val) => { return val.uid === 'download_tab'; }),
        riskAnalysisData
      })
    );
const moreInfoSelector = createSelector([notificationsSel, riskAnalysisDataSel],
    (notifications, riskAnalysisData) => (
      {
        moreInfo: notifications.filter((val) => { return val.uid === 'more_info_tab'; }),
        riskAnalysisData
      })
    );
const chartLabelSelector = createSelector([notificationsSel, currentAnalysisUrlSel],
      (notifications, currentUrl) => (
        {
          notification: notifications.filter((val) => { return val.uid === 'chart_label_tab'; }),
          currentUrl
        })
      );
const mapLabelSelector = createSelector([notificationsSel, currentAnalysisUrlSel],
      (notifications, currentUrl) => (
        {
          notification: notifications.filter((val) => { return val.uid === 'map_label_tab'; }),
          currentUrl
        })
      );
module.exports = {
    drillUpSelector,
    topBarSelector,
    dataContainerSelector,
    switchDimSelector,
    axesSelector,
    shareUrlSelector,
    downloadDataSelector,
    moreInfoSelector,
    chartLabelSelector,
    mapLabelSelector
};

