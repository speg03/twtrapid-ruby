var TwtrapidCommand = {
    get_friends_timeline: function () {
        var last_status_id = $('.status:first').attr('id');
        var params = (last_status_id) ? {since_id: last_status_id} : {};
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
        var current_status = $('.status.current');
        if (current_status.length == 0) return;

        var current_id = current_status.attr('id');
        var name = TwtrapidUI.unlink_text(current_status.find('.name').html());
        var text = TwtrapidUI.unlink_text(current_status.find('.status-body').html());

        var msg = prompt('Reply to ' + name + ': ' + text);
        if (msg) {
            msg = '@' + name + ' ' + msg;
            $.post('/update', {status: msg, in_reply_to_status_id: current_id});
        }
    },

    retweet: function () {
        var current_status = $('.status.current');
        if (current_status.length == 0) return;

        var name = TwtrapidUI.unlink_text(current_status.find('.name').html());
        var text = TwtrapidUI.unlink_text(current_status.find('.status-body').html());

        var msg = prompt('Retweet of ' + name + ': ' + text);
        msg = msg ? msg + ' ' : '';
        msg = msg + 'RT @' + name + ': ' + text;
        $.post('/update', {status: msg});
    },

    favorite: function () {
        var current_status = $('.status.current');
        if (current_status.length == 0) return;

        var current_id = current_status.attr('id');
        $.post('/favorites_create', {id: current_id}, function () {
            alert('favorited!');
        });
    },

        open_link: function () {
            $('.status.current a.status-link').each(function () {
                window.open($(this).attr('href'));
            });
        },

    select_next_status: function () {
        var current_status = $('.status.current');
        if (current_status.length == 0) {
            TwtrapidUI.select_status($('.status:first'));
            return;
        }

        if (current_status.attr('id') == $('.status:last').attr('id')) {
            return;
        }

        var next_status = current_status.next();
        TwtrapidUI.select_status(next_status);
    },

    select_prev_status: function () {
        var current_status = $('.status.current');
        if (current_status.length == 0) {
            TwtrapidUI.select_status($('.status:first'));
            return;
        }

        if (current_status.attr('id') == $('.status:first').attr('id')) {
            return;
        }

        var prev_status = current_status.prev();
        TwtrapidUI.select_status(prev_status);
    },

    select_first_status: function () {
        TwtrapidUI.select_status($('.status:first'));
    },

    select_last_status: function () {
        TwtrapidUI.select_status($('.status:last'));
    }
};
