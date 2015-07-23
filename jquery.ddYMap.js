/**
 * jQuery ddYMap Plugin
 * @version 1.3.1 (2014-07-24)
 * 
 * @desc A jQuery library that allows Yandex.Maps to be rendered on a page in a simple way.
 * 
 * @uses jQuery 1.10.2.
 * @uses Yandex.Maps 2.1.
 * 
 * Parameters of the “$.fn.ddYMap” method (transferred as plain object).
 * @param placemarks {array} - Array of placemarks to be put on the map. If there is more than one placemark, the map will be scaled to make all the placemarks visible. Also, a pair of coordinates still can be passed (like it was in 1.2 and earlier). @required
 * @param placemarks[i] {plain object} - Placemark data. @required
 * @param placemarks[i].latLng {array} - Placemark coordinates (latitude and longitude). @required
 * @param placemarks[i].content {string: html} - Balloon content. Default: ''.
 * @param defaultZoom {integer} - Default map zoom. Default: 15.
 * @param defaultType {'map'; 'satellite'; 'hybrid'; 'publicMap'; 'publicMapHybrid'} - Default map type: 'map' — schematic map, 'satellite' — satellite map, 'hybrid' — hybrid map, 'publicMap' — public map, 'publicMapHybrid' - hybrid public map. Default: 'map';
 * @param scrollZoom {boolean} - Allow zoom while scrolling. Default: false.
 * @param mapCenterOffset {array} - Center offset of the map with respect to the center of the map container in pixels. Default: [0, 0].
 * @param placemarkOptions {plain object} - Placemark options. Default: {}.
 * 
 * @link http://code.divandesign.biz/jquery/ddymap/1.3.1
 * 
 * @copyright 2014, DivanDesign
 * http://www.DivanDesign.biz
 */

(function($){
$.extend(true, {ddYMap: {
	defaults: {
		placemarks: new Array(),
		element: 'map',
		defaultZoom: 15,
		defaultType: 'map',
		scrollZoom: false,
		mapCenterOffset: false,
		placemarkOptions: {},
		controls: [
			{name: 'zoomControl'},
			{name: 'typeSelector'},
			{name: 'fullscreenControl'},
			{name: 'geolocationControl'},
			{name: 'rulerControl'}
		]
	},
	//TODO: перенести метод в $.ddTools
	verifyRenamedParams: function(params, compliance){
		var result = {},
			msg = new Array();
		
		//Перебираем таблицу соответствия
		$.each(compliance, function(newName, oldName){
			//Если старый параметр задан, а новый — нет
			if ($.type(params[oldName]) != 'undefined' && $.type(params[newName]) == 'undefined'){
				//Зададим
				result[newName] = params[oldName];
				msg.push('“' + oldName + '” must be renamed as “' + newName + '”;');
			}
		});
		
		if (msg.length > 0){
			console.group('$.ddYMap');
			console.warn('Some of the parameters have been renamed. Please, correct the following parameters:');
			
			for (var i = 0; i < msg.length; i++){
				console.warn(msg[i]);
			}
			
			console.groupEnd();
		}
		
		return result;
	},
	preparePlacemarks: function(params){
		var geoObjects = new ymaps.GeoObjectCollection();
		
		if (!$.isArray(params.placemarks)){return geoObjects;}
		
		//Если передана просто пара координат
		if (params.placemarks.length == 2 && $.isNumeric(params.placemarks[0]) && $.isNumeric(params.placemarks[1])){
			//Значит точка одна
			geoObjects.add(new ymaps.Placemark(params.placemarks, {}, params.placemarkOptions));
		}else{
			//Переберём все точки
			for (var i = 0; i < params.placemarks.length; i++){
				//Если координаты заданы
				if (
					$.isPlainObject(params.placemarks[i]) &&
					$.isArray(params.placemarks[i].latLng) &&
					params.placemarks[i].latLng.length == 2
				){
					//Создаём метку
					geoObjects.add(new ymaps.Placemark(params.placemarks[i].latLng, {
						balloonContent: $.type(params.placemarks[i].content) == 'string' ? $.trim(params.placemarks[i].content) : ''
					}, params.placemarkOptions));
				}
			}
		}
		
		return geoObjects;
	},
	init: function(params){
		var _this = this;
		
		$.extend(params, _this.verifyRenamedParams(params, {
			'defaultZoom': 'zoom',
			'placemarks': 'latLng'
		}));
		
		params = $.extend({}, _this.defaults, params);
		
		ymaps.ready(function(){
			//Подготавливаем точки
			var geoObjects = _this.preparePlacemarks(params),
				//Количество точек
				geoObjects_len = geoObjects.getLength();
			
			//Если точки заданы
			if (geoObjects_len > 0){
				params.$element = $(params.element);
				
				//Установим высоту у элемента, если она не задана
				if (params.$element.height() == 0){
					params.$element.height(400);
				}
				
				//Создаём карту
				var map = new ymaps.Map(params.element, {
						center: geoObjects.get(0).geometry.getCoordinates(),
						zoom: params.defaultZoom,
						type: 'yandex#' + params.defaultType,
						controls: []
					});
				
				//Если заданы котролы
				if($.isArray(params.controls)){
					$.each(params.controls, function(index, control){
						if(control.name){
							//Добавляем их
							map.controls.add(control.name, control.options);
						}
					});
				}
				
				//Если зум не нужен
				if (!params.scrollZoom){
					//Выключим масштабирование колесом мыши (т.к. в 2.1 по умолчанию он включён)
					map.behaviors.disable('scrollZoom');
				}
				
				//Добавляем метки на карту
				map.geoObjects.add(geoObjects);
				
				//Если меток несколько
				if (geoObjects_len > 1){
					//Если элемент с картой скрыт
					if (params.$element.is(':hidden')){
						//При первом изменении размера (иначе, если карта была скрыта, выйдет плохо)
						map.events.once('sizechange', function(){
							//Надо, чтобы они все влезли
							map.setBounds(geoObjects.getBounds());
						});
					}else{
						//Надо, чтобы они все влезли
						map.setBounds(geoObjects.getBounds());
					}
				}
				
				//Если нужно смещение центра карты
				if ($.isArray(params.mapCenterOffset) && params.mapCenterOffset.length == 2){
					var position = map.getGlobalPixelCenter();
					
					map.setGlobalPixelCenter([position[0] - params.mapCenterOffset[0], position[1] - params.mapCenterOffset[1]]);
				}
				
				params.$element.data('ddYMap', {map: map}).trigger('ddAfterInit');
			}
		});
	}
}});

$.fn.ddYMap = function(params){
	var _this = $.ddYMap;
	
	return $(this).each(function(){
		_this.init($.extend(params, {element: this}));
	});
};
})(jQuery);