/**
 * jQuery ddYMap Plugin
 * @version 1.1 (2014-03-16)
 * 
 * @desc A jQuery library that allows Yandex.Maps to be rendered on a page in a simple way.
 * 
 * @uses jQuery 1.10.2.
 * @uses Yandex.Maps 2.0-stable.
 * 
 * Parameters of the “$.fn.ddYMap” method (transferred as plain object).
 * @param latLng {array} - Comma separated longitude and latitude. @required
 * @param defaultZoom {integer} - Default map zoom. Default: 15.
 * @param defaultType {'map'; 'satellite'; 'hybrid'; 'publicMap'; 'publicMapHybrid'} - Default map type: 'map' — schematic map, 'satellite' — satellite map, 'hybrid' — hybrid map, 'publicMap' — public map, 'publicMapHybrid' - hybrid public map. Default: 'map';
 * @param scrollZoom {boolean} - Allow zoom while scrolling. Default: false.
 * @param placemarkOptions {plain object} - Placemark options. Default: {}.
 * 
 * @link http://code.divandesign.biz/jquery/ddymap/1.1
 * 
 * @copyright 2014, DivanDesign
 * http://www.DivanDesign.biz
 */

(function($){
$.extend(true, {ddYMap: {
	defaults: {
		latLng: new Array(),
		element: 'map',
		defaultZoom: 15,
		defaultType: 'map',
		scrollZoom: false,
		placemarkOptions: {}
	},
	init: function(params){
		var _this = this;
		
		params = $.extend({}, _this.defaults, params);
		
		//Если координаты заданы
		if ($.isArray(params.latLng) && params.latLng.length == 2){
			ymaps.ready(function(){
				//Создаём карту
				var map = new ymaps.Map(params.element, {
						center: params.latLng,
						zoom: params.defaultZoom,
						type: 'yandex#' + params.defaultType
					}
				);
				
				//Добавляем контролы
				map.controls
					.add('zoomControl')
					.add('typeSelector')
					.add('scaleLine')
					.add('mapTools');
				
				//Если зум нужен
				if (params.scrollZoom){
					//Включим масштабирование колесом мыши
					map.behaviors.enable('scrollZoom');
				}
				
				//Создаём метку и добавляем на карту
				map.geoObjects.add(new ymaps.Placemark(params.latLng, {}, params.placemarkOptions));
			});
		}
	}
}});

$.fn.ddYMap = function(params){
	var _this = $.ddYMap;
	
	return $(this).each(function(){
		_this.init($.extend(params, {element: $(this).get(0)}));
	});
};
})(jQuery);