'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var jpex = require('jpex');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var jpex__default = /*#__PURE__*/_interopDefaultLegacy(jpex);

var context = /*#__PURE__*/React.createContext(jpex__default['default']);

var useJpex = (() => React.useContext(context));

const {
  Provider
} = context;

const JpexProvider = ({
  value,
  children
}) => {
  const parent = useJpex();
  const container = React.useMemo(() => {
    return value != null ? value : parent.extend();
  }, [value]);
  return /*#__PURE__*/React__default['default'].createElement(Provider, {
    value: container
  }, children);
};

JpexProvider.displayName = 'JpexProvider';

const useResolve = (name, opts) => {
  const jpex = useJpex();

  if (Array.isArray(opts)) {
    return React.useMemo(() => jpex.resolve(name), [jpex, name, ...opts]);
  }

  if (opts != null && typeof opts === 'object') {
    // @ts-ignore
    return jpex.resolve(name, opts);
  }

  return jpex.resolve(name);
};

exports.Provider = JpexProvider;
exports.useJpex = useJpex;
exports.useResolve = useResolve;
