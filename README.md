# jQuery.ddMap

A jQuery library that allows Yandex Maps to be rendered on a page in a simple way.

Right now the library works only with Yandex Maps, but in the future we are likely to add Google Maps and OpenStreetMap as well.

Features:
* You may not to think about including Yandex Map script, the library will do it automatically.
* You don't even have to worry about the container size, the lib will set default size if it is zero.
* If more than one marker is used, the map will be automatically scaled so that all markers are visible.
* The map size will be automatically updated each time the `resize` event will be triggered on the main container.


## Requires

* [jQuery](https://jquery.com/) >= 3.5.0 (not tested with older versions)
* [Yandex Maps JS API](https://yandex.com/dev/maps/jsapi/doc/2.1/) => 2.1 (will be included automatically if missing on a page)


## Usage


### 1. Include JS on page

```html
<!-- Required libs -->
<script src="jQuery-3.5.0.min.js"></script>

<!-- jQuery.ddMap -->
<script src="jQuery.ddMap-2.1.0.min.js"></script>
```

You may not to think about including Yandex Map script, the library will do it automatically.


### 2. Add a map container wherever you like on a page

```html
<body>
	<div class="map"></div>
</body>
```

You don't even have to worry about the container size, the lib will set default size if it is zero.


### 3. Run `jQuery.fn.ddMap`

```js
$('.map').ddMap({
	//You can add several markers if you want
	//If there is more than one marker, the map will be auto-scaled to make all the markers visible
	markers: [
		//At least one marker is required
		{
			//Geo position is required
			latLng: [
				51.532098,
				-0.178100
			],
			//Content is optional, you can avoid it
			content: '<p>Some marker text.</p>'
		}
	]
});
```

That's all!


## Parameters description


### `jQuery.fn.ddMap(params)`

* `params`
	* Desctription: The parameters.
	* Valid values: `objectPlain`
	* **Required**
	
* `params.markers`
	* Desctription: Array of markers to be put on the map.
		* If there is more than one marker, the map will be auto-scaled to make all the markers visible.
		* Also, a pair of coordinates still can be passed (like it was in 1.2 and earlier).
	* Valid values: `array`
	* **Required**
	
* `params.markers[i]`
	* Desctription: A marker data.
	* Valid values: `objectPlain`
	* **Required**
	
* `params.markers[i].latLng`
	* Desctription: Marker coordinates (latitude and longitude).
	* Valid values: `array`
	* **Required**
	
* `params.markers[i].content`
	* Desctription: Content of marker popup. HTML tags are supported.
	* Valid values: `string`
	* Default value: `''`
	
* `params.markers[i].icon`
	* Desctription: Custom marker icon data.
	* Valid values: `objectPlain`
	* Default value: — (default icon)
	
* `params.markers[i].icon.src`
	* Desctription: Address of an image.
	* Valid values: `string`
	* **Required**
	
* `params.markers[i].icon.size`
	* Desctription: Icon size.
	* Valid values: `objectPlain`
	* **Required**
	
* `params.markers[i].icon.size.width`
	* Desctription: Image width in px.
	* Valid values: `integer`
	* **Required**
	
* `params.markers[i].icon.size.height`
	* Desctription: Image height in px.
	* Valid values: `integer`
	* **Required**
	
* `params.apiKey`
	* Desctription: Yandex Maps API key.  
		_For now it is working without key, but Yandex mark it as required, so it is recommended to set it._
	* Valid values: `string`
	* Default value: —
	
* `params.defaultZoom`
	* Desctription: Default map zoom.
	* Valid values: `integer`
	* Default value: `15`
	
* `params.defaultType`
	* Desctription: Default map type.
	* Valid values:
		* `'map'` — schematic map
		* `'satellite'` — satellite map
		* `'hybrid'` — hybrid map
	* Default value: `'map'`
	
* `params.scrollZoom`
	* Desctription: Allow zoom by mouse wheel.
	* Valid values: `boolean`
	* Default value: `false`
	
* `params.mapCenterOffset`
	* Desctription: Center offset of the map with respect to the center of the map container in pixels.
	* Valid values: `array`
	* Default value: `[0, 0]`
	
* `params.markerOptions`
	* Desctription: Marker options.
	* Valid values: `objectPlain`
	* Default value: `{}`
	
* `params.controls`
	* Desctription: An array of controls to be added onto the map.
	* Valid values: `array`
	* Default value: `[{name: 'zoomControl'},{name: 'typeSelector'},{name: 'fullscreenControl'},{name: 'geolocationControl'},{name: 'rulerControl'}]`
	
* `params.mapOptions`
	* Desctription: Represents Yandex map options to be passed to the constructor.
	* Valid values: `objectPlain`
	* Default value: `{suppressMapOpenBlock: true}`


## Events description

All events are triggered at the main element to which `jQuery.fn.ddMap` has been applied.

* `ddBeforeInit` — Before initialisation (when the map API is ready, immediately before the map constructor is called).
* `ddAfterInit` — After initialisation.


## Links

* [Home page](https://code.divandesign.ru/jquery/ddmap)
* [Telegram chat](https://t.me/dd_code)
* [GitHub](https://github.com/DivanDesign/jQuery.ddMap)


<link rel="stylesheet" type="text/css" href="https://raw.githack.com/DivanDesign/CSS.ddMarkdown/master/style.min.css" />