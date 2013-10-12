/*!
 * ido Colours 0.8.0
 * http://shteinikov/p/colours
 * MIT licensed
 *
 * Alex Shteinikov, http://shteinikov.com
 */

(function($) {
    'use strict';

    var IdoColourPicker = function(element, options) {
        var that = this;

        this.popup_class = 'ido_colour_popup';
        this.element_class = 'ido_colour_picker btn';

        this.$element = $(element);
        this.$popup = undefined;
        this.$color = undefined;
        this.$caption = undefined;
        this.$input = undefined;
        this.isOpen = false;

        this.caption = options.caption || this.$element.text();
        this.name = options.name || this.$element.data('name') || 'color';
        this.palette = this._parsePalette(options.palette || this.$element.data('palette') || 'black, white');
        this.color = options.color || this.$element.data('color') || this.palette[0];

        // Callbacks
        this.onSelectColor = options.onSelectColor || function(color, $color, $object){};
        this.onChangeColor = options.onChangeColor || function(color, $color, $object){};
        this.onPaletteOver = options.onPaletteOver || function(color, $color, $object){ };
        this.onPaletteOut = options.onPaletteOut || function(color, $color, $object){};

        this.init();

        // Global handler for mouse up event to close popups when user are
        // clicking outside the element
        $(document).mouseup(function (e) {
            var container = that.$popup;

            if ((!container.is(e.target) && container.has(e.target).length === 0) ) {
                container.hide();
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

            this.$popup = that.createPopup();

            this._bindPaletteCallbacks();

            this.$element.on('click', function() {
                that.changePopupPosition();

                if (that.isOpen) {
                    that.closePopup();
                }
                else {
                    that.openPopup();
                }
            });

            return this;
        },

        refresh: function(update_palette) {
            this.$color.css('background-color', this.color);
            this.$input.val(this.color);

            this.$input.attr('name', this.name);
            this.$caption.text(this.caption);

            if (update_palette) {
                this.palette = this._parsePalette(this.palette);
                this._bindPaletteCallbacks();
            }

            console.log(update_palette);

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
                        return that.onPaletteOver(that._rgb2hex($item.css('background-color')), $item, that);
                    });

                $item
                    .unbind('mouseout')
                    .on('mouseout', function(){
                        return that.onPaletteOut(that._rgb2hex($item.css('background-color')), $item, that);
                    });
            });
        },

        /*
         * Create popup with custom palette and bind events
         */
        createPopup: function(){
            var $popup = $('<div/>').addClass(this.popup_class).hide(),
                that = this;

            for (var i=0; i<that.palette.length; i++) {
                var $color_button = $('<div/>').css('background-color', that.palette[i]);

                $color_button.on('click', function(e){
                    var color = $(this).css('background-color'),
                        oldcolor = that.$color.css('background-color');

                    that.$color.css('background-color', color);
                    that.$input.val(that._rgb2hex(color));

                    that.closePopup();

                    // Callbacks
                    that.onSelectColor(that._rgb2hex(color), $color_button, that);

                    if (oldcolor !== color) {
                        that.onChangeColor(that._rgb2hex(color), $color_button, that);
                    }

                    e.stopPropagation();
                    e.preventDefault();
                });

                $popup.append($color_button);
            }
            $popup.insertBefore(that.$element);

            return $popup;
        },

        changePopupPosition: function(){
            this.$popup.css('margin-top', this.$element.outerHeight() + 2);
            return this;
        },

        openPopup: function() {
            this.$popup.show();
            this.isOpen = true;
            return this;
        },

        closePopup: function() {
            this.$popup.hide();
            this.isOpen = false;
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
                    palette_options = ['palette', 'onPaletteOver', 'onPaletteOut'];

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