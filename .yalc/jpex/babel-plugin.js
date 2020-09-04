'use strict';

var path = require('path');
var helperPluginUtils = require('@babel/helper-plugin-utils');
var core = require('@babel/core');

var cache = {};

const isJpexCall = (path, identifier, key) => {
  const callee = path.node.callee;

  if (!core.types.isMemberExpression(callee)) {
    return false;
  } // @ts-ignore


  if (!identifier.includes(callee.object.name)) {
    return false;
  }

  if (Array.isArray(key)) {
    // @ts-ignore
    return key.includes(callee.property.name);
  } // @ts-ignore


  return callee.property.name === key;
};
const getTypeParameter = (path, i = 0) => {
  var _path$node, _path$node$typeParame, _path$node$typeParame2;

  return (_path$node = path.node) == null ? void 0 : (_path$node$typeParame = _path$node.typeParameters) == null ? void 0 : (_path$node$typeParame2 = _path$node$typeParame.params) == null ? void 0 : _path$node$typeParame2[i];
};
const typeSourceVisitor = {
  TSType(path, state) {
    var _parent$id;

    // FIXME: I can't work out what type of node `parent` should be
    const parent = path.parent;
    const parentName = parent == null ? void 0 : (_parent$id = parent.id) == null ? void 0 : _parent$id.name;

    if (parentName !== state.typeName) {
      return;
    }

    const key = state.filename + "/" + state.typeName;

    if (!cache[key]) {
      var _parent$source, _parent$source$value;

      const usePublicPath = state.publicPath && (parent == null ? void 0 : (_parent$source = parent.source) == null ? void 0 : (_parent$source$value = _parent$source.value) == null ? void 0 : _parent$source$value[0]) === '.';
      const value = (usePublicPath ? state.publicPath : state.filename) + "/" + state.typeName;
      cache[key] = value;
    }

    const id = cache[key];
    state.name = id;
  },

  TSInterfaceDeclaration(path, state) {
    if (path.node.id.name !== state.typeName) {
      return;
    } // FIXME: not sure what type of node parent is


    const parent = path.parent;
    const key = state.filename + "/" + state.typeName;

    if (!cache[key]) {
      var _parent$source2, _parent$source2$value;

      const usePublicPath = state.publicPath && (parent == null ? void 0 : (_parent$source2 = parent.source) == null ? void 0 : (_parent$source2$value = _parent$source2.value) == null ? void 0 : _parent$source2$value[0]) === '.';
      const value = (usePublicPath ? state.publicPath : state.filename) + "/" + state.typeName;
      cache[key] = value;
    }

    const id = cache[key];
    state.name = id;
  },

  ImportSpecifier(path$1, state) {
    if (path$1.node.local.name !== state.typeName) {
      return;
    }

    const parent = path$1.parent;
    let source = parent.source.value;

    if (parent.source.value.charAt(0) === '.') {
      source = path.join(path.dirname(state.filename), source);
    }

    const key = source + "/" + path$1.node.imported.name;

    if (!cache[key]) {
      var _parent$source3, _parent$source3$value;

      const usePublicPath = state.publicPath && (parent == null ? void 0 : (_parent$source3 = parent.source) == null ? void 0 : (_parent$source3$value = _parent$source3.value) == null ? void 0 : _parent$source3$value[0]) === '.';
      const value = usePublicPath ? state.publicPath + "/" + path$1.node.imported.name : key;
      cache[key] = value;
    }

    const id = cache[key];
    state.name = id;
  }

};
const getConcreteTypeName = (typeNode, filename, publicPath, programPath) => {
  if (core.types.isTSTypeReference(typeNode)) {
    var _typeNode$typeName;

    // @ts-ignore
    const name = typeNode == null ? void 0 : (_typeNode$typeName = typeNode.typeName) == null ? void 0 : _typeNode$typeName.name;

    if (name == null) {
      return null;
    }

    const state = {
      filename,
      publicPath,
      programPath,
      typeName: name,
      name: null
    };
    programPath.traverse(typeSourceVisitor, state);

    if (state.name) {
      return "type:" + state.name;
    }

    return "type:global:" + name;
  }

  if (core.types.isTSTypeLiteral(typeNode) || core.types.isTSFunctionType(typeNode)) {
    throw new Error('Currently registering with a literal type is not supported');
  }
};
const tsTypeAnnotationVisitor = {
  TSTypeAnnotation(path, state) {
    const name = getConcreteTypeName(path.node.typeAnnotation, state.filename, state.publicPath, state.programPath);
    state.key = name == null ? 'unknown' : name;
  }

};

const getFunctionParams = (path, deps, filename, publicPath, programPath) => {
  [].concat(path.get('params')).forEach(path => {
    const ctx = {
      key: path.node.name,
      filename,
      programPath,
      publicPath
    };
    path.traverse(tsTypeAnnotationVisitor, ctx);
    deps.push(ctx.key);
  });
};

const classConstructorVisitor = {
  ClassMethod(path, state) {
    const {
      deps,
      filename,
      programPath,
      publicPath
    } = state; // @ts-ignore

    if (path.node.key.name === 'constructor') {
      getFunctionParams(path, deps, filename, publicPath, programPath);
    }
  }

};
const linkedVariableVisitor = {
  Class(path, state) {
    var _path$node$id;

    const {
      deps,
      name,
      filename,
      programPath,
      publicPath
    } = state;

    if (((_path$node$id = path.node.id) == null ? void 0 : _path$node$id.name) === name) {
      path.traverse(classConstructorVisitor, {
        deps,
        filename,
        programPath,
        publicPath
      });
    }
  },

  ArrowFunctionExpression(path, state) {
    var _parent$id2;

    const {
      deps,
      name,
      filename,
      programPath,
      publicPath
    } = state;
    const {
      parent
    } = path; // @ts-ignore

    if ((parent == null ? void 0 : (_parent$id2 = parent.id) == null ? void 0 : _parent$id2.name) === name) {
      getFunctionParams(path, deps, filename, publicPath, programPath);
    }
  },

  FunctionDeclaration(path, state) {
    const {
      deps,
      name,
      filename,
      programPath,
      publicPath
    } = state;
    const {
      node
    } = path;

    if (node && node.id && node.id.name === name) {
      getFunctionParams(path, deps, filename, publicPath, programPath);
    }
  },

  FunctionExpression(path, state) {
    var _parent$id3;

    const {
      deps,
      name,
      filename,
      programPath,
      publicPath
    } = state;
    const {
      parent
    } = path; // @ts-ignore

    if ((parent == null ? void 0 : (_parent$id3 = parent.id) == null ? void 0 : _parent$id3.name) === name) {
      getFunctionParams(path, deps, filename, publicPath, programPath);
    }
  }

};
const extractFunctionParameterTypes = (programPath, arg, filename, publicPath) => {
  const deps = [];
  const ctx = {
    deps,
    programPath,
    filename,
    publicPath
  };

  if (core.types.isIdentifier(arg)) {
    programPath.traverse(linkedVariableVisitor, Object.assign({
      name: arg.node.name
    }, ctx));
  } else if (core.types.isClass(arg)) {
    arg.traverse(classConstructorVisitor, ctx);
  } else if (core.types.isArrowFunctionExpression(arg)) {
    getFunctionParams(arg, deps, filename, publicPath, programPath);
  } else if (core.types.isFunctionExpression(arg)) {
    getFunctionParams(arg, deps, filename, publicPath, programPath);
  }

  return deps;
};

const FACTORY_METHODS = ['factory', 'service', 'constant'];

const factories = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const callee = path.node.callee;
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, FACTORY_METHODS)) {
    return;
  }

  if (args.length > 2) {
    return;
  } // do we have an interface to use as the registrant name?
  // if there is only 1 arg then we can't possibly have been given the name
  // if the first arg isn't a string, then we also don't have a name


  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    args.unshift(core.types.stringLiteral(name));
  } // do we need to infer the dependencies?
  // ignore constants as there are no dependencies
  // if the second parameter isn't an array of dependencies, it means it's inferred


  if (callee.property.name !== 'constant') {
    const arg = path.get('arguments.1');
    const deps = extractFunctionParameterTypes(programPath, arg, filename, publicPath);
    path.node.arguments.splice(1, 0, core.types.arrayExpression(deps.map(dep => core.types.stringLiteral(dep))));
  }
};

const resolve = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'resolve')) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    args.unshift(core.types.stringLiteral(name));
  } else if (core.types.isTSTypeLiteral(type) || core.types.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  }
};

const resolveWith = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'resolveWith')) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    args.unshift(core.types.stringLiteral(name));
  } else if (core.types.isTSTypeLiteral(type) || core.types.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  } else {
    return;
  }

  if (!core.types.isArrayExpression(args[1])) {
    return;
  }

  const namedDependencies = [];
  let i = 1;
  let namedType = getTypeParameter(path, i);

  while (namedType) {
    const name = getConcreteTypeName(namedType, filename, publicPath, programPath);

    if (name != null) {
      const value = args[1].elements[i - 1];
      const key = core.types.stringLiteral(name); // @ts-ignore

      const prop = core.types.objectProperty(key, value);
      namedDependencies.push(prop);
    } else if (core.types.isTSTypeLiteral(type) || core.types.isTSFunctionType(type)) {
      throw new Error('Currently resolving with a literal type is not supported');
    } // eslint-disable-next-line no-plusplus


    namedType = getTypeParameter(path, ++i);
  }

  args.splice(1, 1, core.types.objectExpression(namedDependencies));
};

const alias = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'alias')) {
    return;
  }

  if (args.length === 2) {
    return;
  } // eslint-disable-next-line no-plusplus


  for (let x = 0; x < 2; x++) {
    const type = getTypeParameter(path, x);
    const name = getConcreteTypeName(type, filename, publicPath, programPath);

    if (name != null) {
      args.unshift(core.types.stringLiteral(name));
    }
  }
};

const encase = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'encase')) {
    return;
  }

  if (args.length !== 1) {
    return;
  }

  const arg = path.get('arguments.0');
  const deps = extractFunctionParameterTypes(programPath, arg, filename, publicPath);
  path.node.arguments.splice(0, 0, core.types.arrayExpression(deps.map(dep => core.types.stringLiteral(dep))));
};

const infer = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  if (!isJpexCall(path, identifier, 'infer')) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    path.replaceWith(core.types.stringLiteral(name));
  }
};

const raw = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'raw')) {
    return;
  }

  if (args.length) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    args.unshift(core.types.stringLiteral(name));
  } else if (core.types.isTSTypeLiteral(type) || core.types.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  }
};

const importVisitor = {
  ImportSpecifier(path, state) {
    if (path.node.imported.name === 'useResolve') {
      if (path.node.local.name === 'useResolve') {
        // @ts-ignore
        if (path.parent.source.value === 'react-jpex') {
          state.found = true;
        }
      }
    }
  }

};

const useResolve = (programPath, path, {
  filename,
  publicPath
}) => {
  const callee = path.node.callee;
  const args = path.node.arguments;

  if ((callee == null ? void 0 : callee.name) !== 'useResolve') {
    return;
  }

  const state = {
    found: false
  };
  programPath.traverse(importVisitor, state);

  if (!state.found) {
    return;
  }

  if (args.length > 0 && core.types.isStringLiteral(args[0])) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, programPath);

  if (name != null) {
    args.unshift(core.types.stringLiteral(name));
  } else if (core.types.isTSTypeLiteral(type) || core.types.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  }
};

const clearCache = (programPath, path, {
  identifier,
  filename,
  publicPath
}) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, 'clearCache')) {
    return;
  }

  if (args.length === 0) {
    const type = getTypeParameter(path);
    const name = getConcreteTypeName(type, filename, publicPath, programPath);

    if (name != null) {
      args.unshift(core.types.stringLiteral(name));
    }
  }
};

const mainVisitor = {
  CallExpression(path$1, state) {
    const {
      programPath
    } = this;
    let {
      opts: {
        identifier = 'jpex',
        publicPath
      } = {}
    } = state;
    const filename = this.filename.split('.').slice(0, -1).join('.').replace(process.cwd(), '');
    identifier = [].concat(identifier);

    if (publicPath === true) {
      publicPath = require(path.resolve('./package.json')).name;
    }

    const opts = {
      identifier,
      filename,
      publicPath: publicPath
    };
    factories(programPath, path$1, opts);
    resolve(programPath, path$1, opts);
    resolveWith(programPath, path$1, opts);
    encase(programPath, path$1, opts);
    alias(programPath, path$1, opts);
    infer(programPath, path$1, opts);
    raw(programPath, path$1, opts);
    clearCache(programPath, path$1, opts);
    useResolve(programPath, path$1, opts);
  }

};
var index = helperPluginUtils.declare(api => {
  api.assertVersion(7);
  return {
    visitor: {
      Program(programPath, state) {
        programPath.traverse(mainVisitor, {
          programPath,
          opts: state.opts,
          filename: state.file.opts.filename
        });
      }

    }
  };
});

module.exports = index;
