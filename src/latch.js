define(
[

	"./router"

], function (Router) {
	
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

});
