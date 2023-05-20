# jQuery.ddMap

Библиотека jQuery, позволяющая подключить и использовать интерактивную карту на странице простым способом.

Сейчас работает только с Яндекс Картами, но в будущем, вероятно, добавим также Google Maps и OpenStreetMap.


## Использует

* [jQuery](https://jquery.com/) >= 3.5.0 (не тестировался с более ранними версиями)
* [JS API Яндекс Карт](https://yandex.ru/dev/maps/jsapi/doc/2.1/) >= 2.1 (подключится автоматически, если отсутствует на странице)


## Usage


### 1. Подключаем JS на странице

```html
<!-- Необходимые библиотеки -->
<script src="jQuery-3.5.0.min.js"></script>

<!-- jQuery.ddMap -->
<script src="jQuery.ddMap-2.0.0.min.js"></script>
```

Можно не думать о подключении скрипта Яндекс Карт, библиотека сделает это автоматически.


### 2. Добавляем контейнер карты в любое удобное место на странице

```html
<body>
	<div class="map"></div>
</body>
```

Вам даже не нужно беспокоиться о размере контейнера, библиотека поставит размер по умолчанию, если он нулевой.


### 3. Запускаем `jQuery.fn.ddMap`

```js
$('.map').ddMap({
	//Маркеров на карту можно добавить несколько 
	markers: [
		//Как минимум один обязателен
		{
			//Координаты обязательны
			latLng: [
				51.532098,
				-0.178100
			],
			//Контент опционален, можно опустить
			content: '<p>Some marker text.</p>'
		}
	]
});
```

Вот и всё!


## Ссылки

* [Home page](https://code.divandesign.ru/jquery/ddmap)
* [Telegram chat](https://t.me/dd_code)
* [GitHub](https://github.com/DivanDesign/jQuery.ddMap)


<link rel="stylesheet" type="text/css" href="https://raw.githack.com/DivanDesign/CSS.ddMarkdown/master/style.min.css" />