var TwtrapidCommand = {
    get_friends_timeline: function () {
        var latest_status = TwtrapidUI.latest_status();
        var latest_status_id = latest_status.id();
        var params = (latest_status_id) ? {since_id: latest_status_id} : {};
        $.getJSON('/home_timeline', params, function (data) {
            if (data.length == 0) return;

            data.reverse();
            $.each(data, function (i, status) {
                TwtrapidUI.insert_status(status);
            });
        });
    },

    update: function () {
        var msg = prompt('What are you doing?');
        if (msg) $.post('/update', {status: msg}, this.get_friends_timeline);
    },

    reply: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var id = current_status.id();
        var name = current_status.name();
        var text = current_status.text();

        var msg = prompt('Reply to ' + name + ': ' + text, '@' + name + ' ');
        if (msg) {
            $.post('/update', {status: msg, in_reply_to_status_id: id}, this.get_friends_timeline);
        }
    },

    retweet: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var id = current_status.id();
        var name = current_status.name();
        var pname = current_status.is_protected() ? '<protected>' : name;
        var text = current_status.text();

        var msg = prompt('Retweet of ' + name + ': ' + text, 'RT @' + pname + ': ' + text);
        if (msg) {
            $.post('/update', {status: msg}, this.get_friends_timeline);
        }
    },

    favorite: function () {
        if (!TwtrapidUI.is_selected()) return;
        var current_status = TwtrapidUI.current_status();

        var state = current_status.is_favorited();
        var path = state ? '/favorites_destroy' : '/favorites_create';
        $.post(path, {id: current_status.id()}, function (result) {
            var json = eval('(' + result + ')');
            var s = TwtrapidUI.find_status_by_id(json.id);
            s.set_favorited(!state);
        });
    },

    open_link: function () {
        var urls = TwtrapidUI.current_status().urls();
        for (var i = 0; i < urls.length; ++i) {
            window.open(urls[i]);
        }
    },

    select_next_status: function () {
        if (!TwtrapidUI.is_selected()) {
            this.select_first_status();
            return;
        }

        var current_status = TwtrapidUI.current_status();
        var current_id = current_status.id();
        var last_id = TwtrapidUI.last_status().id();
        if (current_id == last_id) return;

        var next_status = TwtrapidUI.next_status(current_status);
        TwtrapidUI.select_status(next_status);
        TwtrapidUI.scroll_to_status(next_status);
    },

    select_prev_status: function () {
        if (!TwtrapidUI.is_selected()) {
            this.select_first_status();
            return;
        }

        var current_status = TwtrapidUI.current_status();
        var current_id = current_status.id();
        var first_id = TwtrapidUI.first_status().id();
        if (current_id == first_id) return;

        var prev_status = TwtrapidUI.prev_status(current_status);
        TwtrapidUI.select_status(prev_status);
        TwtrapidUI.scroll_to_status(prev_status);
    },

    select_first_status: function () {
        var first_status = TwtrapidUI.first_status();
        TwtrapidUI.select_status(first_status);
        TwtrapidUI.scroll_to_status(first_status);
    },

    select_last_status: function () {
        var last_status = TwtrapidUI.last_status();
        TwtrapidUI.select_status(last_status);
        TwtrapidUI.scroll_to_status(last_status);
    }
};
