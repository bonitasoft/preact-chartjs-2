import {h} from 'preact';
import { props, withProps, withUnique, withRenderer } from 'skatejs/esnext';
import withPreact from '@skatejs/renderer-preact/esnext';

import { Pie } from './index';

const withComponent = Base => withProps(withRenderer(withUnique(Base || HTMLElement)));
const SkateComponent = withComponent(withPreact());

function propsWithDefault(type, def) {
  return {
    ...type,
    ...{ default: def }
  };
}

class PieWrap extends SkateComponent {
  static props = {
    options: props.object,
    data: props.object
  };
  attachShadow() {
    return this;
  }

  renderCallback({ props }) {
    return <Pie {...props} />;
  }
}

customElements.define('pie-chart', PieWrap);
