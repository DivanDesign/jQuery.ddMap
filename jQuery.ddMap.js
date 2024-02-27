/**
 * jQuery.ddMap
 * @version 2.0 (2023-05-22)
 * 
 * @see {@link README.md}
 * 
 * @link https://code.divandesign.ru/jquery/ddmap
 * 
 * @copyright 2013–2023 [Ronef]{@link https://Ronef.ru }
 */

(function($){
	class ddMap {
		static isStaticInited = false;
		
		static initStatic(params){
			var theClass = this;
			
			if (!theClass.isStaticInited){
				theClass.isStaticInited = true;
				
				//If Yandex Maps API is not included yet
				if (typeof ymaps == 'undefined'){
					var apiSrc = '//api-maps.yandex.ru/2.1/?lang=' + navigator.language;
					
					if (params.apiKey.length > 0){
						apiSrc += '&apikey=' + params.apiKey;
					}
					
					$('head').append('<script defer src="' + apiSrc + '"></script>');
				}
			}
		}
		
		constructor(props){
			var
				theInstance = this,
				theClass = theInstance.constructor
			;
			
			theInstance.markers = new Array();
			theInstance.$element = 'map';
			theInstance.defaultZoom = 15;
			theInstance.defaultType = 'map';
			theInstance.scrollZoom = false;
			theInstance.mapCenterOffset = false;
			theInstance.markerOptions = {};
			theInstance.controls = [
				{name: 'zoomControl'},
				{name: 'typeSelector'},
				{name: 'fullscreenControl'},
				{name: 'geolocationControl'},
				{name: 'rulerControl'}
			];
			theInstance.mapOptions = {
				suppressMapOpenBlock: true
			};
			
			theInstance.apiConnectionAttempts = 0;
			
			theInstance.setProps(props);
			
			theClass.initStatic({
				apiKey:
					typeof props.apiKey == 'undefined' ?
					'' :
					props.apiKey
			});
			
			theInstance.constructor_init();
		}
		
		constructor_init(){
			var theInstance = this;
			
			//If Yandex map API is not loaded yet
			if (typeof ymaps == 'undefined'){
				theInstance.apiConnectionAttempts++;
				
				//Try again later but 10 attempts as maximum
				if (theInstance.apiConnectionAttempts < 10){
					setTimeout(
						theInstance.constructor_init.bind(theInstance),
						(
							500 +
							//Await + 100 ms after each attempt
							theInstance.apiConnectionAttempts * 100
						)
					);
				}
			}else{
				ymaps.ready(function(){
					var
						//Подготавливаем точки
						geoObjects = theInstance.prepareMarkers(),
						//Количество точек
						geoObjects_len = geoObjects.getLength()
					;
					
					//Если точки заданы
					if (geoObjects_len > 0){
						theInstance.$element = $(theInstance.$element);
						
						theInstance.$element.trigger('ddBeforeInit');
						
						//Delete all children
						theInstance.$element.empty();
						
						//Установим высоту у элемента, если она не задана
						if (theInstance.$element.height() == 0){
							theInstance.$element.height(400);
						}
						
						//Создаём карту
						var
							map = new ymaps.Map(
								theInstance.$element.get(0),
								{
									center: geoObjects.get(0).geometry.getCoordinates(),
									zoom: theInstance.defaultZoom,
									type: 'yandex#' + theInstance.defaultType,
									controls: []
								},
								theInstance.mapOptions
							)
						;
						
						//Если заданы котролы
						if(Array.isArray(theInstance.controls)){
							theInstance.controls.forEach(
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
						if (!theInstance.scrollZoom){
							//Выключим масштабирование колесом мыши (т.к. в 2.1 по умолчанию он включён)
							map.behaviors.disable('scrollZoom');
						}
						
						//Добавляем метки на карту
						map.geoObjects.add(geoObjects);
						
						//Если меток несколько
						if (geoObjects_len > 1){
							//Если элемент с картой скрыт
							if (theInstance.$element.is(':hidden')){
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
							Array.isArray(theInstance.mapCenterOffset) &&
							theInstance.mapCenterOffset.length == 2
						){
							var position = map.getGlobalPixelCenter();
							
							map.setGlobalPixelCenter([
								position[0] - theInstance.mapCenterOffset[0],
								position[1] - theInstance.mapCenterOffset[1]
							]);
						}
						
						theInstance.$element
							.on(
								'resize',
								() => {
									map.container.fitToViewport();
								}
							)
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
		
		prepareMarkers(){
			var
				theInstance = this,
				geoObjects = new ymaps.GeoObjectCollection()
			;
			
			if (!Array.isArray(theInstance.markers)){
				return geoObjects;
			}
			
			//Если передана просто пара координат
			if (
				theInstance.markers.length == 2 &&
				$.isNumeric(theInstance.markers[0]) &&
				$.isNumeric(theInstance.markers[1])
			){
				//Значит точка одна
				geoObjects.add(
					new ymaps.Placemark(
						theInstance.markers,
						{},
						theInstance.markerOptions
					)
				);
			}else{
				//Переберём все точки
				theInstance.markers.forEach(
					markerData => {
						//Если координаты заданы
						if (
							$.isPlainObject(markerData) &&
							Array.isArray(markerData.latLng) &&
							markerData.latLng.length == 2
						){
							var
								markerOptions = $.extend(
									true,
									{},
									theInstance.markerOptions
								)
							;
							
							//If marker has a custom icon
							if (
								typeof markerData.icon == 'object'
								&& typeof markerData.icon.src == 'string'
								&& markerData.icon.src.length > 0
								&& typeof markerData.icon.size == 'object'
								&& $.isNumeric(markerData.icon.size.width)
								&& $.isNumeric(markerData.icon.size.height)
							){
								markerData.icon.size.width = parseInt(markerData.icon.size.width);
								markerData.icon.size.height = parseInt(markerData.icon.size.height);
								
								markerOptions.iconLayout = 'default#image';
								markerOptions.iconImageHref = markerData.icon.src;
								markerOptions.iconImageSize = [
									markerData.icon.size.width,
									markerData.icon.size.height
								];
								markerOptions.iconImageOffset = [
									markerData.icon.size.width / -2,
									markerData.icon.size.height * -1
								];
							}
							
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
									markerOptions
								)
							);
						}
					}
				);
			}
			
			return geoObjects;
		}
		
		//This method from jQuery.ddUI
		/**
		 * @method setProps
		 * @version 1.1 (2023-04-22)
		 * 
		 * @desc Sets the ojbect properties.
		 * 
		 * @param [props] {objectPlain} — Object props values.
		 * @param props[propName] {mixed} — Key is property name, value is value.
		 * 
		 * @returns {void}
		 */
		setProps(props){
			var theInstance = this;
			
			if ($.isPlainObject(props)){
				Object.entries(props).forEach(
					([
						propName,
						propValue
					]) =>
					{
						//If the property exists
						if (typeof theInstance[propName] != 'undefined'){
							//Plain objects are extended, others are owerwrited
							if ($.isPlainObject(theInstance[propName])){
								$.extend(
									theInstance[propName],
									propValue
								);
							}else{
								theInstance[propName] = propValue;
							}
						}
					}
				);
			}
		}
	};
	
	$.fn.ddMap = function(params){
		return $(this).each(function(){
			new ddMap(
				$.extend(
					params,
					{
						$element: this
					}
				)
			)
		});
	};
})(jQuery);