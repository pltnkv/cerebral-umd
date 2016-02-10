(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("cerebral", [], factory);
	else if(typeof exports === 'object')
		exports["cerebral"] = factory();
	else
		root["cerebral"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var cerebral = __webpack_require__(1);
	exports['default'] = cerebral;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CreateSignalFactory = __webpack_require__(2);
	var CreateRegisterModules = __webpack_require__(11);
	var Compute = __webpack_require__(14);
	var EventEmitter = __webpack_require__(15).EventEmitter;

	var Recorder = __webpack_require__(16);

	var Controller = function Controller(Model, services) {
	  if (services) {
	    console.warn('Passing services to controller is DEPRECATED. Please add them to controller with controller.services({})');
	  }

	  var controller = new EventEmitter();
	  var model = Model(controller);
	  var compute = Compute(model);
	  var signals = {};
	  var modules = {};
	  services = services || {};

	  var signalFactory = CreateSignalFactory(controller, model, services, compute, modules);
	  var signal = function signal() {
	    var signalNamePath = arguments[0].split('.');
	    var signalName = signalNamePath.pop();
	    var signalMethodPath = signals;
	    while (signalNamePath.length) {
	      var pathName = signalNamePath.shift();
	      signalMethodPath = signalMethodPath[pathName] = signalMethodPath[pathName] || {};
	    }
	    var signal = signalMethodPath[signalName] = signalFactory.apply(null, arguments);
	    return signal;
	  };
	  var service = function service(name, _service) {
	    var serviceNamePath = name.split('.');
	    var serviceName = serviceNamePath.pop();
	    var serviceMethodPath = services;
	    while (serviceNamePath.length) {
	      var pathName = serviceNamePath.shift();
	      serviceMethodPath = serviceMethodPath[pathName] = serviceMethodPath[pathName] || {};
	    }
	    serviceMethodPath[serviceName] = _service;
	    return _service;
	  };

	  controller.signal = function () {
	    console.warn('Cerebral: controller.signal() is DEPRECATED. Please use controller.addSignals() instead');
	    signal.apply(null, arguments);
	  };
	  controller.signalSync = function () {
	    console.warn('Cerebral: controller.signalSync() is DEPRECATED. Please use controller.addSignals({mySignal: {chain: [], sync: true}}) instead');
	    var defaultOptions = arguments[2] || {};
	    defaultOptions.isSync = true;
	    return signal(arguments[0], arguments[1], defaultOptions);
	  };

	  controller.getSignals = function () {
	    return signals;
	  };
	  controller.getServices = function () {
	    return services;
	  };
	  controller.get = function () {
	    if (typeof arguments[0] === 'function') {
	      return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0]);
	    }
	    var path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
	    return model.accessors.get(path);
	  };
	  controller.logModel = function () {
	    return model.logModel();
	  };
	  controller.getModules = function () {
	    return modules;
	  };

	  controller.addModules = CreateRegisterModules(controller, model, modules);
	  controller.modules = function () {
	    console.warn('Cerebral: controller.modules() is DEPRECATED. Please use controller.addModules() instead');
	    controller.addModules.apply(controller, arguments);
	  };

	  controller.addSignals = function (signals, options) {
	    Object.keys(signals).forEach(function (key) {
	      if (signals[key].chain) {
	        options = Object.keys(signals[key]).reduce(function (options, configKey) {
	          if (configKey !== 'chain') {
	            options[configKey] = signals[key][configKey];
	          }
	          if (configKey === 'sync') {
	            options.isSync = signals[key][configKey];
	          }
	          return options;
	        }, options || {});
	        signal(key, signals[key].chain, options);
	      } else {
	        signal(key, signals[key], options);
	      }
	    });
	  };
	  controller.signals = function () {
	    console.warn('Cerebral: controller.signals() is DEPRECATED. Please use controller.addSignals() instead');
	    controller.addSignals.apply(controller, arguments);
	  };
	  controller.signalsSync = function (signals, options) {
	    console.warn('Cerebral: controller.signalsSync() is DEPRECATED. Please use controller.addSignals({mySignal: {chain: [], sync: true}}) instead');
	    Object.keys(signals).forEach(function (key) {
	      options = options || {};
	      options.isSync = true;
	      signal(key, signals[key], options);
	    });
	  };
	  controller.addServices = function (newServices) {
	    Object.keys(newServices).forEach(function (key) {
	      service(key, newServices[key]);
	    });
	    return controller.getServices();
	  };
	  controller.services = function (newServices) {
	    console.warn('Cerebral: controller.services() is DEPRECATED. Please use controller.addServices() instead');
	    controller.addServices(newServices);
	  };

	  // emulate loading recorder
	  Recorder()({}, controller);

	  return controller;
	};

	Controller.ServerController = function (state) {
	  var model = {
	    accessors: {
	      get: function get(path) {
	        path = path.slice();
	        var key = path.pop();
	        var grabbedState = state;
	        while (path.length) {
	          grabbedState = grabbedState[path.shift()];
	        }
	        return grabbedState[key];
	      }
	    }
	  };
	  var compute = Compute(model);

	  return {
	    isServer: true,
	    get: function get(path) {
	      if (typeof arguments[0] === 'function') {
	        return compute.has(arguments[0]) ? compute.getComputedValue(arguments[0]) : compute.register(arguments[0]);
	      }
	      path = !arguments.length ? [] : typeof arguments[0] === 'string' ? [].slice.call(arguments) : arguments[0];
	      return model.accessors.get(path);
	    }
	  };
	};

	module.exports = Controller;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var utils = __webpack_require__(3);
	var createActionArgs = __webpack_require__(6);
	var createNext = __webpack_require__(7);
	var analyze = __webpack_require__(8);
	var staticTree = __webpack_require__(9);
	var createModulesArg = __webpack_require__(10);

	var batchedSignals = [];
	var pending = false;
	var requestAnimationFrame = global.requestAnimationFrame || function (cb) {
	  setTimeout(cb, 0);
	};

	module.exports = function (controller, model, services, compute, modules) {
	  return function () {
	    var args = [].slice.call(arguments);
	    var signalName = args.shift();
	    var defaultOptions = args[1] || {};
	    defaultOptions.modulePath = defaultOptions.modulePath || [];

	    var chain = args[0] || [];

	    if (utils.isDeveloping()) {
	      analyze(signalName, chain);
	    }

	    var signalChain = function signalChain(payload, options) {
	      options = options || {};

	      var tree = staticTree(signalChain.chain);
	      var actions = tree.actions;

	      var signal = {
	        name: signalName,
	        start: null,
	        isSync: defaultOptions.isSync || options.isSync,
	        isRouted: options.isRouted || false, // will be removed
	        isExecuting: false,
	        isPrevented: false,
	        branches: tree.branches,
	        options: options,
	        duration: 0,
	        input: payload,
	        preventSignalRun: function preventSignalRun() {
	          signal.isExecuting = false;
	          signal.isPrevented = true;
	        }
	      };

	      var isPredefinedExecution = false;
	      if (options.branches) {
	        signal.isSync = true;
	        signal.branches = options.branches;
	        isPredefinedExecution = true;
	        controller.emit('predefinedSignal', { signal: signal });
	      } else {
	        controller.emit('signalTrigger', { signal: signal });
	      }

	      if (signal.isPrevented) {
	        return;
	      }

	      var runSignal = function runSignal() {
	        // Accumulate the args in one object that will be passed
	        // to each action
	        var signalArgs = payload || {};

	        // Test payload
	        if (utils.isDeveloping()) {
	          try {
	            JSON.stringify(signalArgs);
	          } catch (e) {
	            console.log('Not serializable', signalArgs);
	            throw new Error('Cerebral - Could not serialize input to signal. Please check signal ' + signalName);
	          }
	        }

	        signal.start = Date.now();
	        signal.isExecuting = true;

	        if (!isPredefinedExecution) {
	          controller.emit('signalStart', { signal: signal });
	        }

	        if (signal.isPrevented) {
	          console.log('Cerebral - Preventing signal run after signalStart is deprecated. Use `signalTrigger` event instead.');
	          controller.emit('signalEnd', { signal: signal });
	          return;
	        }

	        var runBranch = function runBranch(_x, _x2, _x3) {
	          var _again = true;

	          _function: while (_again) {
	            var branch = _x,
	                index = _x2,
	                start = _x3;
	            _again = false;

	            var currentBranch = branch[index];
	            if (!currentBranch && branch === signal.branches && !isPredefinedExecution) {
	              // Might not be any actions passed
	              if (branch[index - 1]) {
	                branch[index - 1].duration = Date.now() - start;
	              }

	              signal.isExecuting = false;
	              controller.emit('signalEnd', { signal: signal });
	              controller.emit('change', { signal: signal });
	              return;
	            }

	            if (!currentBranch) {
	              return;
	            }

	            if (Array.isArray(currentBranch)) {
	              if (isPredefinedExecution) {
	                currentBranch.forEach(function (action) {
	                  // If any signals has run with this action, run them
	                  // as well
	                  if (action.signals) {
	                    action.signals.forEach(function (signal) {
	                      var signalMethodPath = signal.name.split('.').reduce(function (signals, key) {
	                        return signals[key];
	                      }, controller.getSignals());
	                      signalMethodPath(signal.input, { branches: signal.branches });
	                    });
	                  }

	                  utils.merge(signalArgs, action.output);

	                  if (action.outputPath) {
	                    runBranch(action.outputs[action.outputPath], 0);
	                  }
	                });

	                runBranch(branch, index + 1);
	              } else {
	                var promises = currentBranch.map(function (action) {
	                  controller.emit('actionStart', { action: action, signal: signal });
	                  var actionFunc = actions[action.actionIndex];
	                  var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs;
	                  var actionArgs = createActionArgs.async(action, inputArg, model, compute, services, Object.keys(modules));

	                  if (utils.isDeveloping() && actionFunc.input) {
	                    utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg);
	                  }

	                  action.isExecuting = true;
	                  action.input = utils.merge({}, inputArg);
	                  var next = createNext.async(actionFunc, signal.name);
	                  var modulesArg = createModulesArg(modules, actionArgs[1], actionArgs[2]);
	                  var actionArg = {
	                    input: actionArgs[0],
	                    state: actionArgs[1],
	                    output: next.fn,
	                    services: actionArgs[2],
	                    modules: modulesArg,
	                    module: defaultOptions.modulePath.reduce(function (modules, key) {
	                      return modules[key];
	                    }, modulesArg)
	                  };

	                  if (utils.isDeveloping()) {
	                    try {
	                      actionFunc(actionArg);
	                    } catch (e) {
	                      action.error = {
	                        name: e.name,
	                        message: e.message,
	                        stack: actionFunc.toString()
	                      };
	                      controller.emit('signalError', { action: action, signal: signal });
	                      controller.emit('change', { signal: signal });
	                      throw e;
	                    }
	                  } else {
	                    actionFunc(actionArg);
	                  }

	                  return next.promise.then(function (result) {
	                    action.hasExecuted = true;
	                    action.isExecuting = false;
	                    action.output = utils.merge({}, result.arg);
	                    utils.merge(signalArgs, result.arg);

	                    controller.emit('actionEnd', { action: action, signal: signal });
	                    controller.emit('change', { signal: signal });

	                    if (result.path) {
	                      action.outputPath = result.path;
	                      var branchResult = runBranch(action.outputs[result.path], 0, Date.now());
	                      return branchResult;
	                    }
	                  });
	                });
	                controller.emit('change', { signal: signal });
	                return Promise.all(promises).then(function () {
	                  return runBranch(branch, index + 1, Date.now());
	                })['catch'](function (error) {
	                  // We just throw any unhandled errors
	                  controller.emit('error', error);
	                  throw error;
	                });
	              }
	            } else {
	              var action = currentBranch;
	              if (isPredefinedExecution) {
	                action.mutations.forEach(function (mutation) {
	                  model.mutators[mutation.name].apply(null, [mutation.path.slice()].concat(mutation.args));
	                });

	                if (action.outputPath) {
	                  runBranch(action.outputs[action.outputPath], 0);
	                }

	                runBranch(branch, index + 1);
	              } else {
	                controller.emit('actionStart', { action: action, signal: signal });

	                var actionFunc = actions[action.actionIndex];
	                var inputArg = actionFunc.defaultInput ? utils.merge({}, actionFunc.defaultInput, signalArgs) : signalArgs;
	                var actionArgs = createActionArgs.sync(action, inputArg, model, compute, services, Object.keys(modules));

	                if (utils.isDeveloping() && actionFunc.input) {
	                  utils.verifyInput(action.name, signal.name, actionFunc.input, inputArg);
	                }

	                action.mutations = []; // Reset mutations array
	                action.input = utils.merge({}, inputArg);

	                var next = createNext.sync(actionFunc, signal.name);
	                var modulesArg = createModulesArg(modules, actionArgs[1], actionArgs[2]);

	                var actionArg = {
	                  input: actionArgs[0],
	                  state: actionArgs[1],
	                  output: next,
	                  services: actionArgs[2],
	                  modules: modulesArg,
	                  module: defaultOptions.modulePath.reduce(function (exportedModule, key) {
	                    return exportedModule[key];
	                  }, modulesArg)
	                };

	                if (utils.isDeveloping()) {
	                  try {
	                    actionFunc(actionArg);
	                  } catch (e) {
	                    action.error = {
	                      name: e.name,
	                      message: e.message,
	                      stack: e.stack
	                    };
	                    controller.emit('signalError', { action: action, signal: signal });
	                    controller.emit('change', { signal: signal });
	                    throw e;
	                  }
	                } else {
	                  actionFunc(actionArg);
	                }

	                // TODO: Also add input here

	                var result = next._result || {};
	                utils.merge(signalArgs, result.arg);

	                action.isExecuting = false;
	                action.hasExecuted = true;
	                action.output = utils.merge({}, result.arg);

	                if (!branch[index + 1] || Array.isArray(branch[index + 1])) {
	                  action.duration = Date.now() - start;
	                }

	                if (result.path) {
	                  action.outputPath = result.path;
	                  var branchResult = runBranch(action.outputs[result.path], 0, start);
	                  if (branchResult && branchResult.then) {
	                    return branchResult.then(function () {
	                      return runBranch(branch, index + 1, Date.now());
	                    });
	                  } else {
	                    _x = branch;
	                    _x2 = index + 1;
	                    _x3 = start;
	                    _again = true;
	                    currentBranch = promises = action = actionFunc = inputArg = actionArgs = next = modulesArg = actionArg = result = branchResult = undefined;
	                    continue _function;
	                  }
	                } else if (result.then) {
	                  return result.then(function () {
	                    controller.emit('actionEnd', { action: action, signal: signal });

	                    return runBranch(branch, index + 1, start);
	                  });
	                } else {
	                  controller.emit('actionEnd', { action: action, signal: signal });

	                  _x = branch;
	                  _x2 = index + 1;
	                  _x3 = start;
	                  _again = true;
	                  currentBranch = promises = action = actionFunc = inputArg = actionArgs = next = modulesArg = actionArg = result = branchResult = undefined;
	                  continue _function;
	                }
	              }
	            }
	          }
	        };

	        runBranch(signal.branches, 0, Date.now());

	        return;
	      };

	      if (signal.isSync) {
	        runSignal();
	      } else {
	        batchedSignals.push(runSignal);

	        if (!pending) {
	          requestAnimationFrame(function () {
	            while (batchedSignals.length) {
	              batchedSignals.shift()();
	            }
	            pending = false;
	          });

	          pending = true;
	        }
	      }
	    };
	    signalChain.chain = chain;
	    signalChain.sync = function (payload) {
	      signalChain(payload, { isSync: true });
	    };
	    signalChain.signalName = signalName;

	    return signalChain;
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var types = __webpack_require__(5);

	module.exports = {
	  getFunctionName: function getFunctionName(fun) {
	    var ret = fun.toString();
	    ret = ret.substr('function '.length);
	    ret = ret.substr(0, ret.indexOf('('));
	    return ret;
	  },
	  merge: function merge(target, source) {
	    source = source || {};
	    return Object.keys(source).reduce(function (target, key) {
	      target[key] = source[key];
	      return target;
	    }, target);
	  },
	  hasLocalStorage: function hasLocalStorage() {
	    return typeof global.localStorage !== 'undefined';
	  },
	  isPathObject: function isPathObject(obj) {
	    return obj && (obj.resolve || obj.reject);
	  },
	  debounce: function debounce(func, wait, immediate) {
	    var timeout;
	    return function () {
	      var context = this;
	      var args = arguments;
	      var later = function later() {
	        timeout = null;
	        if (!immediate) func.apply(context, args);
	      };
	      var callNow = immediate && !timeout;
	      clearTimeout(timeout);
	      timeout = setTimeout(later, wait);
	      if (callNow) func.apply(context, args);
	    };
	  },
	  isAction: function isAction(action) {
	    return typeof action === 'function';
	  },
	  isDeveloping: function isDeveloping() {
	    return typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
	  },
	  verifyInput: function verifyInput(actionName, signalName, input, signalArgs) {
	    Object.keys(input).forEach(function (key) {
	      if (typeof signalArgs[key] === 'undefined' || !types(input[key], signalArgs[key])) {
	        throw new Error(['Cerebral: You are giving the wrong input to the action "' + actionName + '" ' + 'in signal "' + signalName + '". Check the following prop: "' + key + '"'].join(''));
	      }
	    });
	  },
	  extractMatchingPathFunctions: function extractMatchingPathFunctions(source, target) {
	    var incompatible = false;
	    var traverse = function traverse(obj, currentTarget, path, results) {
	      if (incompatible) {
	        return incompatible;
	      }

	      if (typeof obj === 'function') {
	        results[path.join('.')] = obj;
	      } else if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
	        for (var key in obj) {
	          if (!(key in currentTarget)) {
	            incompatible = path.slice().concat(key);
	            return incompatible;
	          } else {
	            path.push(key);
	            traverse(obj[key], currentTarget[key], path, results);
	            path.pop(key);
	          }
	        }
	      }
	      return incompatible || results;
	    };

	    return traverse(source, target, [], {});
	  },
	  setDeep: function setDeep(object, stringPath, value) {
	    var path = stringPath.split('.');
	    var setKey = path.pop();
	    while (path.length) {
	      var key = path.shift();
	      object = object[key] = object[key] || {};
	    }
	    object[setKey] = object[setKey] ? Object.keys(object[setKey]).reduce(function (value, key) {
	      value[key] = object[setKey][key];
	      return value;
	    }, value) : value;
	    return value;
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	// shim for using process in browser

	'use strict';

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (type, value) {
	  var types = [String, Number, Array, Object, Boolean];

	  if (type === null && value !== null) {
	    return false;
	  }

	  if (type === undefined && value !== undefined) {
	    return false;
	  }

	  if (type === String && typeof value !== 'string') {
	    return false;
	  }

	  if (type === Number && typeof value !== 'number') {
	    return false;
	  }

	  if (type === Array && !Array.isArray(value)) {
	    return false;
	  }

	  if (type === Object && !(typeof value === 'object' && !Array.isArray(value) && value !== null)) {
	    return false;
	  }

	  if (type === Boolean && typeof value !== 'boolean') {
	    return false;
	  }

	  if (types.indexOf(type) === -1 && typeof type === 'function') {
	    return type(value);
	  }

	  return true;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var createStateArg = function createStateArg(action, model, isAsync, compute) {
	  var state = Object.keys(model.accessors || {}).reduce(function (state, accessor) {
	    state[accessor] = function () {
	      var args = [].slice.call(arguments);
	      var path = [];
	      if (args[0] && Array.isArray(args[0])) {
	        path = args.shift();
	      } else if (args[0] && typeof args[0] === 'string') {
	        path = args.shift().split('.');
	      }
	      if (accessor === 'get' && typeof arguments[0] === 'function') {
	        return compute.getComputedValue(arguments[0]);
	      }
	      return model.accessors[accessor].apply(null, [path].concat(args));
	    };
	    return state;
	  }, {});
	  Object.keys(model.mutators || {}).reduce(function (state, mutator) {
	    state[mutator] = function () {
	      if (isAsync) {
	        throw new Error('Cerebral: You can not mutate state in async actions. Output values and set them with a sync action');
	      }
	      var path = [];
	      var args = [].slice.call(arguments);
	      if (Array.isArray(args[0])) {
	        path = args.shift();
	      } else if (typeof args[0] === 'string') {
	        path = [args.shift()];
	      }
	      action.mutations.push({
	        name: mutator,
	        path: path.slice(),
	        args: args
	      });
	      return model.mutators[mutator].apply(null, [path.slice()].concat(args));
	    };
	    return state;
	  }, state);

	  return state;
	};

	var createServicesArg = function createServicesArg(action, services, moduleKeys) {
	  var path = [];

	  var convertServices = function convertServices(moduleServices) {
	    return Object.keys(moduleServices).reduce(function (newModuleServices, key) {
	      path.push(key);
	      if (typeof moduleServices[key] === 'function') {
	        var servicePath = path.slice();
	        var method = servicePath.pop();
	        newModuleServices[key] = function () {
	          action.serviceCalls.push({
	            name: servicePath.join('.'),
	            method: method,
	            args: [].slice.call(arguments)
	          });
	          return moduleServices[key].apply(moduleServices[key], arguments);
	        };
	      } else if (typeof moduleServices[key] === 'object' && !Array.isArray(moduleServices[key]) && moduleServices[key] !== null) {
	        newModuleServices[key] = convertServices(moduleServices[key]);
	      } else {
	        newModuleServices[key] = moduleServices[key];
	      }
	      path.pop(key);
	      return newModuleServices;
	    }, {});
	  };

	  return Object.keys(services).reduce(function (newServices, key) {
	    path.push(key);
	    newServices[key] = convertServices(services[key], key);
	    path.pop(key);
	    return newServices;
	  }, {});
	};

	module.exports = {
	  sync: function sync(action, signalArgs, model, compute, services, moduleKeys) {
	    return [signalArgs, createStateArg(action, model, false, compute), createServicesArg(action, services, moduleKeys)];
	  },
	  async: function async(action, signalArgs, model, compute, services, moduleKeys) {
	    return [signalArgs, createStateArg(action, model, true, compute), createServicesArg(action, services, moduleKeys)];
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);
	var types = __webpack_require__(5);

	var validateOutput = function validateOutput(action, path, arg, signalName) {
	  if (!action.output && !action.outputs || Array.isArray(action.outputs)) {
	    return;
	  }

	  var checkers = action.output || action.outputs[path || action.defaultOutput];

	  if (checkers === undefined && arg === undefined) {
	    return;
	  }

	  Object.keys(checkers).forEach(function (key) {
	    if (!types(checkers[key], arg[key])) {
	      throw new Error(['Cerebral: There is a wrong output of action "' + utils.getFunctionName(action) + '" ' + 'in signal "' + signalName + '". Check the following prop: "' + key + '"'].join(''));
	    }
	  });
	};

	var createNextFunction = function createNextFunction(action, signalName, resolver) {
	  var next = function next() {
	    if (next.hasRun) {
	      throw new Error('Cerebral - You are running an async output on a synchronous action in ' + signalName + '. The action is ' + action.name + '. Either put it in an array or make sure the output is synchronous');
	    }

	    var path = typeof arguments[0] === 'string' ? arguments[0] : null;
	    var arg = path ? arguments[1] : arguments[0];

	    // Test payload
	    if (utils.isDeveloping()) {
	      try {
	        JSON.stringify(arg);
	      } catch (e) {
	        console.log('Not serializable', arg);
	        throw new Error('Cerebral - Could not serialize output. Please check signal ' + signalName + ' and action ' + action.name);
	      }
	    }

	    if (!path && !action.defaultOutput && action.outputs) {
	      throw new Error(['Cerebral: There is a wrong output of action "' + utils.getFunctionName(action) + '" ' + 'in signal "' + signalName + '". Set defaultOutput or use one of outputs ' + JSON.stringify(Object.keys(action.output || action.outputs))].join(''));
	    }

	    if (utils.isDeveloping()) {
	      validateOutput(action, path, arg, signalName);
	    }

	    // This is where I verify path and types
	    var result = {
	      path: path || action.defaultOutput,
	      arg: arg
	    };

	    if (resolver) {
	      resolver(result);
	    } else {
	      next._result = result;
	    }
	  };
	  return next;
	};

	var addOutputs = function addOutputs(action, next) {
	  if (!action.outputs) {
	    next.success = next.bind(null, 'success');
	    next.error = next.bind(null, 'error');
	  } else if (Array.isArray(action.outputs)) {
	    action.outputs.forEach(function (key) {
	      next[key] = next.bind(null, key);
	    });
	  } else {
	    Object.keys(action.outputs).forEach(function (key) {
	      next[key] = next.bind(null, key);
	    });
	  }
	};

	module.exports = {
	  sync: function sync(action, signalName) {
	    var next = createNextFunction(action, signalName);
	    addOutputs(action, next);

	    if (utils.isDeveloping()) {
	      setTimeout(function () {
	        next.hasRun = true;
	      }, 0);
	    }

	    return next;
	  },
	  async: function async(action, signalName) {
	    var resolver = null;
	    var promise = new Promise(function (resolve) {
	      resolver = resolve;
	    });
	    var next = createNextFunction(action, signalName, resolver);
	    addOutputs(action, next);
	    return {
	      fn: next,
	      promise: promise
	    };
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);

	module.exports = function (signalName, actions) {
	  var traverse = function traverse(actions, parentActions, parentIndex) {
	    actions.forEach(function (action, index) {
	      var nextPaths;

	      if (typeof action === 'undefined') {
	        throw new Error(['Cerebral: Action number "' + index + '" in signal "' + signalName + '" does not exist. Check that you have spelled it correctly!'].join(''));
	      }

	      if (Array.isArray(action)) {
	        traverse(action, actions, index);
	      } else {
	        nextPaths = actions[index + 1];

	        if (action.output && (parentActions && typeof nextPaths === 'function' || !parentActions && (typeof nextPaths !== 'function' || !nextPaths) || parentActions && typeof parentActions[parentIndex + 1] !== 'function')) {
	          throw new Error(['Cerebral: The action "' + utils.getFunctionName(action) + '" in signal "' + signalName + '" has an output definition, but there is ' + 'no action to receive it. ' + (nextPaths ? 'But there are ' + JSON.stringify(Object.keys(nextPaths)) + ' paths, should it be outputs?' : '')].join(''));
	        } else if (action.outputs && (!nextPaths || typeof nextPaths === 'function')) {
	          throw new Error(['Cerebral: The action "' + utils.getFunctionName(action) + '" in signal "' + signalName + '" has an output value. ' + 'There should be these paths: ' + JSON.stringify(Array.isArray(action.outputs) ? action.outputs : Object.keys(action.outputs))].join(''));
	        } else if (Array.isArray(action.outputs)) {
	          nextPaths = actions[index + 1];

	          action.outputs.forEach(function (output) {
	            if (!Array.isArray(nextPaths[output])) {
	              throw new Error(['Cerebral: The action "' + utils.getFunctionName(action) + '" in signal "' + signalName + '" can not find path to its "' + output + '" output'].join(''));
	            }
	          });
	        } else if (action.outputs) {
	          Object.keys(action.outputs).forEach(function (output) {
	            if (!Array.isArray(nextPaths[output])) {
	              throw new Error(['Cerebral: The action "' + utils.getFunctionName(action) + '" in signal "' + signalName + '" can not find path to its "' + output + '" output'].join(''));
	            }
	          });
	        } else if (!Array.isArray(action) && typeof action === 'object' && action !== null) {
	          var prevAction = actions[index - 1];
	          Object.keys(action).forEach(function (key) {
	            if (!Array.isArray(action[key])) {
	              throw new Error(['Cerebral: The paths for action "' + utils.getFunctionName(prevAction) + '" in signal "' + signalName + '" are not valid. They have to be an array"'].join(''));
	            }
	          });
	        }
	      }
	    });
	  };
	  traverse(actions);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);

	var traverse = function traverse(item, parentItem, path, actions, isSync) {
	  if (Array.isArray(item)) {
	    item = item.slice(); // Will do some splicing, so make sure not messing up original array
	    isSync = !isSync;
	    return item.map(function (subItem, index) {
	      path.push(index);
	      var result = traverse(subItem, item, path, actions, isSync);
	      path.pop();
	      return result;
	    }).filter(function (action) {
	      // Objects becomes null
	      return !!action;
	    });
	  } else if (typeof item === 'function') {
	    var action = {
	      name: item.displayName || utils.getFunctionName(item),
	      input: {},
	      output: null,
	      duration: 0,
	      mutations: [],
	      serviceCalls: [],
	      isAsync: !isSync,
	      outputPath: null,
	      isExecuting: false,
	      hasExecuted: false,
	      path: path.slice(),
	      outputs: null,
	      actionIndex: actions.indexOf(item) === -1 ? actions.push(item) - 1 : actions.indexOf(item)
	    };
	    var nextItem = parentItem[parentItem.indexOf(item) + 1];
	    if (!Array.isArray(nextItem) && typeof nextItem === 'object') {
	      parentItem.splice(parentItem.indexOf(nextItem), 1);
	      action.outputs = Object.keys(nextItem).reduce(function (paths, key) {
	        path = path.concat('outputs', key);
	        paths[key] = traverse(nextItem[key], parentItem, path, actions, false);
	        path.pop();
	        path.pop();
	        return paths;
	      }, {});
	    }
	    return action;
	  }
	};

	module.exports = function (signals) {
	  var actions = [];
	  var branches = traverse(signals, [], [], actions, false);
	  return {
	    branches: branches,
	    actions: actions
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);

	module.exports = function (modules, state, services) {
	  var modulesArg = {};
	  Object.keys(modules).forEach(function (key) {
	    var path = modules[key].path;
	    var module = {
	      meta: modules[key].meta
	    };

	    module.state = Object.keys(state).reduce(function (module, key) {
	      module[key] = function () {
	        var args = [].slice.call(arguments);
	        var statePath = path;
	        if (args[0] && Array.isArray(args[0])) {
	          statePath = statePath.concat(args.shift());
	        } else if (args[0] && typeof args[0] === 'string') {
	          statePath = statePath.concat(args.shift().split('.'));
	        }
	        return state[key].apply(null, [statePath].concat(args));
	      };
	      return module;
	    }, {});
	    module.services = path.reduce(function (services, key) {
	      return services ? services[key] : null;
	    }, services);

	    utils.setDeep(modulesArg, key, module);
	  });
	  return modulesArg;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);

	var Devtools = __webpack_require__(12);

	module.exports = function (controller, model, allModules) {
	  var initialState = {};

	  var registerSignals = function registerSignals(moduleName, signals) {
	    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
	      scopedSignals[moduleName + '.' + key] = signals[key];
	      return scopedSignals;
	    }, {});

	    return controller.addSignals(scopedSignals, {
	      modulePath: moduleName.split('.')
	    });
	  };

	  var registerSignalsSync = function registerSignalsSync(moduleName, signals) {
	    var scopedSignals = Object.keys(signals).reduce(function (scopedSignals, key) {
	      scopedSignals[moduleName + '.' + key] = signals[key];
	      return scopedSignals;
	    }, {});
	    return controller.signalsSync(scopedSignals, {
	      modulePath: moduleName.split('.')
	    });
	  };

	  var registerServices = function registerServices(moduleName, services) {
	    var scopedServices = Object.keys(services).reduce(function (scopedServices, key) {
	      scopedServices[moduleName + '.' + key] = services[key];
	      return scopedServices;
	    }, {});
	    controller.addServices(scopedServices);
	  };

	  var registerInitialState = function registerInitialState(moduleName, state) {
	    utils.setDeep(initialState, moduleName, state);
	    model.mutators.set(moduleName.split('.'), state);
	  };

	  var registerModules = function registerModules(parentModuleName, modules) {
	    if (arguments.length === 1) {
	      modules = parentModuleName;
	      parentModuleName = null;

	      // TODO: remove after devtools extracted to external module
	      if (utils.isDeveloping() && !modules.devtools && !controller.getModules().devtools) {
	        modules.devtools = Devtools();
	      }
	    }

	    Object.keys(modules).forEach(function (moduleName) {
	      registerModule(moduleName, parentModuleName, modules);
	    });

	    if (arguments.length === 1) {
	      controller.emit('modulesLoaded', { modules: allModules });
	    }

	    return allModules;
	  };

	  var registerModule = function registerModule(moduleName, parentModuleName, modules) {
	    var moduleConstructor = modules[moduleName];
	    var actualName = moduleName;
	    if (parentModuleName) {
	      moduleName = parentModuleName + '.' + moduleName;
	    }
	    var moduleExport = {
	      name: actualName,
	      path: moduleName.split('.')
	    };
	    var module = {
	      name: moduleName,
	      alias: function alias(_alias) {
	        allModules[_alias] = moduleExport;
	      },
	      addSignals: registerSignals.bind(null, moduleName),
	      signals: function signals() {
	        console.warn('Cerebral: module.signals() is DEPRECATED. Please use controller.addSignals() instead');
	        module.addSignals.apply(module, arguments);
	      },
	      signalsSync: function signalsSync() {
	        console.warn('Cerebral: module.signalsSync() is DEPRECATED. Please use module.addSignals({mySignal: {chain: [], sync: true}}) instead');
	        registerSignalsSync.apply(module, [moduleName].concat([].slice.call(arguments)));
	      },
	      addServices: registerServices.bind(null, moduleName),
	      services: function services() {
	        console.warn('Cerebral: module.services() is DEPRECATED. Please use module.addServices() instead');
	        return module.addServices.apply(module, arguments);
	      },
	      addState: registerInitialState.bind(null, moduleName),
	      state: function state() {
	        console.warn('Cerebral: module.state() is DEPRECATED. Please use module.addState() instead');
	        module.addState.apply(module, arguments);
	      },
	      getSignals: function getSignals() {
	        var signals = controller.getSignals();
	        var path = moduleName.split('.');
	        return path.reduce(function (signals, key) {
	          return signals[key];
	        }, signals);
	      },
	      addModules: registerModules.bind(null, moduleName),
	      modules: function modules() {
	        console.warn('Cerebral: module.modules() is DEPRECATED. Please use module.addModules() instead');
	        module.addModules.apply(module, arguments);
	      }
	    };
	    var constructedModule = moduleConstructor(module, controller);

	    moduleExport.meta = constructedModule;
	    module.meta = constructedModule;
	    allModules[moduleName] = moduleExport;

	    return moduleExport;
	  };

	  controller.on('reset', function () {
	    model.mutators.merge([], initialState);
	  });

	  return registerModules;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser*/
	'use strict';

	var MODULE = 'cerebral-module-devtools';
	var SignalStore = __webpack_require__(13);
	var utils = __webpack_require__(3);

	module.exports = function Devtools() {
	  if (typeof window === 'undefined') {
	    return function () {};
	  }

	  return function init(module, controller) {
	    module.alias(MODULE);

	    module.modules({
	      store: SignalStore()
	    });

	    var signalStore = controller.getServices()[module.name].store;

	    var isInitialized = false;
	    var disableDebugger = false;
	    var willKeepState = false;

	    var getDetail = function getDetail() {
	      return JSON.stringify({
	        signals: signalStore.getSignals(),
	        willKeepState: willKeepState,
	        disableDebugger: disableDebugger,
	        currentSignalIndex: signalStore.getCurrentIndex(),
	        isExecutingAsync: signalStore.isExecutingAsync(),
	        isRemembering: signalStore.isRemembering(),
	        computedPaths: []
	      });
	    };

	    var update = utils.debounce(function () {
	      if (disableDebugger) {
	        return;
	      }

	      var event = new CustomEvent('cerebral.dev.update', {
	        detail: getDetail()
	      });
	      window.dispatchEvent(event);
	    }, 100);

	    var initialize = function initialize() {
	      if (isInitialized) return;
	      var signals = [];

	      if (utils.hasLocalStorage()) {
	        disableDebugger = JSON.parse(localStorage.getItem('cerebral_disable_debugger'));
	        signals = JSON.parse(localStorage.getItem('cerebral_signals')) || [];
	        willKeepState = JSON.parse(localStorage.getItem('cerebral_willKeepState'));
	      }

	      isInitialized = true;

	      // Might be an async signal running here
	      if (willKeepState && signalStore.isExecutingAsync()) {
	        controller.once('signalEnd', function () {
	          var event = new CustomEvent('cerebral.dev.cerebralPong', {
	            detail: getDetail()
	          });
	          signalStore.setSignals(signals);
	          signalStore.remember(signalStore.getSignals().length - 1);
	          window.dispatchEvent(event);
	        });
	      } else {
	        signalStore.setSignals(signals);
	        signalStore.rememberInitial(signalStore.getSignals().length - 1);
	        var event = new CustomEvent('cerebral.dev.cerebralPong', {
	          detail: getDetail()
	        });
	        window.dispatchEvent(event);
	      }
	    };

	    window.addEventListener('cerebral.dev.debuggerPing', function () {
	      if (utils.isDeveloping()) {
	        initialize();
	      }
	    });

	    window.addEventListener('cerebral.dev.requestUpdate', function () {
	      update();
	    });

	    window.addEventListener('cerebral.dev.toggleKeepState', function () {
	      willKeepState = !willKeepState;
	      update();
	    });

	    window.addEventListener('cerebral.dev.toggleDisableDebugger', function () {
	      disableDebugger = !disableDebugger;
	      if (disableDebugger && willKeepState) {
	        willKeepState = !willKeepState;
	      }
	      var event = new CustomEvent('cerebral.dev.update', {
	        detail: getDetail()
	      });
	      window.dispatchEvent(event);
	    });

	    window.addEventListener('cerebral.dev.resetStore', function () {
	      signalStore.reset();
	      controller.emit('change');
	      update();
	    });

	    window.addEventListener('cerebral.dev.remember', function (event) {
	      signalStore.remember(event.detail);
	      update();
	    });

	    window.addEventListener('cerebral.dev.rememberNow', function (event) {
	      signalStore.rememberNow();
	      update();
	    });

	    window.addEventListener('cerebral.dev.rewrite', function (event) {
	      signalStore.remember(event.detail);
	      var signals = signalStore.getSignals();
	      signals.splice(event.detail + 1, signals.length - 1 - event.detail);
	      update();
	    });

	    window.addEventListener('cerebral.dev.logPath', function (event) {
	      var name = event.detail.name;
	      var value = controller.get(event.detail.path);
	      // toValue instead?
	      console.log('CEREBRAL - ' + name + ':', value.toJS ? value.toJS() : value);
	    });

	    window.addEventListener('cerebral.dev.logModel', function (event) {
	      console.log('CEREBRAL - model:', controller.logModel());
	    });

	    window.addEventListener('unload', function () {
	      signalStore.removeRunningSignals();

	      if (utils.hasLocalStorage()) {
	        localStorage.setItem('cerebral_signals', isInitialized && willKeepState ? JSON.stringify(signalStore.getSignals()) : JSON.stringify([]));
	        localStorage.setItem('cerebral_willKeepState', isInitialized && JSON.stringify(!!willKeepState));
	        localStorage.setItem('cerebral_disable_debugger', isInitialized && JSON.stringify(!!disableDebugger));
	      }
	    });

	    var services = {
	      update: update,
	      start: function start() {
	        console.warn('Cerebral: devtools.start() method is deprecated. Devtools has started automatically.');
	      }
	    };

	    module.services(services);

	    controller.getDevtools = function () {
	      console.warn('Cerebral: controller.getDevtools() method is deprecated. Please upgrade your view package to latest version.');
	      return services;
	    };

	    if (window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__) {
	      window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__.signals = controller.getSignals();
	    }
	    var event = new CustomEvent('cerebral.dev.cerebralPing');
	    window.dispatchEvent(event);

	    controller.on('signalStart', update);
	    controller.on('actionStart', update);
	    controller.on('actionEnd', update);
	    controller.on('signalEnd', update);
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  SignalStore will keep track of all signals triggered. It keeps an array of signals with
	  actions and mutations related to that signal. It will also track any async signals processing. The SignalStore
	  is able to reset state and travel to a "specific point in time" by playing back the signals up to a certain
	  signal.
	*/
	'use strict';

	var utils = __webpack_require__(3);

	module.exports = function SignalStore() {
	  return function (module, controller) {
	    var signals = [];
	    var _isRemembering = false;
	    var currentIndex = signals.length - 1;
	    var hasRememberedInitial = false;

	    var asyncActionsRunning = [];

	    var addAsyncAction = function addAsyncAction(action) {
	      asyncActionsRunning.push(action);
	    };

	    var removeAsyncAction = function removeAsyncAction(action) {
	      asyncActionsRunning.splice(asyncActionsRunning.indexOf(action), 1);
	    };

	    var addSignal = function addSignal(signal) {
	      if (utils.isDeveloping() && !_isRemembering) {
	        if (asyncActionsRunning.length) {
	          var currentAction = asyncActionsRunning[asyncActionsRunning.length - 1];
	          currentAction.signals = currentAction.signals || [];
	          currentAction.signals.push(signal);
	        } else {
	          currentIndex++;
	          signals.push(signal);
	        }
	      }
	    };

	    var services = {
	      // This is used when loading up the app and producing the last known state
	      rememberNow: function rememberNow() {
	        if (!signals.length) {
	          return;
	        }

	        currentIndex = signals.length - 1;
	        this.remember(currentIndex);
	      },

	      // Will reset the SignalStore
	      reset: function reset() {
	        if (!_isRemembering) {
	          signals = [];

	          currentIndex = -1;

	          controller.emit('reset');
	        }
	      },

	      rememberInitial: function rememberInitial(index) {
	        // Both router and debugger might try to do initial remembering
	        if (hasRememberedInitial) {
	          return;
	        }

	        hasRememberedInitial = true;
	        this.remember(index);
	      },

	      remember: function remember(index) {
	        // Flag that we are remembering
	        _isRemembering = true;
	        controller.emit('reset');

	        // If going back to initial state, just return and update
	        if (index === -1) {
	          currentIndex = index;
	          _isRemembering = false;
	        } else {
	          // Start from beginning
	          currentIndex = -1;

	          // Go through signals
	          try {
	            for (var x = 0; x <= index; x++) {
	              var signal = signals[x];
	              if (!signal) {
	                break;
	              }

	              // Trigger signal and then set what has become the current signal
	              var signalMethodPath = signal.name.split('.').reduce(function (signals, key) {
	                return signals[key];
	              }, controller.getSignals());
	              signalMethodPath(signal.input, {
	                branches: signal.branches
	              });
	              currentIndex = x;
	            }
	          } catch (e) {
	            console.log(e);
	            console.warn('CEREBRAL - There was an error remembering state, it has been reset');
	            this.reset();
	          }
	        }

	        controller.emit('change');
	        _isRemembering = false;
	      },

	      removeRunningSignals: function removeRunningSignals() {
	        for (var x = 0; x < signals.length; x++) {
	          if (signals[x].isExecuting) {
	            signals.splice(x, 1);
	            x--;
	          }
	        }
	      },

	      getSignals: function getSignals() {
	        return signals;
	      },

	      setSignals: function setSignals(newSignals) {
	        signals = signals.concat(newSignals);
	      },

	      isExecutingAsync: function isExecutingAsync() {
	        return !!asyncActionsRunning.length;
	      },

	      isRemembering: function isRemembering() {
	        return _isRemembering;
	      },

	      getCurrentIndex: function getCurrentIndex() {
	        return currentIndex;
	      }
	    };

	    module.services(services);
	    controller.getStore = function getStore() {
	      console.warn('Cerebral: controller.getStore() method is deprecated.');
	      return services;
	    };

	    controller.on('signalTrigger', function (args) {
	      var signal = args.signal;

	      if (!_isRemembering && currentIndex !== -1 && currentIndex < signals.length - 1) {
	        signal.preventSignalRun();
	        console.warn('Cerebral - Looking in the past, ignored signal ' + signal.name);
	      }
	    });
	    controller.on('signalStart', function (args) {
	      var signal = args.signal;

	      if (!signal.isPrevented) addSignal(signal);
	    });
	    controller.on('actionStart', function (args) {
	      var action = args.action;
	      if (action.isAsync) addAsyncAction(args.action);
	    });
	    controller.on('actionEnd', function (args) {
	      var action = args.action;
	      if (action.isAsync) removeAsyncAction(args.action);
	    });
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (model) {
	  var registered = [];
	  var computed = [];
	  var cachedByRef = {};

	  var createMapper = function createMapper(cb) {
	    var initialRun = true;
	    var currentState = {};
	    var currentValue;

	    var get = function get(path) {
	      var value;
	      if (typeof path === 'function') {
	        if (!has(path)) {
	          registered.push(path);
	          if (path.computedRef) {
	            cachedByRef[path.computedRef] = path;
	          }
	          computed.push(createMapper(path));
	        }
	        value = currentState['COMPUTED_' + (path.computedRef ? path.computedRef : registered.indexOf(path))] = getComputedValue(path);
	      } else {
	        value = currentState[path.join('.%.')] = model.accessors.get(path);
	      }

	      return value;
	    };

	    return function () {
	      var hasChanged = Object.keys(currentState).reduce(function (hasChanged, key) {
	        if (hasChanged) {
	          return true;
	        }
	        if (key.indexOf('COMPUTED') === 0) {
	          var index = key.split('_')[1];
	          return getComputedValue(registered[index] || cachedByRef[index]) !== currentState[key];
	        } else {
	          return model.accessors.get(key.split('.%.')) !== currentState[key];
	        }
	      }, false);

	      if (hasChanged || initialRun) {
	        currentState = {};
	        initialRun = false;
	        currentValue = cb(get);
	      }

	      return currentValue;
	    };
	  };

	  var has = function has(computedFunc) {
	    if (computedFunc.computedRef) {
	      return !!cachedByRef[computedFunc.computedRef];
	    } else {
	      return registered.indexOf(computedFunc) !== -1;
	    }
	  };

	  var getComputedValue = function getComputedValue(computedFunc) {
	    if (!has(computedFunc)) {
	      registered.push(computedFunc);
	      if (computedFunc.computedRef) {
	        cachedByRef[computedFunc.computedRef] = computedFunc;
	      }
	      computed.push(createMapper(computedFunc));
	    }

	    if (computedFunc.computedRef) {
	      return computed[registered.indexOf(cachedByRef[computedFunc.computedRef])]();
	    } else {
	      return computed[registered.indexOf(computedFunc)]();
	    }
	  };

	  return {
	    register: function register(computeFunc) {
	      registered.push(computeFunc);
	      if (computeFunc.computedRef) {
	        cachedByRef[computeFunc.computedRef] = computeFunc;
	      }
	      computed.push(createMapper(computeFunc));
	      return this.getComputedValue(computeFunc);
	    },
	    has: has,
	    getComputedValue: getComputedValue
	  };
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(3);

	module.exports = function Recorder() {
	  return function (module, controller) {
	    var signalMethods = controller.getSignals();

	    var currentSignal = null;
	    var currentSeek = 0;
	    var currentRecording = null;
	    var durationTimer = null;
	    var playbackTimers = [];
	    var duration = 0;
	    var started = null;
	    var ended = null;
	    var _isPlaying = false;
	    var _isRecording = false;
	    var _isCatchingUp = false;
	    var startSeek = 0;
	    var catchup = null;

	    // Runs the signal synchronously
	    var triggerSignal = function triggerSignal(signal) {
	      var signalName = signal.name.split('.');
	      var signalMethodPath = signalMethods;
	      while (signalName.length) {
	        signalMethodPath = signalMethodPath[signalName.shift()];
	      }
	      currentSignal = signal;
	      signalMethodPath(signal.input, {
	        isRecorded: !_isCatchingUp,
	        branches: _isCatchingUp && signal.branches
	      });
	    };

	    var services = {
	      seek: function seek(_seek) {
	        startSeek = _seek;
	        clearTimeout(durationTimer);
	        playbackTimers.forEach(clearTimeout);

	        controller.emit('seek', startSeek, currentRecording);

	        // Optimize with FOR loop
	        catchup = currentRecording.signals.filter(function (signal) {
	          return signal.start - currentRecording.start < startSeek;
	        });
	        _isCatchingUp = true;
	        catchup.forEach(triggerSignal);
	        _isCatchingUp = false;
	      },

	      getCurrentSignal: function getCurrentSignal() {
	        return currentSignal;
	      },

	      createTimer: function createTimer() {
	        var update = function update() {
	          duration += 500;
	          controller.emit('duration', duration);
	          if (duration < currentRecording.duration) {
	            durationTimer = setTimeout(update, 500);
	            controller.emit('change');
	          }
	        };
	        durationTimer = setTimeout(update, 500);
	      },

	      // TODO: Do I need this? Not in use?
	      resetState: function resetState() {
	        controller.emit('recorderReset', currentRecording);
	      },

	      play: function play() {
	        if (_isPlaying || _isRecording) {
	          throw new Error('CEREBRAL Recorder - You can not play while already playing or recording');
	        }

	        this.createTimer();
	        var signalsCount = currentRecording.signals.length;
	        var startIndex = catchup.length;
	        for (var x = startIndex; x < signalsCount; x++) {
	          var signal = currentRecording.signals[x];
	          var durationTarget = signal.start - currentRecording.start - startSeek;
	          playbackTimers.push(setTimeout(triggerSignal.bind(null, signal), durationTarget));
	        }
	        _isPlaying = true;
	        started = Date.now();
	      },

	      record: function record(options) {
	        options = options || {};

	        // If we are recording over the previous stuff, go back to start
	        if (currentRecording) {
	          this.resetState();
	        }

	        var paths = options.paths || [[]];
	        var state = paths.map(function (path) {
	          return {
	            path: path,
	            value: controller.get(path)
	          };
	        });

	        currentRecording = {
	          initialState: state,
	          start: Date.now(),
	          signals: []
	        };

	        _isRecording = true;
	      },

	      stop: function stop() {
	        var wasPlaying = _isPlaying;
	        clearTimeout(durationTimer);
	        _isPlaying = false;
	        _isRecording = false;

	        if (wasPlaying) {
	          return;
	        }

	        currentRecording.end = Date.now();
	        currentRecording.duration = currentRecording.end - currentRecording.start;
	      },

	      pause: function pause() {
	        ended = Date.now();
	        currentSeek = ended - started;
	        clearTimeout(durationTimer);
	        playbackTimers.forEach(clearTimeout);
	        _isPlaying = false;
	      },

	      addSignal: function addSignal(signal) {
	        currentRecording.signals.push(signal);
	      },

	      isRecording: function isRecording() {
	        return _isRecording;
	      },

	      isPlaying: function isPlaying() {
	        return _isPlaying;
	      },

	      isCatchingUp: function isCatchingUp() {
	        return _isCatchingUp;
	      },

	      getRecording: function getRecording() {
	        return currentRecording;
	      },

	      getCurrentSeek: function getCurrentSeek() {
	        return currentSeek;
	      },

	      loadRecording: function loadRecording(recording) {
	        currentRecording = recording;
	      }
	    };

	    // uncomment after merge with cerebral-module-recorder
	    // module.services(services)
	    controller.getRecorder = function getRecorder() {
	      console.warn('Cerebral: controller.getRecorder() is deprecated. Please upgrade recorder module.');
	      return services;
	    };

	    controller.on('signalTrigger', function (args) {
	      var signal = args.signal;

	      if (_isPlaying && !signal.options.isRecorded) {
	        signal.preventSignalRun();
	        if (utils.isDeveloping()) console.warn('Cerebral - Recording is replaying, ignored signal ' + signal.name);
	      }
	    });

	    controller.on('signalStart', function (args) {
	      if (_isRecording) services.addSignal(args.signal);
	    });
	  };
	};

/***/ }
/******/ ])
});
;