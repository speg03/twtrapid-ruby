var TwtrapidUI = {
    current_status: function () {
        return $('.status.current');
    },

    first_status: function () {
        return $('.status:first');
    },

    last_status: function () {
        return $('.status:last');
    },

    latest_status: function () {
        return this.first_status();
    },

    select_status: function (status_jquery) {
        this.unselect_status();
        status_jquery.addClass('ui-state-highlight current');

        this.scroll_to_status(status_jquery);
    },

    unselect_status: function () {
        this.current_status().removeClass('ui-state-highlight current');
    },

    is_selected: function () {
        return this.current_status().length != 0;
    },

    scroll_to_status: function (status_jquery) {
        var d = ($(window).height() - status_jquery.height()) / 2;
        $.scrollTo(status_jquery, 0, {axis: 'y', offset: -d});
    },

    insert_status: function (status_json) {
        this.create_status(status_json).prependTo('#output');
    },

    create_status: function (status_json) {
        return $('<div class="ui-widget-content ui-corner-all status">')
            .attr('id', status_json.id)
            .append(this.create_status_header(status_json))
            .append(this.create_status_body(status_json))
            .append(this.create_status_footer(status_json))
            .click(function () {
                TwtrapidUI.select_status($(this));
            });
    },

    create_status_header: function (status_json) {
        return $('<div class="ui-helper-clearfix status-header">')
            .append(this.create_icon(status_json))
            .append(this.create_name(status_json))
            .append(this.create_favorite(status_json));
    },

    create_status_body: function (status_json) {
        return $('<div class="status-body">')
            .html(TwtrapidUtil.create_link(status_json.text));
    },

    create_status_footer: function (status_json) {
        return $('<div class="dummy">').hide();
    },

    create_icon: function (status_json) {
        return $('<div class="container-element">')
            .append(
                $('<img class="icon">')
                    .attr('src', status_json.user.profile_image_url)
                    .attr('alt', status_json.user.screen_name)
            );
    },

    create_name: function (status_json) {
        var name = status_json.user.screen_name.replace(
            /(.*)/,
            "<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>"
        );

        return $('<div class="container-element name">')
            .html(name);
    },

    create_favorite: function (status_json) {
        return $('<div class="ui-corner-all ui-state-default container-element favorite">')
            .append(
                $('<span class="ui-icon ui-icon-star">')
            ).addClass(
                eval(status_json.favorited) ? 'ui-state-active' : 'ui-state-default'
            );
    },

    toggle_favorite: function (status_jquery) {
        var s = status_jquery.find('.favorite');
        if (this.is_favorited(status_jquery)) {
            s.removeClass('ui-state-active');
            s.addClass('ui-state-default');
        }
        else {
            s.removeClass('ui-state-default');
            s.addClass('ui-state-active');
        }
    },

    is_favorited: function (status_jquery) {
        return status_jquery.find('.favorite').hasClass('ui-state-active');
    },

    status_id: function (status_jquery) {
        return status_jquery.attr('id');
    },

    status_name: function (status_jquery) {
        var name = status_jquery.find('.name').html();
        return TwtrapidUtil.untag(name);
    },

    status_text: function (status_jquery) {
        var text = status_jquery.find('.status-body').html();
        return TwtrapidUtil.untag(text);
    }
};
