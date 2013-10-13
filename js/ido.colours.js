/*!
 * ido Colours 0.8.0
 * http://shteinikov/p/colours
 * MIT licensed
 */

(function($) {
    'use strict';

    var IdoColourPicker = function(element, options) {
        var that = this;

        this.popup_class = 'ido_colour_popup';
        this.element_class = 'ido_colour_picker';
        this.disabled_class = 'disabled';
        this.open_class = 'active';

        this.$element = $(element);
        this.$popup = undefined;
        this.$color = undefined;
        this.$caption = undefined;
        this.$input = undefined;
        this.isOpen = false;

        this.caption = options.caption || this.$element.text();
        this.name = options.name || this.$element.data('name') || this.$element.attr('id') || 'color_picker';
        this.palette = this._parsePalette(options.palette || this.$element.data('palette') || 'black, white');
        this.color = options.color || this.$element.data('color') || this.palette[0];

        this.width = options.width || this.$element.data('width') || 0;

        this.disabled = this.$element.attr('disabled') || false;

        if (typeof options.disabled !== 'undefined') {
            this.disabled = options.disabled;
        }

        this.palette_row_count = options.palette_row_count || this.$element.data('palette-row-count') || 5;
        this.palette_size = options.palette_size || this.$element.data('palette-size') || 42;

        // Callbacks
        this.onSelectColor = options.onSelectColor || function(color, item, $object){};
        this.onChangeColor = options.onChangeColor || function(color, item, $object){};
        this.onPaletteOver = options.onPaletteOver || function(color, item, $object){ };
        this.onPaletteOut = options.onPaletteOut || function(color, item, $object){};

        this.init();

        // Global handler for mouse up event to close popups when user are
        // clicking outside the element
        $(document).mouseup(function (e) {
            var container = that.$popup;

            if ((!container.is(e.target) && container.has(e.target).length === 0) ) {
                container.hide();
                that.$element.removeClass(that.open_class);
            }

            // We're changing isOpen state with short timeout after click event
            // was executed
            setTimeout(function(){
                if (container.is(':hidden')) {
                    that.isOpen = false;
                }
            }, 200);
        });
    };

    IdoColourPicker.prototype = {

        constructor: IdoColourPicker,

        /*
         * Init colour picker: create nested elements (caption, colors, hidden
         * field), bind events
         */
        init: function () {
            var that = this;

            this.$caption = $('<div/>').addClass('rcp_caption').text(this.caption);

            this.$element
                .addClass(this.element_class)
                .text('');

            this.$color = $('<div/>').addClass('rcp_color').css('background-color', this.color);
            this.$input = $('<input/>')
                .attr('type', 'hidden')
                .attr('name', this.name)
                .val(this.color);

            this.$element.append([this.$caption, this.$color, this.$input]);

            this.$popup = this._createPopup();
            this._resizePopup();

            this._bindPaletteCallbacks();

            if (this.width) {
                this.$element.css('width', this.width);
            }

            this.$element.on('click', function() {

                that.changePopupPosition();

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

        /*
         * Function to convert hex format to a rgb color
         */
        _rgb2hex: function(rgb) {

            var result = "#000000",
                hex = function(x) {
                    return ("0" + parseInt(x, 16).toString(16)).slice(-2);
                };

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            try {
                result = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
            catch (e) { }

            return result;
        },

        _parsePalette: function(palette) {

            if (Array.isArray(palette)) {
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
                items = this.$popup.find('> div');

            $.each(items, function(i, item) {
                var $item = $(item);

                $item
                    .unbind('mouseover')
                    .on('mouseover', function(){
                        return that.onPaletteOver(that._rgb2hex($item.css('background-color')), this, that);
                    });

                $item
                    .unbind('mouseout')
                    .on('mouseout', function(){
                        return that.onPaletteOut(that._rgb2hex($item.css('background-color')), this, that);
                    });
            });
        },

        _createPalette: function($popup) {
            var that = this;

            for (var i=0; i<that.palette.length; i++) {
                var $color_button = $('<div/>').css({
                    'background-color': that.palette[i],
                    'width': that.palette_size,
                    'height': that.palette_size
                });

                $color_button.on('click', function(e){
                    var color = $(this).css('background-color'),
                        oldcolor = that.$color.css('background-color');

                    that.$color.css('background-color', color);
                    that.$input.val(that._rgb2hex(color));

                    that.close();

                    // Callbacks
                    that.onSelectColor(that._rgb2hex(color), this, that);

                    if (oldcolor !== color) {
                        that.onChangeColor(that._rgb2hex(color), this, that);
                    }

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

        /*
         * Create popup with custom palette and bind events
         */
        _createPopup: function(){
            var $popup = $('<div/>').addClass(this.popup_class).hide();

            this._createPalette($popup);
            $popup.insertBefore(this.$element);

            return $popup;
        },

        changePopupPosition: function(){
            this.$popup.css('margin-top', this.$element.outerHeight() + 2);
            return this;
        },

        open: function() {
            this.$popup.show();
            this.isOpen = true;
            this.$element.addClass(this.open_class);
            return this;
        },

        close: function() {
            this.$popup.hide();
            this.isOpen = false;
            this.$element.removeClass(this.open_class);
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

    $.fn.idoColours = function(option, val) {

        return this.each(function () {

            var $this = $(this),
                data = $this.data('idoColours'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('idoColours', (data = new IdoColourPicker(this, $.extend({}, options))));
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

    $('[data-provide="ido-colours"]').idoColours();

})(window.jQuery);