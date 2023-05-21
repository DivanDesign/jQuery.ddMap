/**
 * jQuery.ddMap
 * @version 1.4 (2015-07-23)
 * 
 * @see {@link README.md}
 * 
 * @link https://code.divandesign.ru/jquery/ddmap
 * 
 * @copyright 2013–2015 [Ronef]{@link https://Ronef.ru }
 */

(function($){
	$.extend(
		true,
		{
			ddMap: {
				defaults: {
					markers: new Array(),
					element: 'map',
					defaultZoom: 15,
					defaultType: 'map',
					scrollZoom: false,
					mapCenterOffset: false,
					markerOptions: {},
					controls: [
						{name: 'zoomControl'},
						{name: 'typeSelector'},
						{name: 'fullscreenControl'},
						{name: 'geolocationControl'},
						{name: 'rulerControl'}
					],
					mapOptions: {
						suppressMapOpenBlock: true
					},
					apiKey: ''
				},
				
				isStaticInited: false,
				apiConnectionAttempts: 0,
				
				prepareMarkers: function(params){
					var geoObjects = new ymaps.GeoObjectCollection();
					
					if (!Array.isArray(params.markers)){
						return geoObjects;
					}
					
					//Если передана просто пара координат
					if (
						params.markers.length == 2 &&
						$.isNumeric(params.markers[0]) &&
						$.isNumeric(params.markers[1])
					){
						//Значит точка одна
						geoObjects.add(
							new ymaps.Placemark(
								params.markers,
								{},
								params.markerOptions
							)
						);
					}else{
						//Переберём все точки
						params.markers.forEach(
							markerData => {
								//Если координаты заданы
								if (
									$.isPlainObject(markerData) &&
									Array.isArray(markerData.latLng) &&
									markerData.latLng.length == 2
								){
									//Создаём метку
									geoObjects.add(
										new ymaps.Placemark(
											markerData.latLng,
											{
												balloonContent:
													typeof markerData.content == 'string' ?
													$.trim(markerData.content) :
													''
											},
											params.markerOptions
										)
									);
								}
							}
						);
					}
					
					return geoObjects;
				},
				
				initStatic: function(params){
					var theLib = this;
					
					if (!theLib.isStaticInited){
						theLib.isStaticInited = true;
						
						//If Yandex Maps API is not included yet
						if (typeof ymaps == 'undefined'){
							var apiSrc = '//api-maps.yandex.ru/2.1/?lang=' + navigator.language;
							
							if (params.apiKey.length > 0){
								apiSrc += '&apikey=' + params.apiKey;
							}
							
							$('head').append('<script defer src="' + apiSrc + '"></script>');
						}
					}
				},
				
				init: function(params){
					var theLib = this;
					
					params = $.extend(
						{},
						theLib.defaults,
						params
					);
					
					theLib.initStatic({
						apiKey: params.apiKey
					});
					
					//If Yandex map API is not loaded yet
					if (typeof ymaps == 'undefined'){
						theLib.apiConnectionAttempts++;
						
						//Try again later but 10 attempts as maximum
						if (theLib.apiConnectionAttempts < 10){
							setTimeout(
								theLib.init.bind(theLib, params),
								(
									500 +
									//Await + 100 ms after each attempt
									theLib.apiConnectionAttempts * 100
								)
							);
						}
					}else{
						ymaps.ready(function(){
							var
								//Подготавливаем точки
								geoObjects = theLib.prepareMarkers(params),
								//Количество точек
								geoObjects_len = geoObjects.getLength()
							;
							
							//Если точки заданы
							if (geoObjects_len > 0){
								params.$element = $(params.$element);
								
								params.$element.trigger('ddBeforeInit');
								
								//Delete all children
								params.$element.empty();
								
								//Установим высоту у элемента, если она не задана
								if (params.$element.height() == 0){
									params.$element.height(400);
								}
								
								//Создаём карту
								var
									map = new ymaps.Map(
										params.$element.get(0),
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
										'ddMap',
										{map: map}
									)
									.trigger('ddAfterInit')
								;
							}
						});
					}
				}
			}
		}
	);
	
	$.fn.ddMap = function(params){
		var theLib = $.ddMap;
		
		return $(this).each(function(){
			theLib.init(
				$.extend(
					params,
					{
						$element: this
					}
				)
			);
		});
	};
})(jQuery);