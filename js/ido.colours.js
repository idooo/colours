/*!
 * Colours 0.6.5
 * http://shteinikov/p/colours
 * MIT licensed
 */

(function($) {
    'use strict';

    var ColourPicker = function(element, options) {
        var that = this;

        this.popup_class = 'rcp-colour-popup';
        this.element_class = 'rcp-colour-picker';
        this.disabled_class = 'disabled';
        this.open_class = 'active';
        this.caption_class = 'rcp-caption';
        this.color_class = 'rcp-color';
        this.input_class = 'rcp-input';
        this.bottom_class = 'rcp-bottom';
        this.error_class = 'rcp-error';

        this.$element = $(element);
        this.$popup = undefined;
        this.$color = undefined;
        this.$caption = undefined;
        this.$input = undefined;
        this.isOpen = false;

        this.caption = options.caption || this.$element.text() || this.$element.data('caption');
        this.name = options.name || this.$element.data('name') || this.$element.attr('id') || 'color_picker';
        this.palette = this._parsePalette(options.palette || this.$element.data('palette') || 'black, white');
        this.color = options.color || this.$element.data('color') || this.palette[0];

        this.show_field = options.show_field || this.$element.data('show-field') || false;

        this.width = options.width || this.$element.data('width') || 0;

        this.disabled = this.$element.attr('disabled') || false;

        if (typeof options.disabled !== 'undefined') {
            this.disabled = options.disabled;
        }

        this.palette_row_count = options.palette_row_count || this.$element.data('palette-row-count') || 5;
        this.palette_size = options.palette_size || this.$element.data('palette-size') || 42;

        // Callbacks
        this.onColorSelect = options.onColorSelect || function(color){};
        this.onColorChange = options.onColorChange || function(color){};
        this.onPaletteOver = options.onPaletteOver || function(color){ };
        this.onPaletteOut = options.onPaletteOut || function(color){};

        this.init();

        // Global handler for mouse up event to close popups when user are
        // clicking outside the element
        $(document).mouseup(function (e) {
            var container = that.$popup;

            if (e.target.className !== that.input_class) {
                container.hide();
                that.$element.removeClass(that.open_class);

                that._checkValidInput();

                // We're changing isOpen state with short timeout after click event
                // was executed
                setTimeout(function(){
                    if (container.is(':hidden')) {
                        that.isOpen = false;
                    }
                }, 200);
            }
        });
    };

    ColourPicker.prototype = {

        constructor: ColourPicker,

        /*
         * Init colour picker: create nested elements (caption, colors, hidden
         * field), bind events
         */
        init: function () {
            var that = this;

            if (this.$element.is("input")) {
                var $old_element = this.$element;

                this.name = $old_element.attr('name') || this.name;
                this.color = $old_element.attr('value') || this.color;

                this.$element = $('<div/>').insertBefore($old_element);
                $old_element.remove();
            }

            this.$caption = $('<div/>').addClass(this.caption_class).text(this.caption);

            this.$element
                .addClass(this.element_class)
                .text('');

            this.$color = $('<div/>').addClass(this.color_class).css('background-color', this.color);

            this.$element.append([this.$caption, this.$color]);

            this.$popup = this._createPopup();
            this._resizePopup();

            this._bindPaletteCallbacks();

            if (this.width) {
                this.$element.css('width', this.width);
            }

            this.$element.on('click', function() {

                that._changePopupPosition();

                if (that.isOpen) {
                    that.close();
                }
                else {
                    if (!that.disabled) {
                        that.open();
                    }
                }
            });

            if (this.disabled) {
                this.disable();
            }

            return this;
        },

        refresh: function(update_palette) {
            this.$color.css('background-color', this.color);
            this.$input.val(this.color);

            this.$input.attr('name', this.name);
            this.$caption.text(this.caption);

            if (this.width) {
                this.$element.css('width', this.width);
            }

            if (this.disabled) {
                this.disable();
            }
            else {
                this.enable();
            }

            if (update_palette) {
                this.palette = this._parsePalette(this.palette);

                this.$popup.find('> div').remove();
                this._createPalette(this.$popup);
                this._resizePopup();

                this._bindPaletteCallbacks();

                if (this.palette.indexOf(this.color) === -1) {
                    this.color = this.palette[0];
                    this.refresh();
                }
            }

            return this;
        },

        /**
         * Function to convert hex format to a rgb color
         * @param rgb
         * @returns {*}
         * @private
         */
        _rgb2hex: function(rgb) {
            var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
            var hex = function(x) {
                return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
            };

            if (rgb[0] === '#') {
                return rgb;
            }
            else if (this._isColor(rgb)) {
                return '#' + rgb;
            }

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        },

        /**
         * Check if input is valid
         * and restore active color value if not
         * @private
         */
        _checkValidInput: function() {
            if (!this._isColor(this.$input.val())) {
                this.$input.val(this.color);
            }
            
            this.$input.removeClass(this.error_class);
        },

        _parsePalette: function(palette) {

            if ($.isArray(palette)) {
                return palette;
            }

            var colors = palette.split(',');
            for (var i=0; i<colors.length; i++) {
                colors[i] = $.trim(colors[i]);
            }

            return colors;
        },

        _bindPaletteCallbacks: function() {
            var that = this,
                items = this.$popup.find('> span');

            $.each(items, function(i, item) {
                var $item = $(item);

                $item
                    .unbind('mouseover')
                    .on('mouseover', function(){
                        return that.onPaletteOver(that._rgb2hex($item.css('background-color')));
                    });

                $item
                    .unbind('mouseout')
                    .on('mouseout', function(){
                        return that.onPaletteOut(that._rgb2hex($item.css('background-color')));
                    });
            });
        },

        _changeColor: function(color) {
            var old_color = this.$color.css('background-color');

            this.$color.css('background-color', color);
            this.$input.val(this._rgb2hex(color));

            // Callbacks
            this.onColorSelect(this._rgb2hex(color));

            if (old_color !== color) {
                this.onColorChange(this._rgb2hex(color));
            }

            this.color = color;
        },

        _createPalette: function($popup) {
            var that = this;

            for (var i=0; i<that.palette.length; i++) {
                var $color_button = $('<span/>').css({
                    'background-color': that.palette[i],
                    'width': that.palette_size,
                    'height': that.palette_size
                });

                $color_button.on('click', function(e){
                    var color = $(this).css('background-color');
                    that._changeColor(color);
                    that.close();

                    e.stopPropagation();
                    e.preventDefault();
                });

                $popup.append($color_button);
            }

            return this;
        },

        _resizePopup: function() {
            var $item = $(this.$popup.find(">:first-child")[0]),
                size = $item.outerWidth(true) * this.palette_row_count + 1;

            this.$popup.css('max-width', size);

            return this;
        },

        _isColor: function(color) {
            return (/(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)/i).test(color);
        },

        _createInputField: function() {
            // Create input field
            this.$input = $('<input/>')
                .attr('type', 'text')
                .addClass(this.input_class)
                .attr('name', this.name)
                .val(this.color)
                .on('click', function(e) { e.stopPropagation(); });

            var that = this;
            this.$input.on('keyup', function(e) {
                var color = that.$input.val();
                if (that._isColor(color)) {
                    that._changeColor(color);
                }
                else {
                    that.$input.addClass(that.error_class);
                }

                // Close popup on enter or esc
                try {
                    var keyCode = e.keyCode || e.which;
                    if ([13, 27].indexOf(keyCode) !== -1) {
                        that.close();
                        e.preventDefault();
                    }
                }
                catch (x) {}
            });

            return this.$input;
        },

        /**
         * Create popup with custom palette and bind events
         * @returns {*}
         * @private
         */
        _createPopup: function(){
            var $popup = $('<div/>')
                .addClass(this.popup_class)
                .hide();

            // Create palette
            this._createPalette($popup);

            // Create buffer div
            $('<div/>').css('clear', 'both').appendTo($popup);

            // Create bottom part with field
            var $bottom = $('<div/>')
                .addClass(this.bottom_class)
                .appendTo($popup);

            this._createInputField().appendTo($bottom);

            if (!this.show_field) {
                $bottom.hide();
            }

            $popup.prependTo(this.$element);

            return $popup;
        },

        _changePopupPosition: function(){

            var padding_left = this.$element.css('padding-left').replace("px", ""),
                padding_top = this.$element.css('padding-top').replace("px", ""),
                border_left = this.$element.css('border-left-width').replace("px", "");

            // IE 8 fix for popup positioning
            if (navigator.appVersion.indexOf("MSIE 8.") !== -1) {
                padding_left = parseInt(padding_left, 10) + this.$caption.outerWidth();
            }

            this.$popup.css({
                'margin-top': this.$element.outerHeight() - padding_top,
                'margin-left': - padding_left - border_left
            });

            return this;
        },

        open: function() {
            this.$popup.show();
            this.isOpen = true;
            this.$element.addClass(this.open_class);

            if (this.show_field) {
                this.$input.focus();
            }
            return this;
        },

        close: function() {
            this.$popup.hide();
            this.isOpen = false;
            this.$element.removeClass(this.open_class);

            this._checkValidInput();

            return this;
        },

        disable: function() {
            this.disabled = true;
            this.$element.addClass(this.disabled_class);
            return this;
        },

        enable: function() {
            this.disabled = false;
            this.$element.removeClass(this.disabled_class);
            return this;
        }

    };

    $.fn.colours = function(option, val) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data('Colours'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('Colours', (data = new ColourPicker(this, $.extend({}, options))));
            }
            if (typeof option === 'string') {
                var update_palette = false,
                    palette_options = [
                        'palette', 'onPaletteOver', 'onPaletteOut', 'palette_size', 'palette_row_count'
                    ];

                if (palette_options.indexOf(option) > -1) {
                    update_palette = true;
                }

                data[option] = val;
                data.refresh(update_palette);
            }

        });
    };

    $('.colours').colours();

})(window.jQuery);
