import {h, Component} from 'preact';
import {Pie} from 'preact-chartjs-2';

const data = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
};

const legendOpts = {
  display: true,
  position: 'top',
  fullWidth: true,
  reverse: false,
  labels: {
    fontColor: 'rgb(255, 99, 132)'
  }
};

export default class LegendExample extends Component {

  constructor() {
    super();
    this.state = {
      legend: legendOpts
    };
    this.applyLegendSettings = this.applyLegendSettings.bind(this);
  }

  applyLegendSettings() {
    const {value} = this.legendOptsInput;

    try {
      const opts = JSON.parse(value);
      this.setState({
        legend: opts
      });
    } catch (e) {
      alert(e.message);
      throw Error(e);
    }
  }

  render(props, state) {
    return (
      <div>
        <h2>Legend Options Example</h2>
        <textarea
          cols="40"
          rows="15"
          ref={input => {
            this.legendOptsInput = input;
          }}
          defaultValue={JSON.stringify(state.legend, null, 2)}/>
        <div>
          <button onClick={this.applyLegendSettings}>Apply legend settings</button>
        </div>
        <Pie data={data} legend={state.legend} redraw/>
      </div>
    );
  }
}
