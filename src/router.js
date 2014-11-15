define("router", [

	"./router/pattern"

], function (urlPattern) {

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

});