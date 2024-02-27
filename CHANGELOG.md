# jQuery.ddMap changelog


## Version 2.1 (2024-02-27)
* \+ Parameters → `params.markers[i].icon`: The new optional parameter. Allows you to customaize marker icons.


## Version 2.0 (2023-05-22)
* \* The library has been renamed from `ddYMap` to `ddMap`: `jQuery.fn.ddYMap` → `jQuery.fn.ddMap`.
* \+ You may not to think about including Yandex Map script, the library will do it automatically.
* \+ The map size will be automatically updated each time the `resize` event will be triggered on the main container.
* \+ All children of the main element will be deleted during initialisation.
* \+ If Yandex Map API is not loaded, the script will await it.
* \* Parameters:
	* \+ `params.apiKey`: The new parameter. Yandex Maps API key. For now it is working without key, but Yandex mark it as required, so it is recommended to set it.
	* \* The following have been renamed:
		* \* `params.placemarks` → `params.markers`.
		* \* `params.placemarkOptions` → `params.markerOptions`.
	* \- `params.zoom`, `params.latLng`: The outdated names are no longer supported, use `params.defaultZoom` and `params.placemarks` instead.
* \+ Events → `ddBeforeInit`: The new event.
* \+ README, README_ru.
* \+ CHANGELOG, CHANGELOG_ru.
* \* Attention! Backward compatibility is broken.


## Version 1.4 (2015-07-23)
* \+ Parameters → `controls`: The new optional parameter. It is an array of controls to be added onto the map.
* \+ Parameters → `mapOptions`: The new optional parameter. It represents yandex map [options](https://tech.yandex.com/maps/doc/jsapi/2.1/ref/reference/Map-docpage/#param-options) to be passed to the constructor.


## Version 1.3.1 (2014-07-24)
* \* Hidden map with the several placemarks will be positioned on the first show.
* \* Empty height of the map element will be set to `400px`.


## Version 1.3 (2014-07-10)
* \* **Be advised!** The [2.1](http://api.yandex.ru/maps/api21.xml) version of Yandex Maps API is used!
* \+ The new `geolocation` and `full screen` controls have been added onto map.
* \* Parameters → `placemarks`:
	* \* The parameter has been renamed from `latLng` (the old name is still can be used, but it's recommended to use the new one).
	* \+ Now can be either an array of placemarks or a pair of coordinates. Each placemark can have its position as well as a tip that appears when clicked. The parameter can be, as before, a coordinate pair for the map center.
* \+ The map object (an instance of `ymaps.Map`) is now stored inside of the 'ddYmap' property of the map container (the one that `jQuery.fn.ddYMap` is applied to) via the jQuery.fn.data method of JQuery.
* \+ Events → `ddAfterInit`: The new event. It's attached to the map container and will be triggered after the map has been initialized.


## Version 1.2 (2014-06-05)
* \+ Parameters → `mapCenterOffset`: The new optional parameter. It allows center offset of the map to be set in pixels with respect to the center of the map container.
* \* Parameters → `defaultZoom`: The parameter has been renamed from `zoom` (the old name is still can be used, but it's recommended to use the new one).


## Version 1.1 (2014-03-16)
* \+ The `jQuery.fn.ddYMap` method has been added. The internal method `jQuery.ddYMap.init` is not recommended to use.
* \+ The `params.defaultType` parameter which allows to set default map type has been added.
* \- The redundant parameter `params.elementId` has been removed.
* \* The internal variable `elementId` has been ranamed as `element`.


## Version 1.0 (2013-07-12)
* \+ The first release.


<link rel="stylesheet" type="text/css" href="https://raw.githack.com/DivanDesign/CSS.ddMarkdown/master/style.min.css" />
<style>ul{list-style:none;}</style>