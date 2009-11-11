var TwtrapidUI = {
    current_status: function () {
        return new TwtrapidStatus($('.status.current'));
    },

    first_status: function () {
        return new TwtrapidStatus($('.status:first'));
    },

    last_status: function () {
        return new TwtrapidStatus($('.status:last'));
    },

    next_status: function (status) {
        return new TwtrapidStatus(status.jquery.next());
    },

    prev_status: function (status) {
        return new TwtrapidStatus(status.jquery.prev());
    },

    find_status_by_id: function (id) {
        return new TwtrapidStatus($('.status#' + id));
    },

    latest_status: function () {
        return this.first_status();
    },

    select_status: function (status) {
        this.unselect_status();
        status.set_selected(true);

        this.scroll_to_status(status);
    },

    unselect_status: function () {
        this.current_status().set_selected(false);
    },

    is_selected: function () {
        return this.current_status().jquery.length != 0;
    },

    scroll_to_status: function (status) {
        var d = ($(window).height() - status.jquery.height()) / 2;
        $.scrollTo(status.jquery, 0, {axis: 'y', offset: -d});
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
                TwtrapidUI.select_status(new TwtrapidStatus($(this)));
            });
    },

    create_status_header: function (status_json) {
        return $('<div class="ui-helper-clearfix status-header">')
            .append(this.create_icon(status_json))
            .append(this.create_name(status_json))
            .append(this.create_protected(status_json))
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
                status_json.favorited ? 'ui-state-active' : 'ui-state-default'
            );
    },

    create_protected: function (status_json) {
        return !status_json.user.protected ? $ :
            $('<div class="ui-corner-all ui-state-error container-element protected">')
            .append('<span class="ui-icon ui-icon-locked">');
    }
};
