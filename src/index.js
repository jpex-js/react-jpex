var react = require('react');
var jpex = require('jpex');

var context = react.createContext(jpex);

function useJpex() {
  return react.useContext(context);
}

function useResolve(name) {
  return useJpex().resolve(name);
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
