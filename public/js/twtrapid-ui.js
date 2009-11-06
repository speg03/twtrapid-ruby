var TwtrapidUI = {
    select_status: function (status_jquery) {
        this.unselect_status();
        status_jquery.addClass('ui-state-highlight current');

        var o = ($(window).height() - status_jquery.height()) / 2;
        $.scrollTo(status_jquery, 0, {axis: 'y', offset: -o});
    },

    unselect_status: function () {
        $('.status.current').removeClass('ui-state-highlight current');
    },

    insert_status: function (status_json) {
        this.create_status(status_json).prependTo('#output');
    },

    create_status: function (status_json) {
        return $('<div class="ui-widget-content ui-corner-all status">')
            .attr('id', status_json.id)
            .append(this.create_status_header(status_json))
            .append(this.create_status_body(status_json))
            .append(this.create_status_footer(status_json));
    },

    create_status_header: function (status_json) {
        return $('<div class="ui-helper-clearfix status-header">')
            .append(this.create_icon(status_json))
            .append(this.create_name(status_json))
            .append(this.create_favorite(status_json));
    },

    create_status_body: function (status_json) {
        var text = this.link_text(status_json.text);

        return $('<div class="status-body">')
            .html(text);
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

    link_text: function (text) {
        var linked_text = text.replace(
            /(https?:\/\/[\w-.!~*'();/?:@&=+$,%#]+)/g,
            "<a href=\"$1\" class=\"status-link\" target=\"_blank\">$1</a>");
        linked_text = linked_text.replace(
            /@(\w+)/g,
            "@<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>");
        return linked_text;
    },

    unlink_text: function (text) {
        return text.replace(/<[^>]*>/g, '');
    },

    favorite_status: function (status_jquery) {
        var s = status_jquery.find('.favorite');
        s.removeClass('ui-state-default');
        s.addClass('ui-state-active');
    }
};
