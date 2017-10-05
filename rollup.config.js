import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

const env = process.env.NODE_ENV;

const config = {
  entry: 'src/index.js',
  external: ['chart.js', 'preact'],
  globals: {
    'chart.js': 'Chart',
    preact: 'Preact'
  },
  exports: 'named',
  format: 'umd',
  moduleName: 'PreactChartjs2',
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
    }),
    commonjs(),
  ],
};

if (env === 'production') {
   config.plugins.push(
     minify()
  );
}

export default config;
