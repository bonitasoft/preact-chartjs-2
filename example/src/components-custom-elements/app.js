import { h, Component } from 'preact';

import PieExample from './pie';

export default class App extends Component {
	render() {
		return (
			<div>
				<hr />
				<PieExample />
			</div>
		);
	}
}
