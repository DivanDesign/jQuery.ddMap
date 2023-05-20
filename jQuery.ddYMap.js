/**
 * jQuery.ddYMap
 * @version 1.4 (2015-07-23)
 * 
 * @desc A jQuery library that allows Yandex.Maps to be rendered on a page in a simple way.
 * 
 * @requires jQuery 1.10.2
 * @requires Yandex.Maps 2.1
 * 
 * Parameters of the `$.fn.ddYMap` method (transferred as plain object).
 * @param params {objectPlain} — The parameters.
 * @param params.placemarks {Array} — Array of placemarks to be put on the map. If there is more than one placemark, the map will be scaled to make all the placemarks visible. Also, a pair of coordinates still can be passed (like it was in 1.2 and earlier).
 * @param params.placemarks[i] {objectPlain} — Placemark data.
 * @param params.placemarks[i].latLng {Array} — Placemark coordinates (latitude and longitude).
 * @param [params.placemarks[i].content=''] {string} — Balloon content.
 * @param [params.defaultZoom=15] {integer} — Default map zoom.
 * @param [params.defaultType='map'] {'map'|'satellite'|'hybrid'|'publicMap'|'publicMapHybrid'} — Default map type: 'map' — schematic map, 'satellite' — satellite map, 'hybrid' — hybrid map, 'publicMap' — public map, 'publicMapHybrid' - hybrid public map.
 * @param [params.scrollZoom=false] {boolean} — Allow zoom while scrolling.
 * @param [params.mapCenterOffset=[0, 0]] {Array} — Center offset of the map with respect to the center of the map container in pixels.
 * @param [params.placemarkOptions={}] {objectPlain} — Placemark options.
 * @param [params.controls=[{name: 'zoomControl'},{name: 'typeSelector'},{name: 'fullscreenControl'},{name: 'geolocationControl'},{name: 'rulerControl'}]] {Array} — An array of controls to be added onto the map.
 * @param [params.mapOptions={suppressMapOpenBlock: true}] {objectPlain} — Represents yandex map options to be passed to the constructor.
 * 
 * @link https://code.divandesign.ru/jquery/ddymap
 * 
 * @copyright 2013–2015 [Ronef]{@link https://Ronef.ru }
 */

(function($){
$.extend(
	true,
	{
		ddYMap: {
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
				],
				mapOptions: {
					suppressMapOpenBlock: true
				}
			},
			
			//TODO: перенести метод в $.ddTools
			verifyRenamedParams: function(
				params,
				compliance
			){
				var
					result = {},
					msg = new Array()
				;
				
				//Перебираем таблицу соответствия
				Object.entries(compliance).forEach(
					([
						newName,
						oldName
					]) =>
					{
						//Если старый параметр задан, а новый — нет
						if (
							typeof params[oldName] != 'undefined' &&
							typeof params[newName] == 'undefined'
						){
							//Зададим
							result[newName] = params[oldName];
							msg.push('“' + oldName + '” must be renamed as “' + newName + '”;');
						}
					}
				);
				
				if (msg.length > 0){
					console.group('$.ddYMap');
					console.warn('Some of the parameters have been renamed. Please, correct the following parameters:');
					
					for (
						var i = 0;
						i < msg.length;
						i++
					){
						console.warn(msg[i]);
					}
					
					console.groupEnd();
				}
				
				return result;
			},
			
			preparePlacemarks: function(params){
				var geoObjects = new ymaps.GeoObjectCollection();
				
				if (!Array.isArray(params.placemarks)){
					return geoObjects;
				}
				
				//Если передана просто пара координат
				if (
					params.placemarks.length == 2 &&
					$.isNumeric(params.placemarks[0]) &&
					$.isNumeric(params.placemarks[1])
				){
					//Значит точка одна
					geoObjects.add(
						new ymaps.Placemark(
							params.placemarks,
							{},
							params.placemarkOptions
						)
					);
				}else{
					//Переберём все точки
					for (
						var i = 0;
						i < params.placemarks.length;
						i++
					){
						//Если координаты заданы
						if (
							$.isPlainObject(params.placemarks[i]) &&
							Array.isArray(params.placemarks[i].latLng) &&
							params.placemarks[i].latLng.length == 2
						){
							//Создаём метку
							geoObjects.add(
								new ymaps.Placemark(
									params.placemarks[i].latLng,
									{
										balloonContent:
											typeof params.placemarks[i].content == 'string' ?
											$.trim(params.placemarks[i].content) :
											''
									},
									params.placemarkOptions
								)
							);
						}
					}
				}
				
				return geoObjects;
			},
			
			init: function(params){
				var _this = this;
				
				$.extend(
					params,
					_this.verifyRenamedParams(
						params,
						{
							'defaultZoom': 'zoom',
							'placemarks': 'latLng'
						}
					)
				);
				
				params = $.extend(
					{},
					_this.defaults,
					params
				);
				
				ymaps.ready(function(){
					var
						//Подготавливаем точки
						geoObjects = _this.preparePlacemarks(params),
						//Количество точек
						geoObjects_len = geoObjects.getLength()
					;
					
					//Если точки заданы
					if (geoObjects_len > 0){
						params.$element = $(params.element);
						
						//Установим высоту у элемента, если она не задана
						if (params.$element.height() == 0){
							params.$element.height(400);
						}
						
						//Создаём карту
						var
							map = new ymaps.Map(
								params.element,
								{
									center: geoObjects.get(0).geometry.getCoordinates(),
									zoom: params.defaultZoom,
									type: 'yandex#' + params.defaultType,
									controls: []
								},
								params.mapOptions
							)
						;
						
						//Если заданы котролы
						if(Array.isArray(params.controls)){
							params.controls.forEach(
								control =>
								{
									if(control.name){
										//Добавляем их
										map.controls.add(
											control.name,
											control.options
										);
									}
								}
							);
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
								map.events.once(
									'sizechange',
									function(){
										//Надо, чтобы они все влезли
										map.setBounds(geoObjects.getBounds());
									}
								);
							}else{
								//Надо, чтобы они все влезли
								map.setBounds(geoObjects.getBounds());
							}
						}
						
						//Если нужно смещение центра карты
						if (
							Array.isArray(params.mapCenterOffset) &&
							params.mapCenterOffset.length == 2
						){
							var position = map.getGlobalPixelCenter();
							
							map.setGlobalPixelCenter([
								position[0] - params.mapCenterOffset[0],
								position[1] - params.mapCenterOffset[1]
							]);
						}
						
						params.$element
							.data(
								'ddYMap',
								{map: map}
							)
							.trigger('ddAfterInit')
						;
					}
				});
			}
		}
	}
);

$.fn.ddYMap = function(params){
	var _this = $.ddYMap;
	
	return $(this).each(function(){
		_this.init(
			$.extend(
				params,
				{element: this}
			)
		);
	});
};
})(jQuery);