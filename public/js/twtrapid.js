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
        var msg = prompt('What are you doing?');
        if (msg) update(msg);
        break;
    default:
        /* do nothing */
    }
}

function get_friends_timeline() {
    var last_status_id = $('.status:last').attr('id');
    var params = (last_status_id) ? {since_id: last_status_id} : {};
    $.getJSON('/friends_timeline', params, function (data) {
        if (data.length == 0) return;

        sort_by_status_id(data);
        $.each(data, function (i, status) {
            insert_status(status);
        });
    });
}

function update(msg) {
    $.post('/update', {status: msg});
}

function select_next_status() {
    var current_status = $('.status.current');
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
    var current_status = $('.status.current');
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

function select_status(status_jquery) {
    status_jquery.addClass('ui-state-highlight current');

    var o = ($(window).height() - status_jquery.height()) / 2;
    $.scrollTo(status_jquery, 0, {axis: 'y', offset: -o});
}

function unselect_status(status_jquery) {
    status_jquery.removeClass('ui-state-highlight current');
}

function insert_status(status_jquery) {
    format_status(status_jquery).appendTo('#output');
}

function format_status(status_json) {
    var status = $('<div class="ui-widget-content ui-corner-all status">')
        .attr('id', status_json.id);

    var icon_container = $('<div class="icon-container">')
        .append(
            $('<img class="icon">')
                .attr('src', status_json.user.profile_image_url)
                .attr('alt', status_json.user.screen_name)
        );

    $('<div class="ui-helper-clearfix status-header">')
        .append(
            icon_container
        ).append(
            $('<div class="name">')
                .text(status_json.user.screen_name)
        ).appendTo(status);

    $('<div class="status-body">').html(status_json.text).appendTo(status);

    return status;
}

function sort_by_status_id(data) {
    data.sort(function (s1, s2) {
        return s1.id - s2.id;
    });
}
