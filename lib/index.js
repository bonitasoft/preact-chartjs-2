'use strict';

exports.__esModule = true;
exports.Chart = exports.defaults = exports.Scatter = exports.Bubble = exports.Polar = exports.Radar = exports.HorizontalBar = exports.Bar = exports.Line = exports.Pie = exports.Doughnut = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preact = require('preact');

var _chart = require('chart.js');

var _chart2 = _interopRequireDefault(_chart);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChartComponent = function (_Component) {
  _inherits(ChartComponent, _Component);

  function ChartComponent() {
    var _temp, _this, _ret;

    _classCallCheck(this, ChartComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.handleOnClick = function (event) {
      var instance = _this.chart_instance;

      var _this$props = _this.props,
          getDatasetAtEvent = _this$props.getDatasetAtEvent,
          getElementAtEvent = _this$props.getElementAtEvent,
          getElementsAtEvent = _this$props.getElementsAtEvent,
          onElementsClick = _this$props.onElementsClick;


      getDatasetAtEvent && getDatasetAtEvent(instance.getDatasetAtEvent(event), event);
      getElementAtEvent && getElementAtEvent(instance.getElementAtEvent(event), event);
      getElementsAtEvent && getElementsAtEvent(instance.getElementsAtEvent(event), event);
      onElementsClick && onElementsClick(instance.getElementsAtEvent(event), event); // Backward compatibility
    }, _this.ref = function (element) {
      _this.element = element;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  ChartComponent.prototype.componentWillMount = function componentWillMount() {
    this.chart_instance = undefined;
  };

  ChartComponent.prototype.componentDidMount = function componentDidMount() {
    this.renderChart();
  };

  ChartComponent.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this.props.redraw) {
      this.chart_instance.destroy();
      this.renderChart();
      return;
    }

    this.updateChart();
  };

  ChartComponent.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _props = this.props,
        redraw = _props.redraw,
        type = _props.type,
        options = _props.options,
        plugins = _props.plugins,
        legend = _props.legend,
        height = _props.height,
        width = _props.width;


    if (nextProps.redraw === true) {
      return true;
    }

    if (height !== nextProps.height || width !== nextProps.width) {
      return true;
    }

    if (type !== nextProps.type) {
      return true;
    }

    if (!(0, _isEqual2.default)(legend, nextProps.legend)) {
      return true;
    }

    if (!(0, _isEqual2.default)(options, nextProps.options)) {
      return true;
    }

    var nextData = this.transformDataProp(nextProps);

    if (!(0, _isEqual2.default)(this.shadowDataProp, nextData)) {
      return true;
    }

    return !(0, _isEqual2.default)(plugins, nextProps.plugins);
  };

  ChartComponent.prototype.componentWillUnmount = function componentWillUnmount() {
    this.chart_instance.destroy();
  };

  ChartComponent.prototype.transformDataProp = function transformDataProp(props) {
    var data = props.data;

    if (typeof data == 'function') {
      var node = this.element;
      return data(node);
    } else {
      return data;
    }
  };

  // Chart.js directly mutates the data.dataset objects by adding _meta proprerty
  // this makes impossible to compare the current and next data changes
  // therefore we memoize the data prop while sending a fake to Chart.js for mutation.
  // see https://github.com/chartjs/Chart.js/blob/master/src/core/core.controller.js#L615-L617


  ChartComponent.prototype.memoizeDataProps = function memoizeDataProps() {
    if (!this.props.data) {
      return;
    }

    var data = this.transformDataProp(this.props);

    this.shadowDataProp = _extends({}, data, {
      datasets: data.datasets && data.datasets.map(function (set) {
        return _extends({}, set);
      })
    });

    return data;
  };

  ChartComponent.prototype.updateChart = function updateChart() {
    var _this2 = this;

    var options = this.props.options;


    var data = this.memoizeDataProps(this.props);

    if (!this.chart_instance) return;

    if (options) {
      this.chart_instance.options = _chart2.default.helpers.configMerge(this.chart_instance.options, options);
    }

    // Pipe datasets to chart instance datasets enabling
    // seamless transitions
    var currentDatasets = this.chart_instance.config.data && this.chart_instance.config.data.datasets || [];
    var nextDatasets = data.datasets || [];

    // use the key provider to work out which series have been added/removed/changed
    var currentDatasetKeys = currentDatasets.map(this.props.datasetKeyProvider);
    var nextDatasetKeys = nextDatasets.map(this.props.datasetKeyProvider);
    var newDatasets = nextDatasets.filter(function (d) {
      return currentDatasetKeys.indexOf(_this2.props.datasetKeyProvider(d)) === -1;
    });

    // process the updates (via a reverse for loop so we can safely splice deleted datasets out of the array

    var _loop = function _loop(idx) {
      var currentDatasetKey = _this2.props.datasetKeyProvider(currentDatasets[idx]);
      if (nextDatasetKeys.indexOf(currentDatasetKey) === -1) {
        // deleted series
        currentDatasets.splice(idx, 1);
      } else {
        var retainedDataset = (0, _find2.default)(nextDatasets, function (d) {
          return _this2.props.datasetKeyProvider(d) === currentDatasetKey;
        });
        if (retainedDataset) {
          // update it in place if it is a retained dataset
          currentDatasets[idx].data.splice(retainedDataset.data.length);
          retainedDataset.data.forEach(function (point, pid) {
            currentDatasets[idx].data[pid] = retainedDataset.data[pid];
          });

          var _data = retainedDataset.data,
              otherProps = _objectWithoutProperties(retainedDataset, ['data']);

          currentDatasets[idx] = _extends({
            data: currentDatasets[idx].data
          }, currentDatasets[idx], otherProps);
        }
      }
    };

    for (var idx = currentDatasets.length - 1; idx >= 0; idx -= 1) {
      _loop(idx);
    }
    // finally add any new series
    newDatasets.forEach(function (d) {
      return currentDatasets.push(d);
    });

    var datasets = data.datasets,
        rest = _objectWithoutProperties(data, ['datasets']);

    this.chart_instance.config.data = _extends({}, this.chart_instance.config.data, rest);

    this.chart_instance.update();
  };

  ChartComponent.prototype.renderChart = function renderChart() {
    var _props2 = this.props,
        options = _props2.options,
        legend = _props2.legend,
        type = _props2.type,
        redraw = _props2.redraw,
        plugins = _props2.plugins;

    var node = this.element;
    var data = this.memoizeDataProps();

    if (typeof legend !== 'undefined' && !(0, _isEqual2.default)(ChartComponent.defaultProps.legend, legend)) {
      options.legend = legend;
    }

    this.chart_instance = new _chart2.default(node, {
      type: type,
      data: data,
      options: options,
      plugins: plugins
    });
  };

  ChartComponent.prototype.render = function render() {
    var _props3 = this.props,
        height = _props3.height,
        width = _props3.width,
        onElementsClick = _props3.onElementsClick;


    return (0, _preact.h)('canvas', {
      ref: this.ref,
      height: height,
      width: width,
      onClick: this.handleOnClick
    });
  };

  return ChartComponent;
}(_preact.Component);

ChartComponent.getLabelAsKey = function (d) {
  return d.label;
};

ChartComponent.defaultProps = {
  legend: {
    display: true,
    position: 'bottom'
  },
  type: 'doughnut',
  height: 150,
  width: 300,
  redraw: false,
  options: {},
  datasetKeyProvider: ChartComponent.getLabelAsKey
};
exports.default = ChartComponent;

var Doughnut = exports.Doughnut = function (_Component2) {
  _inherits(Doughnut, _Component2);

  function Doughnut() {
    _classCallCheck(this, Doughnut);

    return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
  }

  Doughnut.prototype.render = function render() {
    var _this4 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref) {
        return _this4.chart_instance = _ref && _ref.chart_instance;
      },
      type: 'doughnut'
    }));
  };

  return Doughnut;
}(_preact.Component);

var Pie = exports.Pie = function (_Component3) {
  _inherits(Pie, _Component3);

  function Pie() {
    _classCallCheck(this, Pie);

    return _possibleConstructorReturn(this, _Component3.apply(this, arguments));
  }

  Pie.prototype.render = function render() {
    var _this6 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref2) {
        return _this6.chart_instance = _ref2 && _ref2.chart_instance;
      },
      type: 'pie'
    }));
  };

  return Pie;
}(_preact.Component);

var Line = exports.Line = function (_Component4) {
  _inherits(Line, _Component4);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _Component4.apply(this, arguments));
  }

  Line.prototype.render = function render() {
    var _this8 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref3) {
        return _this8.chart_instance = _ref3 && _ref3.chart_instance;
      },
      type: 'line'
    }));
  };

  return Line;
}(_preact.Component);

var Bar = exports.Bar = function (_Component5) {
  _inherits(Bar, _Component5);

  function Bar() {
    _classCallCheck(this, Bar);

    return _possibleConstructorReturn(this, _Component5.apply(this, arguments));
  }

  Bar.prototype.render = function render() {
    var _this10 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref4) {
        return _this10.chart_instance = _ref4 && _ref4.chart_instance;
      },
      type: 'bar'
    }));
  };

  return Bar;
}(_preact.Component);

var HorizontalBar = exports.HorizontalBar = function (_Component6) {
  _inherits(HorizontalBar, _Component6);

  function HorizontalBar() {
    _classCallCheck(this, HorizontalBar);

    return _possibleConstructorReturn(this, _Component6.apply(this, arguments));
  }

  HorizontalBar.prototype.render = function render() {
    var _this12 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref5) {
        return _this12.chart_instance = _ref5 && _ref5.chart_instance;
      },
      type: 'horizontalBar'
    }));
  };

  return HorizontalBar;
}(_preact.Component);

var Radar = exports.Radar = function (_Component7) {
  _inherits(Radar, _Component7);

  function Radar() {
    _classCallCheck(this, Radar);

    return _possibleConstructorReturn(this, _Component7.apply(this, arguments));
  }

  Radar.prototype.render = function render() {
    var _this14 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref6) {
        return _this14.chart_instance = _ref6 && _ref6.chart_instance;
      },
      type: 'radar'
    }));
  };

  return Radar;
}(_preact.Component);

var Polar = exports.Polar = function (_Component8) {
  _inherits(Polar, _Component8);

  function Polar() {
    _classCallCheck(this, Polar);

    return _possibleConstructorReturn(this, _Component8.apply(this, arguments));
  }

  Polar.prototype.render = function render() {
    var _this16 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref7) {
        return _this16.chart_instance = _ref7 && _ref7.chart_instance;
      },
      type: 'polarArea'
    }));
  };

  return Polar;
}(_preact.Component);

var Bubble = exports.Bubble = function (_Component9) {
  _inherits(Bubble, _Component9);

  function Bubble() {
    _classCallCheck(this, Bubble);

    return _possibleConstructorReturn(this, _Component9.apply(this, arguments));
  }

  Bubble.prototype.render = function render() {
    var _this18 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref8) {
        return _this18.chart_instance = _ref8 && _ref8.chart_instance;
      },
      type: 'bubble'
    }));
  };

  return Bubble;
}(_preact.Component);

var Scatter = exports.Scatter = function (_Component10) {
  _inherits(Scatter, _Component10);

  function Scatter() {
    _classCallCheck(this, Scatter);

    return _possibleConstructorReturn(this, _Component10.apply(this, arguments));
  }

  Scatter.prototype.render = function render() {
    var _this20 = this;

    return (0, _preact.h)(ChartComponent, _extends({}, this.props, {
      ref: function ref(_ref9) {
        return _this20.chart_instance = _ref9 && _ref9.chart_instance;
      },
      type: 'scatter'
    }));
  };

  return Scatter;
}(_preact.Component);

var defaults = exports.defaults = _chart2.default.defaults;
exports.Chart = _chart2.default;