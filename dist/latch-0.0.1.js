var latch =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function (Router) {
		
		var __instance;

		// ## Latch
		function Latch(opts) {
			
			/* Options object */
			this.opts = opts || {};
			/* Router instances object */
			this.routers = {}; 
			/* Mounted routes object () */
			this.routes = [];

		};

		function matchToArray (match) {
			
			var arr = [];
			
			for (var key in match) {
				arr.push(match[key])
			}

			return arr;

		}

		// ## Latch#createRouter
		// Creates a new Router instance and registers it 
		// to the application object. Avoid the ```new``` keyword out of preference 
		// and ease of use.
		// 
		// ```js
		// var app = latch();
		// var tweets = app.createRouter("tweets");
		// app.route("/tweets", tweets);
		// tweets.route("/:id", function (id) { 
		// 		// on GET "/tweets/12341"
		// 		console.log(id); // => 12341
		// }); 
		// ```
		// 
		Latch.prototype.createRouter = function (name) {
			
			if ( this.routers[name] ) 
				throw new Error("Router with name " + name + " already registered.");

			return this.routers[name] = new Router();

		}

		// ##Latch#mount/route
		// Mount a function or router instance to a path. 
		// If you have mounted a router	you __can't__ add new routes to the router.
		// ```js
		// // Mount a router...
		// var myRouter = app.createRouter("books");
		// // register some routes...
		// app.mount("/route", myRouter);
		// // Mount a function aka lazy routing
		// app.mount("/custom/:id", function (id) {
		// 	// this is a lazy route
		// });
		// ```
		Latch.prototype.mount = Latch.prototype.route = function (path, fn) {

			if (fn instanceof Router) {
				
				this.routes = this.routes.concat( fn.routes(path) );

			} else {

				this.routes.push({
					pattern: Router.pattern.newPattern(path),
					action: fn
				});

			}

		}

		// ##Latch#dispatch
		// Dispatches a path to the routes.
		// If a match is found it triggers the corresponding action and
		// applies the arguments in the params order.
		// ```js
		// myRouter.route("/:id/:date/:isbn", function (id, date, isbn) {
		// 	console.log(id); => 12314
		// 	console.log(date); => 2012-14-12
		// 	console.log(isbn); => 192912491924
		// });
		// app.dispatch("/12314/2012-14-12/192912491924")
		// ```
		Latch.prototype.dispatch = function (path) {

			for (var i = 0; i < this.routes.length; i++) {

				var route = this.routes[i];
				var match = route.pattern.match(path);



				if (match) {
					var args = matchToArray(match);
					return route.action.apply(this, args);
				}

			};

		}

		// ## Latch#getRouter
		// Get router instance based on the name used when
		// registering it to the application object.
		// 
		Latch.prototype.getRouter = function (name) {

			return this.routers[name] || null;

		}

		Latch.Router = Router;

		// ## application
		// "Factory" for latch.
		// If the latch function is called for the first time, it returns a new instance 
		// of latch. If it's been called prior, it will return the instance.
		// ```js
		// var app = latch();
		// ```
		// 
		return function application (opts) {
			
			return __instance = __instance || new Latch(opts);
			
		};

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(2)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function (urlPattern) {

		// ## Router	
		function Router(base) {

			this._routes = [];
			this.mountPath = null;

		};

		Router.pattern = urlPattern;

		// ## Router#route
		// Registers a route to the router.
		// ```js
		// var myRouter = new Router(); 
		// myRouter.route("/book/:date/:id", function (date, id) {
		// 	// ...
		// });
		// ```
		// 
		// __NOTE__ A route must still be registered to the application and will
		// not be listening just by being instantiated.
		Router.prototype.route = function (pattern, action) {

			var _route = { pattern: pattern, action: action };		
			this._routes.push(_route);
			return this;
		
		};
		// ## Router#routes
		Router.prototype.routes = function (mountPath) {

			var target = [];

			for (var i = 0; i < this._routes.length; i++) {
				
				var route = this._routes[i];
				target.push({
					pattern: urlPattern.newPattern(mountPath + route.pattern),
					action: route.action
				});

			};

			return target;

		}	

		return Router;

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Modified version of:
	 * https://github.com/snd/url-pattern
	 */

	var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	  return {
	    PatternPrototype: {
	      match: function(url) {
	        var bound, captured, i, match, name, value, _i, _len;
	        match = this.regex.exec(url);
	        if (match == null) {
	          return null;
	        }
	        captured = match.slice(1);
	        if (this.isRegex) {
	          return captured;
	        }
	        bound = {};
	        for (i = _i = 0, _len = captured.length; _i < _len; i = ++_i) {
	          value = captured[i];
	          name = this.names[i];
	          if (value == null) {
	            continue;
	          }
	          if (name === '_') {
	            if (bound._ == null) {
	              bound._ = [];
	            }
	            bound._.push(value);
	          } else {
	            bound[name] = value;
	          }
	        }
	        return bound;
	      }
	    },
	    newPattern: function(arg, separator) {
	      var isRegex, pattern, regexString;
	      if (separator == null) {
	        separator = '/';
	      }
	      isRegex = arg instanceof RegExp;
	      if (!(('string' === typeof arg) || isRegex)) {
	        throw new TypeError('argument must be a regex or a string');
	      }
	      [':', '*'].forEach(function(forbidden) {
	        if (separator === forbidden) {
	          throw new Error("separator can't be " + forbidden);
	        }
	      });
	      pattern = Object.create(module.exports.PatternPrototype);
	      pattern.isRegex = isRegex;
	      pattern.regex = isRegex ? arg : (regexString = module.exports.toRegexString(arg, separator), new RegExp(regexString));
	      if (!isRegex) {
	        pattern.names = module.exports.getNames(arg, separator);
	      }
	      return pattern;
	    },
	    escapeForRegex: function(string) {
	      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    },
	    getNames: function(arg, separator) {
	      var escapedSeparator, name, names, regex, results;
	      if (separator == null) {
	        separator = '/';
	      }
	      if (arg instanceof RegExp) {
	        return [];
	      }
	      escapedSeparator = module.exports.escapeForRegex(separator);
	      regex = new RegExp("((:?:[^" + escapedSeparator + "\(\)]+)|(?:[\*]))", 'g');
	      names = [];
	      results = regex.exec(arg);
	      while (results != null) {
	        name = results[1].slice(1);
	        if (name === '_') {
	          throw new TypeError(":_ can't be used as a pattern name in pattern " + arg);
	        }
	        if (__indexOf.call(names, name) >= 0) {
	          throw new TypeError("duplicate pattern name :" + name + " in pattern " + arg);
	        }
	        names.push(name || '_');
	        results = regex.exec(arg);
	      }
	      return names;
	    },
	    escapeSeparators: function(string, separator) {
	      var escapedSeparator, regex;
	      if (separator == null) {
	        separator = '/';
	      }
	      escapedSeparator = module.exports.escapeForRegex(separator);
	      regex = new RegExp(escapedSeparator, 'g');
	      return string.replace(regex, escapedSeparator);
	    },
	    toRegexString: function(string, separator) {
	      var escapedSeparator, stringWithEscapedSeparators;
	      if (separator == null) {
	        separator = '/';
	      }
	      stringWithEscapedSeparators = module.exports.escapeSeparators(string, separator);
	      stringWithEscapedSeparators = stringWithEscapedSeparators.replace(/\((.*?)\)/g, '(?:$1)?').replace(/\*/g, '(.*?)');
	      escapedSeparator = module.exports.escapeForRegex(separator);
	      module.exports.getNames(string, separator).forEach(function(name) {
	        return stringWithEscapedSeparators = stringWithEscapedSeparators.replace(':' + name, "([^\\" + separator + "]+)");
	      });
	      return "^" + stringWithEscapedSeparators + "$";
	    }
	  }
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])