$(function () {
    TwtrapidCommand.get_friends_timeline();
    setInterval(function () {
        TwtrapidCommand.get_friends_timeline();
    }, 60 * 1000);

    $(document).keypress(function (e) {
        execute_command(String.fromCharCode(e.which));
    });
});

function execute_command(ch) {
    switch (ch) {
      case 'j': TwtrapidCommand.select_next_status();  break;
      case 'k': TwtrapidCommand.select_prev_status();  break;
      case 'g': TwtrapidCommand.select_first_status(); break;
      case 'G': TwtrapidCommand.select_last_status();  break;
      case 'u': TwtrapidCommand.update();              break;
      case 'r': TwtrapidCommand.reply();               break;
      case 'R': TwtrapidCommand.retweet();             break;
      case 'f': TwtrapidCommand.favorite();            break;
      case 'o': TwtrapidCommand.open_link();           break;
    default: /* do nothing */
    }
}
