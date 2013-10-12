/* ============================================================
 * ido colour picker
 *
 * Create custom styled color picker for RE:Search data project
 * based on jQuery element:
 *    $('#example').researchColorPicker();
 *
 * Use data fields for settings:
 *  <div id="example"
         data-color="#red"
         data-name="cma_color_header"
         data-palette="#red, #green, #0000ff"
    >
         Background color
    </div>

 * ... where data-name is hidden form field name
 *
 * ============================================================ */

!function($) {
    'use strict';

    var IdoColourPicker = function(element) {
        var that = this;

        this.popup_class = 'ido_colour_popup';
        this.element_class = 'ido_colour_picker btn';

        this.$element = $(element);
        this.$popup = undefined;
        this.$input = undefined;
        this.isOpen = false;

        // Default values
        this.caption = this.$element.text();
        this.color = this.$element.data('color') || 'white';
        this.name = this.$element.data('name') || 'color';
        this.palette = this.$element.data('palette') || 'black, white';

        // Callbacks
        this.onSelectColor = undefined;
        this.onChangeColor = undefined;

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
                    that.isOpen = false
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
            var that = this,
                $caption = $('<div/>').addClass('rcp_caption').text(this.caption);

            this.$element
                .addClass(this.element_class)
                .text('');

            this.$color = $('<div/>').addClass('rcp_color').css('background-color', this.color);
            this.$input = $('<input/>')
                .attr('type', 'hidden')
                .attr('name', this.name)
                .val(this.color);

            this.$element.append([$caption, this.$color, this.$input]);

            this.$popup = that.createPopup();

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

        /*
         * Function to convert hex format to a rgb color
         */
        _rgb2hex: function(rgb) {
            var hex = function(x) {
                return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
            };

            try {
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
            catch (e) {
                return "#000000"
            }
        },

        /*
         * Helper for callbacks
         */
        _callback: function(callback_name) {
            // Execute callback if defined
            if (typeof this[callback_name] !== 'undefined') {
                return this[callback_name]();
            }
        },

        /*
         * Create popup with custom palette and bind events
         */
        createPopup: function(){
            var $popup = $('<div/>').addClass(this.popup_class).hide(),
                colors = this.palette.split(','),
                that = this;

            for (var i=0; i<colors.length; i++) {
                var $color_button = $('<div/>').css('background-color', $.trim(colors[i]));

                $color_button.on('click', function(e){
                    var color = $(this).css('background-color'),
                        oldcolor = that.$color.css('background-color');

                    that.$color.css('background-color', color);
                    that.$input.val(that._rgb2hex(color));

                    that.closePopup();

                    // Callbacks
                    that._callback('onSelectColor');

                    if (oldcolor !== color) {
                        that._callback('onChangeColor');
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
        },

        /*
         * Helper method for bind palette events easily
         */
        bind: function(event, func) {
            var that = this,
                items = that.$popup.find('> div');

            if (event === 'paletteclick') {
                items.on('click', func);
            }
            else if (event === 'paletteover') {
                items.on('mouseover', func);
            }
            else if (event === 'paletteout') {
                items.on('mouseout', func);
            }
            else if (event === 'select') {
                this.onSelectColor = func
            }
            else if (event === 'change') {
                this.onChangeColor = func
            }

            return this;
        }
    };

    $.fn.idoColours = function() {

        var chain = this.each(function () {

            var $this = $(this),
                data = $this.data('idoColours');

            if (!data) {
                $this.data('idoColours', new IdoColourPicker(this));
            }
        });

        return chain;
    };

}(window.jQuery);