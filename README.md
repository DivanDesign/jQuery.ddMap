# jQuery.ddMap

A jQuery library that allows Yandex Maps to be rendered on a page in a simple way.

Right now the library works only with Yandex Maps, but in the future we are likely to add Google Maps and OpenStreetMap as well.


## Requires

* [jQuery](https://jquery.com/) >= 3.5.0 (not tested with older versions)
* [Yandex Maps JS API](https://yandex.com/dev/maps/jsapi/doc/2.1/) => 2.1 (will be included automatically if missing on a page)


## Usage


### 1. Include JS on page

```html
<!-- Required libs -->
<script src="jQuery-3.5.0.min.js"></script>

<!-- jQuery.ddMap -->
<script src="jQuery.ddMap-2.0.0.min.js"></script>
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


## Links

* [Home page](https://code.divandesign.ru/jquery/ddmap)
* [Telegram chat](https://t.me/dd_code)
* [GitHub](https://github.com/DivanDesign/jQuery.ddMap)


<link rel="stylesheet" type="text/css" href="https://raw.githack.com/DivanDesign/CSS.ddMarkdown/master/style.min.css" />