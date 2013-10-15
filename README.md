Colours
===========

Colours is a JQuery based plugin to provide an intuitive user interface for color picker for, designed to behave like regular Bootstrap selects

## Demo

See an example [here](http://shteinikov.com/p/colours/).

# Requirements

* [jQuery](http://jquery.com/) 1.10+ (untested, but it should work with ealier versions as well)

## Usage

Create your `<div>` with the `.colours` class.

    <div class="colours">Background color</div>
    
or use JavaScript to bind to custom element:

	<div id="element">Background color</div>

    $('#element').colours();

Options can be passed via data attributes or JavaScript.

    $('#element').colours({
  		'color': 'red',
  		'width': '50%',
  		'name': 'example_name',
  		'palette': ['red', 'green', 'blue']
    });

or you can pass it using `data-*` attributes:

	  <div class="colours"
         data-color="white"
         data-name="background_color"
         data-palette="orange, lime, vodka">
        Background color
    </div>

## Configuration Options

Colours provides options to control its behavior and appearance. You can set options via JS or HTML `data-*` attributes:
    
    $('#element').colours({
      caption: 'Drinks',
      name: 'drinks',
      palette: ['wine', 'vodka', 'blood'],
      width: 100,
    });

... is equal to:

	  <div class="colours"
         data-name="drinks"
         data-palette="wine, vodka, blood"
         data-width="100px">
        Drinks
    </div>

... or you can change options in runtime:

	$('#element').colours('color', 'lime') ;
	$('#element').colours('width', 150) ;

**caption**

Caption of color picker

	$('#element').colours({
		caption: 'Text color'
	});

**name**

Name of the hidden form field attached to color picker to store color value

	$('#element').colours({
		name: 'text_color'
	});

**color**

Selected color. If is not defined - pick the first one from palette

	$('#element').colours({
		color: '#660152'
	});

**width**

Width of the component. The width can be defined using all formats accepted by CSS: 100px, 50%, auto

	$('#element').colours({
		width: 200
	});

**disabled**

Disable the component.

	$('#element').colours({
		disabled: true
	});

Also you can use `disabled` attribute: `<div class="colours" disabled>Background color</div>`

**palette**

Set the palette of available colors. You can pass array of strings or string with `,` divider

	$('#element').colours({
		palette: ['green', '#667788', 'white', '#333']
	});

or ...

	$('#element').colours({
		palette: 'green, #667788, white, #333'
	});

**palette_row_count**

Count of colors in palette popup's row. 5 by default

	$('#element').colours({
		palette_row_count: 5
	});

**palette_size**

Size of palette colors elements in pixels. 42 by default

	$('#element').colours({
		palette_size: 42
	});

## Events

Colours class exposes a few events for manipulating the colors.

**onSelectColor**

Fired when the color is selected.

	$('#element').colours({
		'onSelectColor': function(color, palette_color, element) {
			...
		}
	});

**onChangeColor**

Fired when the color is changed during selected (only if old color != new color).

	$('#element').colours({
		'onChangeColor': function(color, palette_color, element) {
			...
		}
	});

**onPaletteOver**

Fired when the mouse pointer is over any of palette colors

	$('#element').colours({
		'onPaletteOver': function(color, palette_color, element) {
			...
		}
	});

**onPaletteOut**

Fired when the mouse pointer is out of palette color

	$('#element').colours({
		'onPaletteOut': function(color, palette_color, element) {
			...
		}
	});

## Browser support

The project is tested in Chrome, Firefox, IE9+. It Should Work™ in the current stable releases of Chrome, Firefox, Safari, IE.

## License

MIT licensed

Alex Shteinikov, http://shteinikov.com









