function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var jpex = _interopDefault(require('jpex'));

var context = react.createContext(jpex);

function useJpex() {
  return react.useContext(context);
}

function useResolve(name, deps) {
  const jpex = useJpex();
  if (deps) {
    return react.useMemo(function() {
      return jpex.resolve(name);
    }, [ jpex, name ].concat(deps));
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
