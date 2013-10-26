Colours
===========

Colours is a JQuery based plugin to provide an intuitive user interface for color picker, designed to behave like regular Bootstrap dropdowns

## Demo

See an example [here](http://shteinikov.com/p/colours/).

# Requirements

* [jQuery](http://jquery.com/) 1.10+ (untested, but it should work with ealier versions as well)

## Usage

Create your `<div>` with the `.colours` class.
```html
<div class="colours">Background color</div>
```    
or use JavaScript to bind to custom element:
```html
<div id="element">Background color</div>
<script>
	$('#element').colours();
</script>	
```   
Options can be passed via JavaScript.
```javascript
$('#element').colours({
  'color': 'red',
  'width': '50%',
  'name': 'example_name',
  'palette': ['red', 'green', 'blue']
});
```

... or you can pass options using `data-*` attributes:
```html
<div class="colours"
	data-color="white"
	data-name="background_color"
	data-palette="orange, lime, vodka">
	Background color
</div>
```

## Styles

You can use "bootstrap 2 like" styles:
```html
<link rel="stylesheet" href="dist/ido.colours.min.css">
```
... or use flat styles instead (bootstrap 3 like):
```html
<link rel="stylesheet" href="dist/ido.colours.flat.min.css">
```

## Configuration Options

Colours provides options to control its behavior and appearance. You can set options via JS or HTML `data-*` attributes:
```javascript
$('#element').colours({
	caption: 'Drinks',
	name: 'drinks',
	palette: ['wine', 'vodka', 'blood'],
	width: 100,
});
```
... is equal to:
```html
<div class="colours"
	data-name="drinks"
	data-palette="wine, vodka, blood"
	data-width="100px">
	Drinks
</div>
```
... or you can change options in runtime:
```javascript
$('#element').colours('color', 'lime') ;
$('#element').colours('width', 150) ;
```
**caption**

Caption of color picker (`data-caption`)
```javascript
$('#element').colours({
	caption: 'Text color'
});
```
**name**

Name of the hidden form field attached to color picker to store color value (`data-name`)
```javascript
$('#element').colours({
	name: 'text_color'
});
```
**color**

Selected color. If is not defined - pick the first one from palette (`data-color`)
```javascript
$('#element').colours({
	color: '#660152'
});
```
**width**

Width of the component. The width can be defined using all formats accepted by CSS: 100px, 50%, auto (`data-width`)
```javascript
$('#element').colours({
	width: 200
});
```
**disabled**

Disable the component.
```javascript
$('#element').colours({
	disabled: true
});
```
Also you can use `disabled` attribute: `<div class="colours" disabled>Background color</div>`

**palette**

Set the palette of available colors. You can pass array of strings or string with `,` divider (`data-palette`)
```javascript
$('#element').colours({
	palette: ['green', '#667788', 'white', '#333']
});
```
or ...
```javascript
$('#element').colours({
	palette: 'green, #667788, white, #333'
});
```
**palette_row_count**

Count of colors in palette popup's row. 5 by default (`data-palette-row-count`)
```javascript
$('#element').colours({
	palette_row_count: 5
});
```
**palette_size**

Size of palette colors elements in pixels. 42 by default (`data-palette-size`)
```javascript
$('#element').colours({
	palette_size: 42
});
```
## Events

Colours class exposes a few events for manipulating the colors.

**onColorSelect**

Fired when the color is selected.
```javascript
$('#element').colours({
	'onColorSelect': function(color) {
		...
	}
});
```
**onColorChange**

Fired when the color is changed during selected (only if old color != new color).
```javascript
$('#element').colours({
	'onColorChange': function(color) {
		...
	}
});
```
**onPaletteOver**

Fired when the mouse pointer is over any of palette colors
```javascript
$('#element').colours({
	'onPaletteOver': function(color) {
		...
	}
});
```
**onPaletteOut**

Fired when the mouse pointer is out of palette color
```javascript
$('#element').colours({
	'onPaletteOut': function(color) {
		...
	}
});
```
## Browser support

The project is tested in Chrome, Firefox, IE8+, iOS7 Safari. It Should Work™ in the current stable releases of Chrome, Firefox, Safari, IE.

## License

MIT licensed

Alex Shteinikov, http://shteinikov.com









