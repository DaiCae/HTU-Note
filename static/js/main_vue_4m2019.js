//$.toast.prototype.defaults.duration = 1500;
/*
$(function() {
  FastClick.attach(document.body);
});
* */
if (Vue && window.vuelidate) {
  Vue.use(window.vuelidate.default);
}

window.exam = window.exam || {};

$(function () {
  $('.weui-cells__title.collapsible').each(function () {
    var $t = $(this);
    $t.append('<span class="right-tip">折叠 <i class="la la-angle-up"></i></span>');

    var $tip = $t.find('.right-tip');
    $t.on('click', function () {
      var $body = $t.next().find('> *:not(.stay)');
      if ($t.hasClass('collapsed')) {
        $tip.html('折叠 <i class="la la-angle-up"></i>');
        $body.show();
        $t.removeClass('collapsed');
      } else {
        $tip.html('展开 <i class="la la-angle-down"></i>');
        $body.hide();
        $t.addClass('collapsed');
      }
    });

    if ($t.hasClass('collapsed')) {
      $tip.html('展开 <i class="la la-angle-down"></i>');
      var $body = $t.next().find('> *:not(.stay)');
      $body.hide();
    }
  });
});

exam.request = function (url, cb, method, data, silent, errCb) {
  method = method || 'get';
  data = data || {};

  if (!$.isLoading() && !silent && cb !== 'toast') {
    $.showLoading();
  }

  $.ajax({
    method: method,
    url: url,
    data: data
  }).done(function (resp) {
    $.hideLoading();
    if (!resp.success) {
      if (!silent) {
        exam.error(resp.message, function () {
          if (errCb) {
            errCb(resp);
          }
        });
      } else {
        if (errCb) {
          errCb(resp);
        }
      }
      return
    }
    if (!cb) {
      cb = function () {};
    } else if (cb === true) {
      cb = function (resp) {
        if (resp.success) {
          exam.success(resp.message)
        }
      }
    } else if (cb === 'toast') {
      if (resp.success) {
        exam.toast(resp.message || '保存成功！', resp.message ? 'primary' : 'success')
      }
    }
    if (typeof(cb) === 'function') {
      cb(resp)
    }
  }).fail(function (xhr) {
    $.hideLoading();
    var resp = {
      success: false,
      message: '保存失败：' + (xhr.statusText || '未知错误') + '。请检查网络连接'
    };
    if (!silent) {
      setTimeout(function () {
        exam.error(resp.message, function () {
          if (errCb) {
            errCb(resp);
          }
        });
      }, 400);
    } else {
      if (errCb) {
        errCb(resp);
      }
    }
  });
};

exam.success = function (text, cb, duration) {
  weui.toast(text || '操作成功！', {duration: duration || 2000, callback:cb || function(){}});
};

exam.error = function (text, cb) {
  weui.alert(text || '操作失败！', cb, {
    title: '错误'
  });
};

exam.toast = function (text, type, timeout) {
  type = type || 'primary';
  text = text || '操作成功！';
  var icon = '<i class="las la-info mr-5"></i>';
  if (type === 'success') {
    icon = '<i class="las la-check mr-5"></i>';
  } else if (type === 'danger') {
    icon = '<i class="las la-times mr-5"></i>';
  }
  var $el = $('<div class="exam-toast bg-' + type + '">' + icon + ' ' + text + '</div>');
  $el.appendTo('body');
  setTimeout(function () {
    $el.remove();
  }, timeout || 2000);
}

exam.noTabBar = function () {
  $(function () {
    $('#btmbar').remove();
  });
};

exam.checkedIds = function (arr) {
  return _.map(_.filter(arr, function (c) {
    return c.checked
  }), function (c) {
    return c.id
  })
}

exam.checkObjectsById = function (arr, ids) {
  _.forEach(arr, function (v, k) {
    if (_.includes(ids, v.id)) {
      v.checked = true
    }
  })
}

exam.timeFromPicker = function (v) {
  return moment(v[0] + '-' + v[1] + '-' + v[2] + ' ' + v[3] + ':' + v[4]);
}

exam.valueForTimePicker = function (timestamp) {
  var m = moment.unix(timestamp);
  return [
    m.year().toString(),
    _.padStart(m.month() + 1, 2, '0'),
    _.padStart(m.date(), 2, '0'),
    _.padStart(m.hour(), 2, '0'),
    _.padStart(m.minute(), 2, '0')
  ];
}

exam.setValueForTimePicker = function (picker, timestamp) {
  var m = moment.unix(timestamp);
  $(picker).val(m.format('YYYY-MM-DD HH:mm'));
}

exam.trackFrameHeight = function (iframe) {
  setInterval(function () {
    var method = iframe[0].contentWindow.getContentHeight;
    if (method) {
      iframe.height(method());
    }
  }, 100);
}

exam.groupSelectData = function (items) {
  var result = [
    {
      title: '我创建的',
      items: []
    },
    {
      title: '公用',
      items: []
    }
  ];
  _.forEach(items, function (v, k) {
    var index = v.teacher_id ? 0 : 1;
    result[index].items.push(v);
  })
  return result;
}

if (!$.showLoading) {
  $.showLoading = function (content, option) {
    content = content || '加载中...';
    $(weui.loading(content))
        .stop(true, true)
        .show()
        .find('.weui-toast__content').text(content);
  };

  $.hideLoading = function () {
    $('body > .weui-loading_toast').fadeOut('fast');
  };
}

$.isLoading = function () {
  return $('body > .weui-loading_toast:visible').length;
};

$(document).ajaxError(function () {
    $.hideLoading();
});
