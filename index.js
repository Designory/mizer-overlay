// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	'use strict';

	var defaults = {
		'overlayAppendSelector': '.base',
		'overlayDataAttribute': 'overlay',
		'overlayClassname': 'overlay',
		'overlayClassnameDataAttr':'overlay-class',
		'overlayContainerClassname': 'overlay-container',
		'overlayBodyClassname': 'overlay-body',
		'activeClassname':'overlay-active',
		'closeClassname':'overlay-close',
		'interstitial': false,
		'interstitialSelector':'.interstitial-link',
		'interstitialCancel':'.interstitial-cancel',
		'interstitialPopupSelector':'#third-party-overlay',
		"overlayAuxiliaryClass":null,
		"plugins":{},
		onOpen: function () {},
		onClose: function () {}
	};

	function OverlayModal(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this.body = null;
		this.scrollPosition = 0;
		this.init();
	}

	OverlayModal.prototype = {

		/**
		 * [init description]
		 * @return {[type]} [description]
		 */
		init: function () {

			var self = this;
			var $element = $(this.element);
			var $target = (self.settings.interstitial) ? $(self.settings.interstitialPopupSelector) : $($element.data(self.settings.overlayDataAttribute));
			var $overlay = $('.' + self.settings.overlayClassname);
			var overlayBody ='<div class="' +self.settings.overlayClassname + '"><div class="' + self.settings.overlayContainerClassname + '"><button class="' + self.settings.closeClassname + '"><span class="sr-only">Close Overlay</span></button><div class="' + self.settings.overlayBodyClassname + '"></div></div></div>';

			if(!$overlay.length) $(self.settings.overlayAppendSelector).append(overlayBody);

            pluginManager(self, 'init');

			$element.click(function (e){
				e.preventDefault();
				if($target) self.open($target, e);
			});

		},

		open: function (target) {
			var self = this;
			var $target = $(this.element);
			var dynamicClassname = target.data(self.settings.overlayClassnameDataAttr);

			self.scrollPosition = $(window).scrollTop();

			self.body = target.html();

			self.overLayBodyEl = $('.' + self.settings.overlayBodyClassname).append(self.body);

			// if interstitial, replace the overlay href with the trigger.
			if(self.settings.interstitial && $target) $(self.settings.interstitialSelector).attr('href', $target.attr('href'));

			if (self.settings.overlayAuxiliaryClass) self.overLayBodyEl.addClass(self.settings.overlayAuxiliaryClass);

			//dynamically add class if provided
			if(dynamicClassname) $('.' + self.settings.overlayClassname).addClass(dynamicClassname);

			// close interstitial on click of button and add cancel functionality
			if(self.settings.interstitial && $target) {
				$('.' + self.settings.overlayBodyClassname).on('click.interstitialContinue', self.settings.interstitialSelector, self.close.bind(this));
				$('.' + self.settings.overlayBodyClassname).on('click.interstitialCancel', self.settings.interstitialCancel, function (event) {
					event.preventDefault();
					self.close();
				});
			}

			$('body').addClass(self.settings.activeClassname);

			$('.' + self.settings.closeClassname).on('click', function () {	
				console.log('close clicked');	
				console.log(self);			
				self.close();
			});

			// close overlay if clicked outside of container
			$(document).click('.' + self.settings.overlayClassname, function (event) {
				var $target = $(event.target);
				var $overlay = $('.' + self.settings.overlayClassname);
				if($target.is($overlay)) self.close();
			});

			// add escape key close functionality
			$(document).on('keyup.overlay', function(e) {
			     if (e.keyCode == 27) {
			        self.close();
			    }
			});

			pluginManager(self, 'open');

			self.settings.onOpen();
		},

		close: function () {
			var self = this;

			$('body').removeClass(self.settings.activeClassname);

			//remove the close methods for this modal instance
			$('.' + self.settings.closeClassname).off('click');
			$(document).off('click touchend');
			$(document).off('keyup.overlay');

			$(window).scrollTop(self.scrollPosition);

			$('.' + self.settings.overlayBodyClassname).html('');

			//dynamically remove class if provided
			$('.' + self.settings.overlayClassname).attr('class', self.settings.overlayClassname);

			$(document).off('keyup.overlay');

			self.settings.onClose();
		}
	};

	$.fn.overlayModal = function(options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_overlay_modal')) {
				$.data(this, 'plugin_overlay_modal', new OverlayModal(this, options));
			}
		});
	};

	function pluginManager(self, methodName){
		for (var key in self.settings.plugins) {
			self.settings.plugins[key][methodName](self);
		}
	}

}));