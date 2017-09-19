import { h, render } from 'preact';

const MOUNT_NODE = document.getElementById('app');

const App = require('./components/app').default;
render(<App />, MOUNT_NODE);

if (module.hot) {
  module.hot.accept(['./components/app'], () =>
    setImmediate(() => {
      render('', MOUNT_NODE, root);
      render('', MOUNT_NODE, root);
      render(<App />, MOUNT_NODE);
    })
  );
}
