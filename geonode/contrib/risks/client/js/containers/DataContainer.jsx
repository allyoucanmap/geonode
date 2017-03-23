/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const {connect} = require('react-redux');
const {dataContainerSelector} = require('../selectors/disaster');

const {getAnalysisData, getData, setDimIdx} = require('../actions/disaster');
const Chart = require('../components/Chart');
const Overview = connect(({disaster = {}}) => ({riskItems: disaster.overview || [] }) )(require('../components/Overview'));
const {Panel, Tooltip, OverlayTrigger} = require('react-bootstrap');
const Nouislider = require('react-nouislider');

const DataContainer = React.createClass({
    propTypes: {
        getData: React.PropTypes.func,
        getAnalysis: React.PropTypes.func,
        setDimIdx: React.PropTypes.func,
        showHazard: React.PropTypes.bool,
        className: React.PropTypes.string,
        hazardTitle: React.PropTypes.string,
        analysisType: React.PropTypes.object,
        riskAnalysisData: React.PropTypes.object,
        dim: React.PropTypes.object,
        hazardType: React.PropTypes.shape({
            mnemonic: React.PropTypes.string,
            description: React.PropTypes.string,
            analysisTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
                name: React.PropTypes.string,
                title: React.PropTypes.string,
                href: React.PropTypes.string
                }))
        })
    },
    getDefaultProps() {
        return {
            showHazard: false,
            getData: () => {},
            getAnalysis: () => {},
            className: "col-sm-7"
        };
    },
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    getChartData(data, val) {
        const {dim} = this.props;
        const nameIdx = dim === 0 ? 1 : 0;
        return data.filter((d) => d[nameIdx] === val ).map((v) => {return {"name": v[dim], "value": parseInt(v[2], 10)}; });
    },
    renderAnalysisData() {
        const {dim, setDimIdx: sIdx} = this.props;
        const {hazardSet, data} = this.props.riskAnalysisData;
        const tooltip = (<Tooltip id={"tooltip-back"} className="disaster">{'Back to Analysis Table'}</Tooltip>);
        const val = data.dimensions[dim.dim1].values[dim.dim1Idx];
        const header = (<div>{`${data.dimensions[dim.dim1].name} ${val}`}</div>);
        return (
            <div className="container-fluid">
                <div className="row">
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                    <button onClick={()=> this.props.getData(this.props.analysisType.href, true)} className="btn btn-primary">
                        <i className="fa fa-arrow-left"/>
                    </button>
                </OverlayTrigger>
                </div>
                <div className="row">
                <h4 style={{margin: 0}}>{hazardSet.title}</h4>
                </div>
                <div className="row">
                <p>{hazardSet.purpose}</p>
                </div>
                <div className="row">
                <Panel className="chart-panel">
                    <Chart dimension={data.dimensions} values={data.values} val={val} dim={dim} setDimIdx={sIdx}/>
                </Panel>
                <div className="slider-box">
                <div className="slider-lab text-center">
                  {header}
                </div>
                <Nouislider
                    range={{min: 0, max: data.dimensions[dim.dim1].values.length - 1}}
                    start={[dim.dim1Idx]}
                    step={1}
                    tooltips={false}
                    onChange={(idx) => this.props.setDimIdx('dim1Idx', Number.parseInt(idx[0]))}
                    pips= {{
                        mode: 'steps',
                        density: 20,
                        format: {
                            to: (value) => {
                                let valF = data.dimensions[dim.dim1].values[value].split(" ")[0];
                                return valF.length > 8 ? valF.substring(0, 8) + '...' : valF;
                            },
                            from: (value) => {
                                return value;
                            }
                        }
                    }}/>
                    </div>
                    <hr/>
                    </div>
            </div>
        );
    },
    renderRiskAnalysisHeader(title, getAnalysis, rs, idx) {
        const tooltip = (<Tooltip id={"tooltip-abstract-" + idx} className="disaster">{'Show Abstract'}</Tooltip>);
        return (
          <OverlayTrigger placement="top" overlay={tooltip}>
          <div className="row">
            <div className="col-xs-10">
              <div className="disaster-analysis-title">{title}</div>
            </div>
            <div className="col-xs-2">
                <i className="pull-right fa fa-chevron-down"></i>
            </div>
          </div>
          </OverlayTrigger>
        );
    },
    renderRiskAnalysis() {
        const {analysisType = {}, getAnalysis} = this.props;
        return analysisType.riskAnalysis.map((rs, idx) => {
            const {title, fa_icon: faIcon, abstract} = rs.hazardSet;
            const tooltip = (<Tooltip id={"tooltip-icon-cat-" + idx} className="disaster">{'Analysis Data'}</Tooltip>);
            return (
              <div key={idx} className="row">
                  <div className="col-xs-1 text-center">
                      <OverlayTrigger placement="bottom" overlay={tooltip}>
                        <i className={'disaster-category fa ' + faIcon} onClick={()=> getAnalysis(rs.href)}></i>
                      </OverlayTrigger>
                  </div>
                  <div className="col-xs-11">
                    <Panel collapsible header={this.renderRiskAnalysisHeader(title, getAnalysis, rs, idx)}>
                        {abstract}
                        <br/>
                        <button className="btn btn-default pull-right" onClick={()=> getAnalysis(rs.href)}><i className="fa fa-bar-chart"/>&nbsp;{'Analysis Data'}</button>
                    </Panel>
                  </div>
              </div>
            );
        });
    },
    renderAnalysisTab() {
        const {hazardType = {}, analysisType = {}, getData: loadData} = this.props;
        return (hazardType.analysisTypes || []).map((type) => {
            const {href, name, title} = type;
            const active = name === analysisType.name;
            return (<li key={name} className={`text-center ${active ? 'active' : ''}`} onClick={() => loadData(href, true)}>
                    <a href="#" data-toggle="tab"><span>{title}</span></a>
                    </li>);
        });
    },
    renderHazard() {
        const {riskAnalysisData} = this.props;

        return (<div className={this.props.className}>
                <div className="disaster-header">
                  {riskAnalysisData.name ? (
                    <div className="container-fluid">
                        {this.renderAnalysisData()}
                    </div>
                    ) : (
                    <div className="container-fluid">
                        <ul className="nav nav-tabs">
                            {this.renderAnalysisTab()}
                        </ul>
                        <div className="disaster-analysis">
                            <div className="container-fluid">
                                {this.renderRiskAnalysis()}
                            </div>
                        </div>
                    </div>
                  )}
                </div>
            </div>
        );
    },
    render() {
        const {showHazard, getData: loadData} = this.props;
        return showHazard ? this.renderHazard() : (<Overview className={this.props.className} getData={loadData}/>);
    }
});

module.exports = connect(dataContainerSelector, {getAnalysis: getAnalysisData, getData, setDimIdx})(DataContainer);
