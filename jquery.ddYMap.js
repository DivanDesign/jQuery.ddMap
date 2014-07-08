/**
 * jQuery ddYMap Plugin
 * @version 1.2 (2014-06-05)
 * 
 * @desc A jQuery library that allows Yandex.Maps to be rendered on a page in a simple way.
 * 
 * @uses jQuery 1.10.2.
 * @uses Yandex.Maps 2.1.
 * 
 * Parameters of the “$.fn.ddYMap” method (transferred as plain object).
 * @param latLng {array} - Comma separated longitude and latitude. @required
 * @param defaultZoom {integer} - Default map zoom. Default: 15.
 * @param defaultType {'map'; 'satellite'; 'hybrid'; 'publicMap'; 'publicMapHybrid'} - Default map type: 'map' — schematic map, 'satellite' — satellite map, 'hybrid' — hybrid map, 'publicMap' — public map, 'publicMapHybrid' - hybrid public map. Default: 'map';
 * @param scrollZoom {boolean} - Allow zoom while scrolling. Default: false.
 * @param mapCenterOffset {array} - Center offset of the map with respect to the center of the map container in pixels. Default: [0, 0].
 * @param placemarkOptions {plain object} - Placemark options. Default: {}.
 * 
 * @link http://code.divandesign.biz/jquery/ddymap/1.2
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
		mapCenterOffset: false,
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
						type: 'yandex#' + params.defaultType,
						controls: []
					}
				);
				
				//Если нужно смещение центр карты
				if ($.isArray(params.mapCenterOffset) && params.mapCenterOffset.length == 2){
					var position = map.getGlobalPixelCenter();
					
					map.setGlobalPixelCenter([position[0] - params.mapCenterOffset[0], position[1] - params.mapCenterOffset[1]]);
				}
				
				//Добавляем контролы
				map.controls
					.add('zoomControl')
					.add('typeSelector')
					.add('fullscreenControl')
					.add('geolocationControl')
					//Почему-то именно с этим контролом float: left не работает, может это временно.
					.add('rulerControl', {float: 'left'});
				
				//Если зум не нужен
				if (!params.scrollZoom){
					//Выключим масштабирование колесом мыши (т.к. в 2.1 по умолчанию он включён)
					map.behaviors.disable('scrollZoom');
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