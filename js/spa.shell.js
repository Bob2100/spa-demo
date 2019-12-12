spa.shell = (function () {
  var configMap;
  var stateMap;
  var jqueryMap;
  var setJqueryMap;
  var initModule;
  var toggleChat;
  var onClickChat;

  configMap = {
    main_html: `
      <div class="spa-shell-head">
        <div class="spa-shell-head-logo"></div>
        <div class="spa-shell-head-acct"></div>
        <dic class="spa-shell-head-search"></dic>
      </div>
      <div class="spa-shell-main">
        <div class="spa-shell-main-nav"></div>
        <div class="spa-shell-main-content"></div>
      </div>
      <div class="spa-shell-foot"></div>
      <div class="spa-shell-chat"></div>
      <div class="spa-shell-modal"></div>
    `,
    chat_extend_time: 1000,
    chat_retract_time: 300,
    chat_extend_height: 450,
    chat_retract_height: 15,
    chat_extended_title: 'Click to retract',
    chat_retractd_title: 'Click to extend'
  };

  stateMap = {
    $container: null,
    is_chat_retracted: true
  };

  jqueryMap = {};

  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
  };

  toggleChat = function (do_extend, callback) {
    var px_chat_ht;
    var is_open;
    var is_closed;
    var is_sliding;

    px_chat_ht = jqueryMap.$chat.height();
    is_open = px_chat_ht === configMap.chat_extend_height;
    is_closed = px_chat_ht === configMap.chat_retract_height;
    is_sliding = !is_open && !is_closed;

    if (is_sliding) {
      return false;
    }

    if (do_extend) {
      jqueryMap.$chat.animate(
        {
          height: configMap.chat_extend_height
        },
        configMap.chat_extend_time,
        function () {
          jqueryMap.$chat.attr(
            'title', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if (callback) {
            callback(jqueryMap.$chat);
          }
        }
      );
      return true;
    }
    jqueryMap.$chat.animate(
      {
        height: configMap.chat_retract_height
      },
      configMap.chat_retract_time,
      function () {
        jqueryMap.$chat.attr(
          'title', configMap.chat_retractd_title
        );
        stateMap.is_chat_retracted = true;
        if (callback) {
          callback(jqueryMap.$chat);
        }
      }
    );
    return true;
  };

  onClickChat = function (event) {
    toggleChat(stateMap.is_chat_retracted);
    return false;
  };

  initModule = function ($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr('title', configMap.chat_retractd_title)
      .click(onClickChat);
  };

  return { initModule: initModule };
}());