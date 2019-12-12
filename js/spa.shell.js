spa.shell = (function ($) {
  var configMap;
  var stateMap;
  var jqueryMap;
  var setJqueryMap;
  var initModule;
  var toggleChat;
  var onClickChat;
  var copyAnchorMap;
  var changeAnchorPart;
  var onHashchange;

  configMap = {
    anchor_schema_map: {
      chat: {
        open: true,
        closed: true
      }
    },
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
    anchor_map: {},
    is_chat_retracted: true
  };

  jqueryMap = {};

  copyAnchorMap = function () {
    return $.extend(true, {}, stateMap.anchor_map);
  }

  changeAnchorPart = function (arg_map) {
    var anchor_map_revise;
    var bool_return;
    var key_name;
    var key_name_dep;

    anchor_map_revise = copyAnchorMap();
    bool_return = true;

    KEYVAL:
    for (key_name in arg_map){
      if (arg_map.hasOwnProperty(key_name)) {
        if (key_name.indexOf('_' === 0)) {
          continue KEYVAL;
        }
        anchor_map_revise[key_name] = arg_map[key_name];
        key_name_dep = '_' + key_name;
        if (arg_map[key_name_dep]) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        } else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    try {
      $.uriAnchor.setAnchor(anchor_map_revise);
    } catch (error) {
      $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
      bool_return = false;
    }
    return bool_return;
  }

  onHashchange = function (event) {
    var anchor_map_previous;
    var anchor_map_proposed;
    var _s_chat_previous;
    var _s_chat_proposed;
    var s_chat_proposed;

    anchor_map_previous = copyAnchorMap();

    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch (error) {
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
    }
  }

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
    if (toggleChat(stateMap.is_chat_retracted)) {
      $.uriAnchor.setAnchor({
        chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
      });
    };
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
}(jQuery));