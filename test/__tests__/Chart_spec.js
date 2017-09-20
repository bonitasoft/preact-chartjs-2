// noinspection ES6UnusedImports
import {h} from 'preact';
import {shallow, deep} from 'preact-render-spy';
import {expect} from 'chai';
import sinon from 'sinon';

import Chart, {Chart as ChartConstructor} from '../../src/index';

const noop = () => {
};

describe('<Chart />', () => {

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  ChartConstructor.plugins.register({
    afterInit: function (chartInstance) {
      chartInstance.getDatasetAtEvent = function (e) {
        return ChartConstructor.Interaction.modes.dataset(this, e, this.options);
      };
    }
  });

  const mountComponent = props => deep(
    <Chart data={data} {...props} />
  );

  it('pre works', () => {
    expect(true).to.be.truthy;
  });

  it('renders', () => {
    // const wrapper = deep(<Chart data={data} />);//mountComponent();

    let wrapper = shallow(<Chart data={data}/>);
    // noinspection BadExpressionStatementJS
    expect(wrapper).to.be.truthy;
  });

  it('renders chart on props.redraw(true)', () => {
    const spy = sinon.spy(Chart.prototype, 'renderChart');

    const wrapper = mountComponent();

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} redraw={true}/>);
    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.height change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent({height: 100});

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} height={101}/>);
    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.width change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent({width: 100});

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} width={101}/>);
    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.type change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent({type: 'line'});

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} type={'line'}/>);

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} type={'bar'}/>);

    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.legend change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent({legend: {}});

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} legend={{}}/>);

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} legend={{a: 1}}/>);

    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.options change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent({options: {}});

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} options={{}}/>);

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={data} options={{a: 1}}/>);

    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('renders on props.data change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent();

    expect(spy.callCount).to.equal(1);

    wrapper.render(<Chart data={{}}/>);

    expect(spy.callCount).to.equal(2);

    spy.restore();
  });

  it('doesn\'t render when props didn\'t change', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent();

    wrapper.render(<Chart data={data}/>);
    wrapper.render(<Chart data={data}/>);

    expect(spy.callCount).to.equal(1);

    spy.restore();
  });

  it('doesn\'t render when function references are changed', () => {
    const spy = sinon.spy(Chart.prototype, 'render');
    const wrapper = mountComponent();

    wrapper.render(<Chart data={data}/>);
    wrapper.render(<Chart data={data} getDatasetAtEvent={{noop}}/>);
    wrapper.render(<Chart data={data} getElementAtEvent={{noop}}/>);
    wrapper.render(<Chart data={data} getElementsAtEvent={{noop}}/>);

    expect(spy.callCount).to.equal(1);

    spy.restore();
  });

  it.skip('calls getDatasetAtEvent', () => {
    const getDatasetAtEvent = sinon.spy();
    const wrapper = mountComponent({getDatasetAtEvent});

    wrapper.find('canvas').simulate('click');

    expect(getDatasetAtEvent.called).to.equal(true);
  });

  it.skip('calls getElementAtEvent', () => {
    const getElementAtEvent = sinon.spy();
    const wrapper = mountComponent({getElementAtEvent});

    wrapper.find('canvas').simulate('click');

    expect(getElementAtEvent.called).to.equal(true);
  });

  it.skip('calls getElementsAtEvent', () => {
    const getElementsAtEvent = sinon.spy();
    const wrapper = mountComponent({getElementsAtEvent});

    wrapper.find('canvas').simulate('click');

    expect(getElementsAtEvent.called).to.equal(true);
  });

  it.skip('calls onElementsClick', () => {
    const onElementsClick = sinon.spy();
    const wrapper = mountComponent({onElementsClick});

    wrapper.find('canvas').simulate('click');

    expect(onElementsClick.called).to.equal(true);
  });

  describe('props.data function', () => {
    it('calls data func with canvas node', () => {
      const resultData = {test: 1};
      const dataFn = sinon.spy((canvas) => resultData);
      mountComponent({data: dataFn});

      expect(dataFn.callCount).to.equal(1);
    });
  });
});
