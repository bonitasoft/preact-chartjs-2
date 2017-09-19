import {h, Component} from 'preact';
import {Doughnut} from 'preact-chartjs-2';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getState = () => ({
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [getRandomInt(50, 200), getRandomInt(100, 150), getRandomInt(150, 250)],
    backgroundColor: [
      '#CCC',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
});

export default class DynamicDoughnutExample extends Component {

  componentWillMount() {

    this.setState(getState());

    setInterval(() => {
      this.setState(getState());
    }, 3000);
  }

  render(props, state) {
    return (
      <div>
        <h2>Dynamicly refreshed Doughnut Example</h2>
        <Doughnut data={state}/>
      </div>
    );
  }
};
