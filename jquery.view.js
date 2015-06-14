/**
* jquery.view 0.0.1
* A simple plugin used to create independent and encapsulated controllers for DOM elements. 
* Copyright 2015, Nik Rowell - http://www.nikrowell.com
* MIT License 
*/
;(function($) {
	
	'use strict';
	
	var views = {},
		queue = {},
		proto = {};
	
	if(!Object.create) {
		Object.create = function(o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}
	
	function initialize() {
		
		$(document).ready(function() {
			
			var selector,
				name;
			
			for(selector in queue) {
				name = selector.substring(1);
				$(selector).view(name, queue[selector]);
			}
			
			queue = null;
		});
	}
	
	proto.$ = function(selector) {
		return this.el.find(selector);
	};
	
	proto.bind = function() {
		for(var i = 0, n = arguments.length; i < n; i++) {
			$.isFunction(arguments[i]) && $.proxy(arguments[i], this);
		}
	};
	
	proto.destroy = function() {
		this.el.off();
		this.el.remove();
		return this;
	};
	
	$.fn.view = function(name, options) {
		
		var namespace = 'view.' + name;
		
		if(this.data(namespace)) {
			return this.data(namespace);
		}
		
		return this.each(function() {
			
			var view = views[name],
				instance;
			
			if(!view) return this;
			
			if($.isFunction(view)) {
			
				instance = Object.create(proto);
				instance.el = $(this);
				$.extend(instance, view.call(instance, options));
			
			} else {
				
				instance = Object.create($.extend({}, proto, view));
				instance.el = $(this);
				instance.init && instance.init(options);
			}
			
			$.data(this, namespace, instance);
		});
	};
	
	$.views = function(name, view) {
		
		if(arguments.length == 0) {
			initialize();
			return;
		}
		
		if(name[0] === '#' || name[0] === '.') {
			queue[name] = view;
			name = name.substring(1);
		}
		
		if(views[name]) {
			try { console.warn("jquery.view overriden view definition for '" + name + "'"); }
			catch(e) { }
		}
		
		views[name] = view;
	};
	
})(jQuery);