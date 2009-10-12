$(function () {
    get_friends_timeline();
    setInterval(function () {
        get_friends_timeline();
    }, 60 * 1000);

    $(document).keypress(function (e) {
        execute_command(String.fromCharCode(e.which));
    });
});

function execute_command(ch) {
    switch (ch) {
    case 'j':
        select_next_status();
        break;
    case 'k':
        select_prev_status();
        break;
    case 'u':
        var status = prompt();
        if (status) update_status(status);
        break;
    default:
        /* do nothing */
    }
}

function update_status(s) {
    $.post('/statuses/update.json', {status: s});
}

function get_friends_timeline() {
    var last_status_id = $('.status:last').attr('id');
    var params = (last_status_id) ? {since_id: last_status_id} : {};
    $.getJSON('/statuses/friends_timeline.json', params, function (data) {
        if (data.length == 0) return;

        sort_by_status_id(data);
        $.each(data, function (i, status) {
            insert_status(status);
        });
    });
}

function select_next_status() {
    var current_status = $('.current');
    if (current_status.length == 0) {
        select_status($('.status:first'));
        return;
    }

    if (current_status.attr('id') == $('.status:last').attr('id')) {
        return;
    }
    unselect_status(current_status);

    var next_status = current_status.next();
    select_status(next_status);
}

function select_prev_status() {
    var current_status = $('.current');
    if (current_status.length == 0) {
        select_status($('.status:first'));
        return;
    }

    if (current_status.attr('id') == $('.status:first').attr('id')) {
        return;
    }
    unselect_status(current_status);

    var prev_status = current_status.prev();
    select_status(prev_status);
}

function select_status(status) {
    status.addClass('current');

    var o = ($(window).height() - status.height()) / 2;
    $.scrollTo(status, 0, {axis: 'y', offset: -o});
}

function unselect_status(status) {
    status.removeClass('current');
}

function insert_status(status) {
    format_status(status).appendTo('#output');
}

function format_status(status) {
    var status_line = $('<div class="status">');
    status_line.attr('id', status.id);

    $('<img class="icon">')
        .attr('src', status.user.profile_image_url)
        .attr('alt', status.user.screen_name)
        .appendTo(status_line);

    $('<span class="name">')
        .text(status.user.screen_name)
        .appendTo(status_line);

    $('<span class="text">')
        .html(': ' + status.text)
        .appendTo(status_line);

    return status_line;
}

function sort_by_status_id(data) {
    data.sort(function (s1, s2) {
        return s1.id - s2.id;
    });
}
