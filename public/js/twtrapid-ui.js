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
        this.format_status(status_json).prependTo('#output');
    },

    format_status: function (status_json) {
        var status = $('<div class="ui-widget-content ui-corner-all status">')
            .attr('id', status_json.id);

        var icon_container = $('<div class="icon-container">')
            .append(
                $('<img class="icon">')
                    .attr('src', status_json.user.profile_image_url)
                    .attr('alt', status_json.user.screen_name)
            );

        var name = status_json.user.screen_name.replace(
                /(.*)/, "<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>");
        var name_container = $('<div class="name">').html(name);

        var favorite_container = $('<div class="ui-widget-content ui-corner-all ui-state-default favorite">')
            .append($('<span class="ui-icon ui-icon-star" style="float: left;">'));
        favorite_container.addClass(
            eval(status_json.favorited) ? 'ui-state-active' : 'ui-state-default');

        $('<div class="ui-helper-clearfix status-header">')
            .append(icon_container)
            .append(name_container)
            .append(favorite_container)
            .appendTo(status);

        var text = this.link_text(status_json.text);
        $('<div class="status-body">').html(text).appendTo(status);

        status.click(function () {
            TwtrapidUI.select_status($(this));
        });

        return status;
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
