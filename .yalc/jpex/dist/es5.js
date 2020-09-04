'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function constant(jpex, name, obj) {
  return jpex.factory(name, [], function () {
    return obj;
  }, {
    lifecycle: 'application'
  });
}

var isString = function isString(obj) {
  return typeof obj === 'string';
};
var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
var hasOwn = function hasOwn(obj, name) {
  return Object.hasOwnProperty.call(obj, name);
};
var instantiate = function instantiate(context, args) {
  // eslint-disable-next-line new-parens
  return new (Function.prototype.bind.apply(context, args))();
};
var isNode = function () {
  var _process; // eslint-disable-line no-underscore-dangle


  try {
    // eslint-disable-next-line no-new-func
    _process = new Function('return process')();
  } catch (e) {// No process
  } // eslint-disable-next-line max-len


  return typeof _process === 'object' && _process.toString && _process.toString() === '[object process]';
}(); // eslint-disable-next-line no-new-func

var doUnsafeRequire = new Function('require', 'target', 'return require.main.require(target)');
var unsafeRequire = function unsafeRequire(target) {
  // eslint-disable-next-line no-eval
  return doUnsafeRequire(eval('require'), target);
};
var getLast = function getLast(arr) {
  return arr[arr.length - 1];
};

function factory(jpex, name, dependencies, fn, opts) {
  var _opts$precedence, _opts$lifecycle;

  if (!isString(name)) {
    throw new Error("Factories must be given a name, but was called with [" + typeof name + "]");
  }

  if (!Array.isArray(dependencies)) {
    throw new Error("Expected an array of dependencies, but was called with [" + typeof dependencies + "]");
  }

  if (!isFunction(fn)) {
    throw new Error("Factory " + name + " must be a [Function]");
  }

  if (!dependencies.length) {
    dependencies = null;
  }

  var precedence = (_opts$precedence = opts == null ? void 0 : opts.precedence) != null ? _opts$precedence : jpex.$$config.precedence;

  if (precedence === 'passive' && jpex.$$factories[name]) {
    return;
  }

  var f = {
    fn: fn,
    dependencies: dependencies,
    lifecycle: (_opts$lifecycle = opts == null ? void 0 : opts.lifecycle) != null ? _opts$lifecycle : jpex.$$config.lifecycle
  };
  jpex.$$factories[name] = f;
}

function service(jpex, name, dependencies, fn, opts) {
  if (!isFunction(fn)) {
    throw new Error("Service " + name + " must be a [Function]");
  }

  function factory() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = {};

    if (opts == null ? void 0 : opts.bindToInstance) {
      dependencies.forEach(function (key, i) {
        context[key] = args[i];
      });
    }

    args.unshift(context);
    return instantiate(fn, args);
  }

  return jpex.factory(name, dependencies, factory, opts);
}

function alias(jpex, alias, name) {
  if (jpex.$$factories[name] != null) {
    jpex.$$factories[alias] = jpex.$$factories[name];
    return;
  }

  if (jpex.$$factories[alias] != null) {
    jpex.$$factories[name] = jpex.$$factories[alias];
    return;
  }

  throw new Error("Cannot create an alias for [" + name + "|" + alias + "] as it does not exist");
}

var getFromNodeModules = function getFromNodeModules(jpex, target) {
  // in order to stop webpack environments from including every possible
  // import source in the bundle, we have to stick all node require stuff
  // inside an eval setup
  if (!isNode) {
    return;
  }

  if (!jpex.$$config.nodeModules) {
    return;
  }

  try {
    var value = unsafeRequire(target);
    jpex.constant(target, value);
    return jpex.$$factories[target];
  } catch (e) {
    if (e && e.message && e.message.includes("Cannot find module '" + target + "'")) {
      // not found in node modules, just continue
      return;
    }

    throw e;
  }
};

var getGlobalObject = function getGlobalObject() {
  if (typeof global !== 'undefined') {
    // eslint-disable-next-line no-undef
    return global;
  }

  if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line no-undef
    return globalThis;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  return {};
};

var getGlobalProperty = function getGlobalProperty(name) {
  var global = getGlobalObject();

  if (global[name] !== void 0) {
    return global[name];
  } // we need to handle inferred types as well
  // this gets a little bit hacky...


  if (name.startsWith('type:global:')) {
    // most global types will just be the name of the property in pascal case
    // i.e. window = Window / document = Document
    var inferredName = name.charAt(12).toLowerCase() + name.substr(13);
    return global[inferredName];
  }
};

var getFromGlobal = function getFromGlobal(jpex, name) {
  if (!jpex.$$config.globals) {
    return;
  }

  var value = getGlobalProperty(name);

  if (value !== void 0) {
    jpex.constant(name, value);
    return jpex.$$factories[name];
  }
};

var getFactory = function getFactory(jpex, name, opts) {
  var _opts$optional;

  if (typeof name !== 'string') {
    throw new Error("Name must be a string, but recevied " + typeof name);
  }

  var factory = jpex.$$resolved[name];

  if (factory != null) {
    return factory;
  }

  factory = jpex.$$factories[name];

  if (factory != null) {
    return factory;
  }

  factory = getFromGlobal(jpex, name);

  if (factory != null) {
    return factory;
  }

  factory = getFromNodeModules(jpex, name);

  if (factory != null) {
    return factory;
  }

  if ((_opts$optional = opts == null ? void 0 : opts.optional) != null ? _opts$optional : jpex.$$config.optional) {
    return;
  }

  throw new Error("Unable to find required dependency [" + name + "]");
};
var cacheResult = function cacheResult(jpex, name, factory, value, namedParameters) {
  switch (factory.lifecycle) {
    case 'application':
      factory.resolved = true;
      factory.value = value;
      break;

    case 'class':
      jpex.$$resolved[name] = {
        resolved: true,
        value: value
      };
      break;

    case 'none':
      break;

    case 'instance':
    default:
      namedParameters[name] = value;
      break;
  }
};

var resolveOne = function resolveOne(jpex, name, namedParameters, opts, stack) {
  var _factory$dependencies;

  if (!namedParameters) {
    namedParameters = _extends({}, opts == null ? void 0 : opts.with);
  } // Check named parameters
  // if we have a named parameter for this dependency
  // we don't need to do any resolution, we can just return the value


  if (hasOwn(namedParameters, name)) {
    return namedParameters[name];
  } // Special keys


  if (name === '$namedParameters' || name === "type:jpex/NamedParameters") {
    return namedParameters;
  } // Ensure we're not stuck in a recursive loop


  if (stack.length > 0 && stack.indexOf(name) > -1) {
    if (getLast(stack) === name) {
      var _jpex$$$parent;

      if ((_jpex$$$parent = jpex.$$parent) == null ? void 0 : _jpex$$$parent.$$factories[name]) {
        return resolveOne(jpex.$$parent, name, namedParameters, opts, []);
      }
    }

    throw new Error("Recursive loop for dependency " + name + " encountered");
  } // Get the factory
  // This will either return the factory,
  // return null (meaning it's an optional dependency)
  // or throw an error


  var factory = getFactory(jpex, name, opts);

  if (!factory) {
    return;
  } // Check if it's already been resolved


  if (factory.resolved) {
    return factory.value;
  } // Work out dependencies


  var args = [];

  if ((_factory$dependencies = factory.dependencies) == null ? void 0 : _factory$dependencies.length) {
    // eslint-disable-next-line no-use-before-define
    args = resolveMany(jpex, factory, namedParameters, opts, stack.concat(name));
  } // Invoke the factory


  var value = factory.fn.apply(jpex, args); // Cache the result

  cacheResult(jpex, name, factory, value, namedParameters);
  return value;
};
var resolveMany = function resolveMany(jpex, definition, namedParameters, opts, stack) {
  var _definition$dependenc;

  if (!(definition == null ? void 0 : (_definition$dependenc = definition.dependencies) == null ? void 0 : _definition$dependenc.length)) {
    return [];
  }

  if (!stack) {
    stack = [];
  }

  if (!namedParameters) {
    var _opts$with;

    namedParameters = (_opts$with = opts == null ? void 0 : opts.with) != null ? _opts$with : {};
  }

  var dependencies = [].concat(definition.dependencies);
  var values = dependencies.reduce(function (value, dependency) {
    var x = resolveOne(jpex, dependency, namedParameters, opts, stack);
    return value.concat([x]);
  }, []);
  return values;
};

var resolve = function resolve(jpex, name, opts) {
  return resolveOne(jpex, name, void 0, opts, []);
};
var resolveDependencies = function resolveDependencies(jpex, definition, opts) {
  return resolveMany(jpex, definition, void 0, opts, []);
};
var isResolved = function isResolved(jpex, dependency) {
  var _jpex$$$factories$dep;

  if (!isString(dependency)) {
    return false;
  }

  if (jpex.$$resolved[dependency]) {
    return true;
  }

  if ((_jpex$$$factories$dep = jpex.$$factories[dependency]) == null ? void 0 : _jpex$$$factories$dep.resolved) {
    return true;
  }

  return false;
};
var allResolved = function allResolved(jpex, dependencies) {
  return dependencies.every(isResolved.bind(null, jpex));
};

var encase = function encase(jpex, dependencies, fn) {
  var result;

  var encased = function encased() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /* eslint-disable no-invalid-this */
    if (result && allResolved(jpex, dependencies)) {
      return result.apply(this, args);
    }

    var deps = resolveDependencies(jpex, {
      dependencies: dependencies
    });
    result = fn.apply(this, deps);
    return result.apply(this, args);
    /* eslint-enable */
  };

  encased.encased = fn;
  return encased;
};

var clearCache = function clearCache(jpex, names) {
  names = [].concat(names || []);

  for (var key in jpex.$$factories) {
    if (!names.length || names.indexOf(key) > -1) {
      jpex.$$factories[key].resolved = false;
    }
  }

  for (var _key in jpex.$$resolved) {
    if (!names.length || names.indexOf(_key) > -1) {
      delete jpex.$$resolved[_key];
    }
  }
};

var defaultConfig = {
  lifecycle: 'class',
  precedence: 'active',
  globals: true,
  nodeModules: true,
  optional: false
};

var Jpex = /*#__PURE__*/function () {
  function Jpex(options, parent) {
    if (options === void 0) {
      options = {};
    }

    _defineProperty(this, "decorate", void 0);

    _defineProperty(this, "$$config", void 0);

    _defineProperty(this, "$$parent", void 0);

    _defineProperty(this, "$$factories", {});

    _defineProperty(this, "$$resolved", {});

    var _options = options,
        _options$inherit = _options.inherit,
        inherit = _options$inherit === void 0 ? true : _options$inherit,
        config = _objectWithoutPropertiesLoose(_options, ["inherit"]);

    this.$$parent = parent;
    this.$$config = _extends({}, defaultConfig, inherit ? parent == null ? void 0 : parent.$$config : {}, config);

    if (parent && inherit) {
      this.$$factories = Object.create(parent.$$factories);
    }
  }

  var _proto = Jpex.prototype;

  _proto.extend = function extend(config) {
    return new Jpex(config, this);
  };

  _proto.constant = function constant$1(name, obj) {
    return constant(this, name, obj);
  };

  _proto.factory = function factory$1(name, deps, fn, opts) {
    return factory(this, name, deps, fn, opts);
  };

  _proto.service = function service$1(name, deps, fn, opts) {
    return service(this, name, deps, fn, opts);
  };

  _proto.alias = function alias$1(_alias, name) {
    return alias(this, _alias, name);
  };

  _proto.resolve = function resolve$1(name, opts) {
    return resolve(this, name, opts);
  };

  _proto.resolveWith = function resolveWith(name, namedParameters, opts) {
    return resolve(this, name, _extends({
      with: namedParameters
    }, opts));
  };

  _proto.raw = function raw(name) {
    return getFactory(this, name, {}).fn;
  };

  _proto.encase = function encase$1(deps, fn) {
    return encase(this, deps, fn);
  };

  _proto.clearCache = function clearCache$1() {
    for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
      names[_key] = arguments[_key];
    }

    return clearCache(this, names);
  };

  _proto.infer = function infer() {
    return '';
  };

  return Jpex;
}();

var jpex = new Jpex();

exports.default = jpex;
exports.jpex = jpex;
