var TwtrapidCommand = {
    get_friends_timeline: function () {
        var latest_status = TwtrapidUI.latest_status();
        var latest_status_id = TwtrapidUI.status_id(latest_status);
        var params = (latest_status_id) ? {since_id: latest_status_id} : {};
        $.getJSON('/friends_timeline', params, function (data) {
            if (data.length == 0) return;

            data.reverse();
            $.each(data, function (i, status) {
                TwtrapidUI.insert_status(status);
            });
        });
    },

    update: function () {
        var msg = prompt('What are you doing?');
        if (msg) $.post('/update', {status: msg});
    },

    reply: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var current_id = TwtrapidUI.status_id(current_status);
        var name = TwtrapidUI.status_name(current_status);
        var text = TwtrapidUI.status_text(current_status);

        var msg = prompt('Reply to ' + name + ': ' + text);
        if (msg != null) {
            msg = '@' + name + ' ' + msg;
            $.post('/update', {status: msg, in_reply_to_status_id: current_id});
        }
    },

    retweet: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var name = TwtrapidUI.status_name(current_status);
        var text = TwtrapidUI.status_text(current_status);

        var msg = prompt('Retweet of ' + name + ': ' + text);
        if (msg != null) {
            if (msg != '') msg += ' ';
            msg = msg + 'RT @' + name + ': ' + text;
            $.post('/update', {status: msg});
        }
    },

    favorite: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var path = TwtrapidUI.is_favorited(current_status) ?
            '/favorites_destroy' : '/favorites_create';
        var current_id = current_status.attr('id');
        $.post(path, {id: current_id}, function (result) {
            var json = eval('(' + result + ')');
            var s = $('.status#' + json.id);
            TwtrapidUI.toggle_favorite(s);
        });
    },

    open_link: function () {
        TwtrapidUI.current_status().find('a').each(function () {
            if ($(this).text().match(/^https?:\/\//)) {
                window.open($(this).attr('href'));
            }
        });
    },

    select_next_status: function () {
        if (!TwtrapidUI.is_selected()) {
            TwtrapidUI.select_status(TwtrapidUI.first_status());
            return;
        }

        var current_status = TwtrapidUI.current_status();
        var current_id = TwtrapidUI.status_id(current_status);
        var last_id = TwtrapidUI.status_id(TwtrapidUI.last_status());
        if (current_id == last_id) return;

        var next_status = current_status.next();
        TwtrapidUI.select_status(next_status);
    },

    select_prev_status: function () {
        if (!TwtrapidUI.is_selected()) {
            TwtrapidUI.select_status(TwtrapidUI.first_status());
            return;
        }

        var current_status = TwtrapidUI.current_status();
        var current_id = TwtrapidUI.status_id(current_status);
        var first_id = TwtrapidUI.status_id(TwtrapidUI.first_status());
        if (current_id == first_id) return;

        var prev_status = current_status.prev();
        TwtrapidUI.select_status(prev_status);
    },

    select_first_status: function () {
        TwtrapidUI.select_status(TwtrapidUI.first_status());
    },

    select_last_status: function () {
        TwtrapidUI.select_status(TwtrapidUI.last_status());
    }
};
