(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("cerebralDevtools", [], factory);
	else if(typeof exports === 'object')
		exports["cerebralDevtools"] = factory();
	else
		root["cerebralDevtools"] = factory();
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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var Devtools = __webpack_require__(26);
	exports['default'] = Devtools;
	module.exports = exports['default'];

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser*/
	'use strict';

	var MODULE = 'cerebral-module-devtools';
	var SignalStore = __webpack_require__(27);
	var utils = __webpack_require__(28);

	module.exports = function Devtools() {
	  if (typeof window === 'undefined') {
	    return function () {};
	  }

	  return function init(module, controller) {
	    module.alias(MODULE);

	    module.modules({
	      store: SignalStore()
	    });

	    module.signals({
	      modelChanged: [function changeModel(arg) {
	        arg.state.set(arg.input.path, arg.input.value);
	      }]
	    });

	    var signalStore = controller.getServices()[module.name].store;

	    var isInitialized = false;
	    var hasInitialPayload = false;
	    var disableDebugger = false;
	    var willKeepState = false;
	    var lastExecutedSignalIndex = 0;
	    var APP_ID = String(Date.now());
	    var VERSION = 'v2';

	    var getExecutingSignals = function getExecutingSignals(signals) {
	      var executingSignals = [];
	      for (var x = signals.length - 1; x >= 0; x--) {
	        if (!signals[x].isExecuting) {
	          break;
	        }
	        executingSignals.unshift(signals[x]);
	      }
	      return executingSignals;
	    };

	    var update = function update(signalType, data, forceUpdate) {
	      if (!forceUpdate && (disableDebugger || !data || !hasInitialPayload)) {
	        return;
	      }

	      var detail = {
	        type: signalType,
	        app: APP_ID,
	        version: VERSION,
	        data: data
	      };

	      var event = new CustomEvent('cerebral.dev.update', {
	        detail: JSON.stringify(detail)
	      });
	      window.dispatchEvent(event);
	    };

	    var getInit = function getInit() {
	      var signals = signalStore.getSignals();
	      var executingSignals = getExecutingSignals(signals);

	      lastExecutedSignalIndex = signals.indexOf(executingSignals[0]);
	      hasInitialPayload = true;
	      return {
	        initialModel: controller.get(),
	        signals: signals,
	        willKeepState: willKeepState,
	        disableDebugger: disableDebugger,
	        isExecutingAsync: signalStore.isExecutingAsync()
	      };
	    };

	    var updateInit = function updateInit() {
	      update('init', getInit());
	    };

	    var updateSignals = function updateSignals(arg) {
	      var signals = signalStore.getSignals();
	      var executingSignals = getExecutingSignals(signals);

	      // In case last executed signal is now done
	      update('signals', {
	        signals: signals.slice(lastExecutedSignalIndex),
	        isExecutingAsync: signalStore.isExecutingAsync()
	      });

	      // Set new last executed signal
	      lastExecutedSignalIndex = signals.indexOf(executingSignals[0]);
	    };

	    var updateSettings = function updateSettings() {
	      update('settings', {
	        willKeepState: willKeepState,
	        disableDebugger: disableDebugger
	      }, true);
	    };

	    var initialize = function initialize() {
	      if (isInitialized) {
	        updateInit();
	      }
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
	          signalStore.setSignals(signals);
	          signalStore.remember(signalStore.getSignals().length - 1);
	          var event = new CustomEvent('cerebral.dev.cerebralPong', {
	            detail: JSON.stringify({
	              type: 'init',
	              app: APP_ID,
	              version: VERSION,
	              data: getInit()
	            })
	          });
	          window.dispatchEvent(event);
	        });
	      } else {
	        signalStore.setSignals(signals);
	        signalStore.rememberInitial(signalStore.getSignals().length - 1);
	        var event = new CustomEvent('cerebral.dev.cerebralPong', {
	          detail: JSON.stringify({
	            type: 'init',
	            app: APP_ID,
	            version: VERSION,
	            data: getInit()
	          })
	        });
	        window.dispatchEvent(event);
	      }
	    };

	    window.addEventListener('cerebral.dev.debuggerPing', function () {
	      initialize();
	    });

	    window.addEventListener('cerebral.dev.toggleKeepState', function () {
	      willKeepState = !willKeepState;
	      updateSettings();
	    });

	    window.addEventListener('cerebral.dev.toggleDisableDebugger', function () {
	      disableDebugger = !disableDebugger;
	      if (disableDebugger && willKeepState) {
	        willKeepState = !willKeepState;
	      }
	      updateSettings();
	    });

	    window.addEventListener('cerebral.dev.resetStore', function () {
	      signalStore.reset();
	      controller.emit('change');
	      update();
	    });

	    window.addEventListener('cerebral.dev.remember', function (event) {
	      signalStore.remember(event.detail);
	    });

	    window.addEventListener('cerebral.dev.rewrite', function (event) {
	      var signals = signalStore.getSignals();
	      signals.splice(event.detail + 1, signals.length - 1 - event.detail);
	      signalStore.remember(event.detail);
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

	    window.addEventListener('cerebral.dev.changeModel', function (event) {
	      module.getSignals().modelChanged(event.detail);
	    });

	    window.addEventListener('unload', function () {
	      signalStore.removeRunningSignals();

	      if (utils.hasLocalStorage()) {
	        localStorage.setItem('cerebral_signals', isInitialized && willKeepState ? JSON.stringify(signalStore.getSignals()) : JSON.stringify([]));
	        localStorage.setItem('cerebral_willKeepState', isInitialized && JSON.stringify(willKeepState));
	        localStorage.setItem('cerebral_disable_debugger', isInitialized && JSON.stringify(disableDebugger));
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

	    controller.on('change', updateSignals);
	  };
	};

/***/ },

/***/ 27:
/***/ function(module, exports) {

	/*
	  SignalStore will keep track of all signals triggered. It keeps an array of signals with
	  actions and mutations related to that signal. It will also track any async signals processing. The SignalStore
	  is able to reset state and travel to a "specific point in time" by playing back the signals up to a certain
	  signal.
	*/
	'use strict';

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
	      if (!_isRemembering) {
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

/***/ 28:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = {
	  hasLocalStorage: function hasLocalStorage() {
	    return typeof global.localStorage !== 'undefined';
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
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }

/******/ })
});
;