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
        return $('<div class="ui-widget-content ui-corner-all ui-helper-clearfix status">')
            .attr('id', status_json.id)
            .append(this.create_icon_container(status_json))
            .append(this.create_status_container(status_json))
            .click(function () {
                TwtrapidUI.select_status(new TwtrapidStatus($(this)));
            });
    },

    create_icon_container: function (status_json) {
        return $('<div class="icon-container">')
            .append(this.create_icon(status_json));
    },

    create_status_container: function (status_json) {
        return $('<div class="status-container">')
            .append(this.create_status_header(status_json))
            .append(this.create_status_body(status_json))
            .append(this.create_status_footer(status_json));
    },

    create_status_header: function (status_json) {
        return $('<div class="ui-helper-clearfix status-header">')
            .append(this.create_name(status_json))
            .append(this.create_protected(status_json));
    },

    create_status_body: function (status_json) {
        return $('<div class="status-body">')
            .append(this.create_text(status_json));
    },

    create_status_footer: function (status_json) {
        return $('<div class="ui-helper-clearfix status-footer">')
            .append(this.create_retweet(status_json))
            .append(this.create_reply(status_json))
            .append(this.create_favorite(status_json))
            .append(this.create_source(status_json))
            .append(this.create_time(status_json));
    },

    create_icon: function (status_json) {
        return $('<img class="icon">')
            .attr('src', status_json.user.profile_image_url)
            .attr('alt', status_json.user.screen_name);
    },

    create_name: function (status_json) {
        var name = status_json.user.screen_name.replace(
            /(.*)/,
            "<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>"
        );

        return $('<div class="header-element name">')
            .html(name);
    },

    create_text: function (status_json) {
        return $('<div class="body-element text">')
            .html(TwtrapidUtil.create_link(status_json.text));
    },

    create_time: function (status_json) {
        return $('<div class="footer-element time">')
            .html(new Date(status_json.created_at).toString());
    },

    create_source: function (status_json) {
        var source = $('<div class="footer-element source">')
            .html('from ' + status_json.source);

        source.find('a').attr('target', '_blank');
        return source;
    },

    create_protected: function (status_json) {
        return !status_json.user.protected ? $ :
            $('<div class="ui-corner-all ui-state-error header-element button protected">')
            .append('<span class="ui-icon ui-icon-locked button-element">')
            .append($('<span class="button-element">').text('Protected'));
    },

    create_favorite: function (status_json) {
        return $('<div class="ui-corner-all ui-state-default footer-element button favorite">')
            .append($('<span class="ui-icon ui-icon-star button-element">'))
            .append($('<span class="button-element">').text('Favorite'))
            .addClass(status_json.favorited ? 'ui-state-active' : 'ui-state-default');
    },

    create_reply: function (status_json) {
        return $('<div class="ui-corner-all ui-state-default footer-element button reply">')
            .append($('<span class="ui-icon ui-icon-arrowreturnthick-1-w button-element">'))
            .append($('<span class="button-element">').text('Reply'));
    },

    create_retweet: function (status_json) {
        return $('<div class="ui-corner-all ui-state-default footer-element button retweet">')
            .append($('<span class="ui-icon ui-icon-refresh button-element">'))
            .append($('<span class="button-element">').text('Retweet'));
    }
};
