function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var jpex = _interopDefault(require('jpex'));

var context = react.createContext(jpex);

function useJpex() {
  return react.useContext(context);
}

function useResolve(name, opts) {
  const jpex = useJpex();
  if (Array.isArray(opts)) {
    return useMemo(function() {
      return jpex.resolve(name);
    }, [ jpex, name ].concat(opts));
  }
  if (opts && typeof opts === 'object') {
    return jpex.resolve(name, opts);
  }
  return jpex.resolve(name);
}

function Provider(props) {
  var parent = useJpex();

  var container = react.useMemo(function() {
    if (props.value == null) {
      return parent.extend();
    }
    return props.value;
  }, [ props.value ]);

  return react.createElement(
    context.Provider,
    { value: container },
    props.children
  );
}

module.exports = {
  useJpex: useJpex,
  useResolve: useResolve,
  Provider: Provider
};
