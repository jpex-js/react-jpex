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

function constant(jpex, name, obj) {
  return jpex.factory(name, [], () => obj, {
    lifecycle: 'application'
  });
}

const isString = obj => typeof obj === 'string';
const isFunction = obj => typeof obj === 'function';
const hasOwn = (obj, name) => {
  return Object.hasOwnProperty.call(obj, name);
};
const instantiate = (context, args) => {
  // eslint-disable-next-line new-parens
  return new (Function.prototype.bind.apply(context, args))();
};
const isNode = (() => {
  let _process; // eslint-disable-line no-underscore-dangle


  try {
    // eslint-disable-next-line no-new-func
    _process = new Function('return process')();
  } catch (e) {// No process
  } // eslint-disable-next-line max-len


  return typeof _process === 'object' && _process.toString && _process.toString() === '[object process]';
})(); // eslint-disable-next-line no-new-func

const doUnsafeRequire = new Function('require', 'target', 'return require.main.require(target)');
const unsafeRequire = target => {
  // eslint-disable-next-line no-eval
  return doUnsafeRequire(eval('require'), target);
};
const getLast = arr => arr[arr.length - 1];

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

  const precedence = (_opts$precedence = opts == null ? void 0 : opts.precedence) != null ? _opts$precedence : jpex.$$config.precedence;

  if (precedence === 'passive' && jpex.$$factories[name]) {
    return;
  }

  const f = {
    fn,
    dependencies,
    lifecycle: (_opts$lifecycle = opts == null ? void 0 : opts.lifecycle) != null ? _opts$lifecycle : jpex.$$config.lifecycle
  };
  jpex.$$factories[name] = f;
}

function service(jpex, name, dependencies, fn, opts) {
  if (!isFunction(fn)) {
    throw new Error("Service " + name + " must be a [Function]");
  }

  function factory(...args) {
    const context = {};

    if (opts == null ? void 0 : opts.bindToInstance) {
      dependencies.forEach((key, i) => {
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

const getFromNodeModules = (jpex, target) => {
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
    const value = unsafeRequire(target);
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

const getGlobalObject = () => {
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

const getGlobalProperty = name => {
  const global = getGlobalObject();

  if (global[name] !== void 0) {
    return global[name];
  } // we need to handle inferred types as well
  // this gets a little bit hacky...


  if (name.startsWith('type:global:')) {
    // most global types will just be the name of the property in pascal case
    // i.e. window = Window / document = Document
    const inferredName = name.charAt(12).toLowerCase() + name.substr(13);
    return global[inferredName];
  }
};

const getFromGlobal = (jpex, name) => {
  if (!jpex.$$config.globals) {
    return;
  }

  const value = getGlobalProperty(name);

  if (value !== void 0) {
    jpex.constant(name, value);
    return jpex.$$factories[name];
  }
};

const getFactory = (jpex, name, opts) => {
  var _opts$optional;

  if (typeof name !== 'string') {
    throw new Error("Name must be a string, but recevied " + typeof name);
  }

  let factory = jpex.$$resolved[name];

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
const cacheResult = (jpex, name, factory, value, namedParameters) => {
  switch (factory.lifecycle) {
    case 'application':
      factory.resolved = true;
      factory.value = value;
      break;

    case 'class':
      jpex.$$resolved[name] = {
        resolved: true,
        value
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

const resolveOne = (jpex, name, namedParameters, opts, stack) => {
  var _factory$dependencies;

  if (!namedParameters) {
    namedParameters = { ...(opts == null ? void 0 : opts.with)
    };
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


  const factory = getFactory(jpex, name, opts);

  if (!factory) {
    return;
  } // Check if it's already been resolved


  if (factory.resolved) {
    return factory.value;
  } // Work out dependencies


  let args = [];

  if ((_factory$dependencies = factory.dependencies) == null ? void 0 : _factory$dependencies.length) {
    // eslint-disable-next-line no-use-before-define
    args = resolveMany(jpex, factory, namedParameters, opts, stack.concat(name));
  } // Invoke the factory


  const value = factory.fn.apply(jpex, args); // Cache the result

  cacheResult(jpex, name, factory, value, namedParameters);
  return value;
};
const resolveMany = (jpex, definition, namedParameters, opts, stack) => {
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

  const dependencies = [].concat(definition.dependencies);
  const values = dependencies.reduce((value, dependency) => {
    const x = resolveOne(jpex, dependency, namedParameters, opts, stack);
    return value.concat([x]);
  }, []);
  return values;
};

const resolve = (jpex, name, opts) => resolveOne(jpex, name, void 0, opts, []);
const resolveDependencies = (jpex, definition, opts) => {
  return resolveMany(jpex, definition, void 0, opts, []);
};
const isResolved = (jpex, dependency) => {
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
const allResolved = (jpex, dependencies) => {
  return dependencies.every(isResolved.bind(null, jpex));
};

const encase = (jpex, dependencies, fn) => {
  let result;

  const encased = function (...args) {
    /* eslint-disable no-invalid-this */
    if (result && allResolved(jpex, dependencies)) {
      return result.apply(this, args);
    }

    const deps = resolveDependencies(jpex, {
      dependencies
    });
    result = fn.apply(this, deps);
    return result.apply(this, args);
    /* eslint-enable */
  };

  encased.encased = fn;
  return encased;
};

const clearCache = (jpex, names) => {
  names = [].concat(names || []);

  for (const key in jpex.$$factories) {
    if (!names.length || names.indexOf(key) > -1) {
      jpex.$$factories[key].resolved = false;
    }
  }

  for (const key in jpex.$$resolved) {
    if (!names.length || names.indexOf(key) > -1) {
      delete jpex.$$resolved[key];
    }
  }
};

const defaultConfig = {
  lifecycle: 'class',
  precedence: 'active',
  globals: true,
  nodeModules: true,
  optional: false
};

class Jpex {
  constructor(options = {}, parent) {
    _defineProperty(this, "decorate", void 0);

    _defineProperty(this, "$$config", void 0);

    _defineProperty(this, "$$parent", void 0);

    _defineProperty(this, "$$factories", {});

    _defineProperty(this, "$$resolved", {});

    const {
      inherit = true,
      ...config
    } = options;
    this.$$parent = parent;
    this.$$config = { ...defaultConfig,
      ...(inherit ? parent == null ? void 0 : parent.$$config : {}),
      ...config
    };

    if (parent && inherit) {
      this.$$factories = Object.create(parent.$$factories);
    }
  }

  extend(config) {
    return new Jpex(config, this);
  }

  constant(name, obj) {
    return constant(this, name, obj);
  }

  factory(name, deps, fn, opts) {
    return factory(this, name, deps, fn, opts);
  }

  service(name, deps, fn, opts) {
    return service(this, name, deps, fn, opts);
  }

  alias(alias$1, name) {
    return alias(this, alias$1, name);
  }

  resolve(name, opts) {
    return resolve(this, name, opts);
  }

  resolveWith(name, namedParameters, opts) {
    return resolve(this, name, {
      with: namedParameters,
      ...opts
    });
  }

  raw(name) {
    return getFactory(this, name, {}).fn;
  }

  encase(deps, fn) {
    return encase(this, deps, fn);
  }

  clearCache(...names) {
    return clearCache(this, names);
  }

  infer() {
    return '';
  }

}

const jpex = new Jpex();

export default jpex;
export { jpex };
