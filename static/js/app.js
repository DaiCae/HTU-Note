//询问框
_modaltpl = '<div class="modal fade" id="automodal_<%=idindex%>" tabindex="-1" role="dialog" aria-hidden="true">\
    <div class="modal-dialog  modal-sm modal-dialog-centered" role="document">\
        <div class="modal-content gradient-green  z4">\
            <div class="modal-header">\
                <h5 class="modal-title" id="exampleModalLabel"><%=title%></h5>\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
                    <span aria-hidden="true">×</span>\
                </button>\
            </div>\
            <form method="<%=method%>" <% if(action.length>0){ %> action="<%=action%>" <% } %> >\
            <input type="hidden" name="op" value="<%=op%>">\
            <div class="modal-body"><%=body%><%=bodyext%></div>\
            <div class="modal-footer">\
                <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>\
                <button type="submit" class="btn btn-primary">提交</button>\
            </div>\
            </form>\
        </div>\
    </div>\
</div>';

/*
<%= variable %>
<% if {} %>
<% for(var i = 0; i < buttons.length; i++){ %>
可能某些情况下模板里无法出现单引号，自己想办法用html自定义属性等方法来解决单引号的问题
*/
function tpl2html(tpl, data) {
    code = 'var p=[];with(this){p.push(\'' +
        tpl.replace(/[\r\t\n]/g, ' ')
            .split('<%').join('\t')
            .replace(/((^|%>)[^\t]*)'/g, '$1\r')
            .replace(/\t=(.*?)%>/g, '\',$1,\'')
            .split('\t').join('\');')
            .split('%>').join('p.push(\'')
            .split('\r').join('\\\'')
        + '\');}return p.join(\'\');';
    return new Function(code).apply(data);
}

function text2html(_text) {
    return _text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n?|\n/g, "<br>");
}

//加载script，目前如果页面上有requirejs，对于支持amd的文件就没法用了。有requirejs的话，就用requirejs吧就不要用我了。
function loadScript(url, callback, _key4unique) {
    //看有没有已经加载过的
    var _scripts = document.getElementsByTagName('script');
    for (var _sk = 0; _sk < _scripts.length; _sk++) {
        var _s = _scripts[_sk];
        if (_s.innerHTML.trim() != '')//代码块
            continue;
        var _k4u = _s.getAttribute('key4unique');
        var _url = _s.getAttribute('src');
        if (
            (typeof (_key4unique) == 'string' && typeof (_k4u) == 'string' && _k4u == _key4unique)
            ||
            (typeof (_url) == 'string' && _url == url)
        ) {
            callback();
            return;
        }
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    // && !isOpera
    if (script.attachEvent && !(script.attachEvent.toString && script.attachEvent.toString().indexOf('[native code') < 0)) {
        script.attachEvent('onreadystatechange', function (_evt) {
            if (_evt.type === 'load' || (readyRegExp.test((_evt.currentTarget || _evt.srcElement).readyState))) {
                callback(_evt);
            }
        });
    } else {
        script.addEventListener('load', function (_evt) {
            if (_evt.type === 'load' || (readyRegExp.test((_evt.currentTarget || _evt.srcElement).readyState))) {
                callback(_evt);
            }
        }, false);
        //script.addEventListener('error', context.onScriptError, false);
    }

    if (typeof (_key4unique) != 'undefined')
        script.setAttribute('key4unique', _key4unique);
    script.src = url;
    //空页面浏览器会自己补head
    document.getElementsByTagName("head")[0].appendChild(script);
}

var ktmfautoindex = 1;

function modal(_data) {
    _data['idindex'] = ktmfautoindex++;//理论上没有问题，防止有问题
    _html = tpl2html(_modaltpl, _data);
    $(_html).modal();
}

function modal_promot(_fieldname, _attr) {
    _dft = '';
    _placeholder = '';
    if (typeof (_attr.default) != 'undefined')
        _dft = _attr.default;
    if (typeof (_attr.placeholder) != 'undefined')
        _placeholder = _attr.placeholder;

    _attr['body'] = '<input type="text" class="form-control" name="' + _fieldname + '" value="' + _dft + '" placeholder="' + _placeholder + '" >';

    _attr = $.extend({
        title: '请输入',
        method: 'post',
        placeholder: '',
        default: '',
        action: '',
        op: '',
        body: '',
        bodyext: ''
    }, _attr);

    modal(_attr);
}

function modal_select(_fieldname, _list, _attr) {
    _html = '<select class="form-control" name="' + _fieldname + '" >';
    $.each(_list, function (_k, _v) {
        if (typeof (_v.value) != 'undefined')
            _value = _v.value;
        else if (typeof (_v.id) != 'undefined')
            _value = _v.id;
        else
            _value = _k;

        _html += '<option value="' + _value + '">' + _v.name + '</option>';
    });
    _html += '</select>';

    _attr['body'] = _html;
    _attr = $.extend({
        title: '请选择',
        method: 'post',
        action: '',
        op: '',
        body: '',
        bodyext: '',
    }, _attr);

    modal(_attr);
}

function modal_form(_fields, _attr) {

}

function weuitimepicker(_ele) {
    var _that = _ele;

    var _h = [];
    var _i = 0;
    for (_i = 0; _i < 24; _i++)
        _h.push({label: _i + '时', value: _i});

    var _m = [];
    for (_i = 0; _i < 60; _i++)
        _m.push({label: _i + '分', value: _i});

    var _s = [];
    for (_i = 0; _i < 60; _i++)
        _s.push({label: _i + '秒', value: _i});

    weui.picker(_h, _m, _s, {
        defaultValue: [7, 40, 0],
        onChange: function (result) {
            console.log(result);
        },
        onConfirm: function (result) {
            $(_that).val(zeroPad(result[0]) + ':' + zeroPad(result[1]) + ':' + zeroPad(result[2]))
                .trigger('change');
        },
        id: 'timePicker',
        title: '选择时间'
    });

}

function weuitimepicker_nos(_ele, callback, defaultValue, id) {
    var _that = _ele;

    var _h = [];
    var _i = 0;
    for (_i = 0; _i < 24; _i++)
        _h.push({label: zeroPad(_i) + '时', value: _i});

    var _m = [];
    for (_i = 0; _i < 60; _i++)
        _m.push({label: zeroPad(_i) + '分', value: _i});

    if (typeof defaultValue === 'string' && defaultValue) {
        var parts = defaultValue.split(':');
        defaultValue = parts.map(function (part) {
            return parseInt(part);
        });
    } else if (!defaultValue) {
        defaultValue = [7, 40];
    }

    weui.picker(_h, _m, {
        defaultValue: defaultValue,
        onConfirm: function (result) {
            var newValue = zeroPad(result[0]) + ':' + zeroPad(result[1]);
            $(_that).val(newValue).trigger('change');

            if (callback) {
                callback(result, newValue);
            }
        },
        id: id || 'timeNosPicker',
        title: '选择时间'
    });

}

//选择年月日时分秒，可以重复使用，还可以有空重写一个，年月日时分5列在一个面板上
function weuidatetimepicker(_ele) {
    var _that = _ele;
    var _date = '';

    var showSecond = !['rd[fn_907]', 'rd[fn_2379]'].includes($(_ele).attr('name'));

    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();


    weui.datePicker({
        onConfirm: function onConfirm(result) {
            _date = result[0] + '-' + zeroPad(result[1]) + '-' + zeroPad(result[2]) + ' ';
        },
        onClose: function onClose() {
            if (_date == '')
                return;


            var _h = [];
            var _i = 0;
            for (_i = 0; _i < 24; _i++)
                _h.push({label: _i + '时', value: _i});

            var _m = [];
            for (_i = 0; _i < 60; _i++)
                _m.push({label: _i + '分', value: _i});

            var params = [_h, _m];
            if (showSecond) {
                var _s = [];
                for (_i = 0; _i < 60; _i++)
                    _s.push({label: _i + '秒', value: _i});
                params.push(_s);
            }
            params.push({
                defaultValue: [h, m, 0],
                onChange: function (result) {
                    //console.log(result);
                },
                onConfirm: function (result) {
                    var s = _date + zeroPad(result[0]) + ':' + zeroPad(result[1]);
                    if (showSecond) {
                        s += ':' + zeroPad(result[2]);
                    }
                    $(_that).val(s).trigger('change');
                },
                id: 'timePicker',
                title: '选择时间（' + _date + '）'
            });
            weui.picker.apply(weui.picker, params);

        },
        id: 'datePicker',
        title: '选择日期'
    });


}

function zeroPad(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}


function calendarDraw(_year, _month) {
    date = new Date(_year, _month, 0);
    var currentMaxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();  //当前月 - 最大天
    var prevMaxDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();         //上一月
    var nextMaxDay = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate();     //下一月
    date.setDate(1);
    var currentWeek = date.getDay();    //当月1日是星期几？
    if (currentWeek == 0) {
        currentWeek = 7;
    }
    date = new Date(_year, _month, 0);
    var html = "<table class='calendarDrawTable'><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>";
    _index = 0;

    for (var i = 1; i <= currentWeek % 7; i++) {
        if (_index % 7 == 0)
            html += "</tr><tr>";
        _index++;
        html += "<td></td>";
    }
    //遍历当前月
    for (var j = 1; j <= currentMaxDay; j++) {
        if (_index % 7 == 0)
            html += "</tr><tr>";
        _index++;

        _dta = new Array();
        _dta.push(_year);
        _dta.push(zeroPad(_month));
        _dta.push(zeroPad(j));

        html += '<td dt="' + _dta.join('') + '">' + j + '</td>';
    }
    html += "</tr></table>";

    //上一个月
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    if (currentMonth == 1) {
        PrevYear = currentYear - 1;
        PrevMonth = 12;
    } else {
        PrevYear = currentYear;
        PrevMonth = currentMonth - 1;
    }
    //下一个月
    if (currentMonth == 12) {
        NextYear = currentYear + 1;
        NextMonth = 1;
    } else {
        NextYear = currentYear;
        NextMonth = currentMonth + 1;
    }
    return {
        html: html,
        cur: {year: _year, month: _month},
        prev: {year: PrevYear, month: PrevMonth},
        next: {year: NextYear, month: NextMonth}
    };
}

$(function () {
    //textarea自动撑开
    $('textarea.form-control,textarea.layui-textarea').each(function () {
        $(this).css('height', Math.max(this.scrollHeight, 66) + 'px');
        $(this).css('overflow-y', 'hidden');
    }).on('input', function () {
        $(this).css('height', 'auto');
        $(this).height(Math.max(this.scrollHeight, 33));
    });

});

//学生信息卡片
function bjmf_studentinfo(_course_id, _student_id) {


    $.get('/teacher/course/' + _course_id + '/data/student/' + _student_id, function (_si) {
        _info = '姓名:' + _si.name + "\n";
        _info += '学号:' + _si.no + "\n";
        _info += '性别:' + _si.sex + "\n";
        _info += '班级:' + _si.groupname + "\n";

        if (typeof _si.roomname != 'undefined')
            _info += '宿舍:' + _si.roomname + "\n";
        alert(_info);

    }, 'json');
}


//文件上传处理
function html_upload_js(_eleid, role, path, options) {

    //看是不是已经渲染创建过了，避免重复创建
    if ($('#bjmfuploader_' + _eleid).length > 0)
        return;

    $('#' + _eleid).after('<input type="file" name="files[]" id="bjmfuploader_' + _eleid + '" multiple>');
    if (typeof (kkbupfileschged) != "function") {
        var cdn = window.sitecdn === undefined ? '//c.d8n.cn' : window.sitecdn;
        $('<link rel="stylesheet" type="text/css" href="' + cdn + '/res/upload/css/jquery.filer.css?v=20201105">').appendTo('body');

        // 下面这个暂时不能用 cdn，否则会报 filer_default_opts 未定义
        $('<script src="/res/upload/js/jquery.filer.min.js?2022" type="text/javascript"></' + 'script>').appendTo('body');

        window.kkbupfileschged = function (_filea, _id) {
            $("#" + _id).val(JSON.stringify(_filea))
        }
    }

    _files = eval($("#" + _eleid + "").val())
    if (!_files) _files = [];
    filer_default_opts.ossRole = role;
    filer_default_opts.ossPath = path || '';
    $("#bjmfuploader_" + _eleid + "").filer($.extend({
        changeInput: filer_default_opts.changeInput2,
        showThumbs: true,
        theme: "dragdropbox",
        templates: filer_default_opts.templates,
        dragDrop: filer_default_opts.dragDrop,
        uploadFile: filer_default_opts.uploadFile,
        onRemove: filer_default_opts.onRemove,
        onRemoved: filer_default_opts.onRemoved,
        files: _files
    }, options))

}

function get_current_role() {
    var path = location.pathname;
    var role = 'student';
    if (path.startsWith('/teacher')) {
        role = 'teacher';
    } else if (path.startsWith('/org')) {
        role = 'org';
    }
    return role;
}

function html_upload_js_auto(id, options, path) {
    path = path || location.pathname;
    var role = get_current_role();
    html_upload_js(id || 'attachment', role, path, options);
}

function upload_file_directly(file, name, callback) {
    if (typeof (kkbupfileschged) != "function") {
        $('<script src="/res/upload/js/jquery.filer.min.js?2022" type="text/javascript"></' + 'script>').appendTo('body');
    }
    filer_default_opts.ossRole = get_current_role();
    filer_default_opts.ossPath = location.pathname;

    var filter = {
        uploadFile: '/uploadfile'
    };
    var formData = new FormData();
    filer_default_opts.prepareKey(filter, formData, name, function (config) {
        var host = location.hostname;
        var local = host.startsWith('localhost') || host.endsWith('.local') || host.endsWith('.hans')
            || !config || !config.host;
        var fieldName = local ? 'files[]' : 'file';
        var url = local ? '/uploadfile' : config.host;
        formData.append(fieldName, file);

        var oReq = new XMLHttpRequest();
        oReq.open("POST", url, true);
        oReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        oReq.onreadystatechange = function () {
            if (oReq.readyState === 4 && oReq.status === 200) {
                var resp = JSON.parse(oReq.responseText);
                if (resp && resp.code === 401 && resp.msg) {
                    alert(resp.msg);
                } else if (resp && resp.success) {
                    callback([resp.data])
                } else if (resp && resp.length) {
                    callback(resp);
                } else {
                    alert('上传失败！');
                }
            }
        };
        oReq.send(formData);
    });
}


///////////微信录音
var bjmf_voice = {
    localId: '',
    serverId: ''
};

var bjmf_luyin_ing = false;


function bjmf_wx_luyin_2texted(res) {
    //识别结果res.translateResult
    if (typeof (bjmf_wx_luyin_2texted_cb) != 'undefined')
        bjmf_wx_luyin_2texted_cb(res.translateResult);
}

function bjmf_wx_luyin_started(res) {
    bjmf_luyin_ing = true;
    $("#bjmf_luyin_area").html('<button type="button" onclick="bjmf_wx_luyin_stop()">录音中...点击停止</button>');

    if (typeof (bjmf_wx_luyin_started_cb) != 'undefined')
        bjmf_wx_luyin_started_cb(res);
}

function bjmf_wx_luyin_stoped(res) {
    bjmf_luyin_ing = false;
    bjmf_voice.localId = res.localId;


    //目前自动转文字，以后加上作为附件
    bjmf_wx_luyin_2text();

    $("#bjmf_luyin_area").html('<button type="button" onclick="bjmf_wx_luyin_start()">开始录音</button>');


    if (typeof (bjmf_wx_luyin_stoped_cb) != 'undefined')
        bjmf_wx_luyin_stoped_cb(res);

}

function bjmf_wx_luyin_start() {
    wx.startRecord({
        success: function (res) {
            bjmf_luyin_ing = true;
            bjmf_wx_luyin_started(res);
        },
        cancel: function () {
            bjmf_luyin_ing = false;
            alert('已拒绝录音');
        }
    });
}

function bjmf_wx_luyin_stop() {
    wx.stopRecord({
        success: function (res) {
            bjmf_voice.localId = res.localId;
            bjmf_wx_luyin_stoped(res);
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
}

function bjmf_wx_luyin_2text() {
    wx.translateVoice({
        localId: bjmf_voice.localId,
        complete: function (res) {
            if (res.hasOwnProperty('translateResult')) {
                bjmf_wx_luyin_2texted(res);
                //alert('识别结果：' + res.translateResult);
            } else {
                alert('无法识别');
            }
        }
    });
}


var wx_photo_serverids = [];

function wx_camera_photo(_wx_camera_photo_done_func) {
    wx_photo_serverids = [];//目前都是1张，所以每次都清空了，如果不是一张，请注意要改一下，可能每次都是追加。嗯……拍照是不是没法拍9张吧……
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: [/*'original',*/ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [/*'album',*/ 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds;
            //把图片显示到预览区域，然后自动上传
            //alert('已选择 ' + res.localIds.length + ' 张图片');
            for (i = 0; i < localIds.length; i++) {
                wx.uploadImage({
                    localId: localIds[i],
                    isShowProgressTips: 1,
                    success: function (res) {
                        wx_photo_serverids.push(res.serverId);
                        //alert("上传成功：" + res.serverId);
                        if (typeof (_wx_camera_photo_done_func) != "undefined")
                            _wx_camera_photo_done_func(this.localId, res.serverId);
                    },
                    fail: function (res) {
                        alert('微信图片上传失败，请重试。'.JSON.stringify(res));
                    }
                });
            }
        }
    });
}


function getGroupLabel($group) {
    var label = $group.find('.control-label').text() || '';
    return label.replace(/[*：:]+$/g, '');
}

function checkUnfinishedField(form) {
    var $groups = $(form).find('.form-group:visible');
    var label = null;
    for (var i = 0; i < $groups.length; i++) {
        var $group = $groups.eq(i);
        if ($group.find('.required-mark').length <= 0) {
            continue;
        }
        var type = $group.data('type');
        if (['radio', 'checkbox'].indexOf(type) >= 0) {
            if ($group.find('input:checked').length <= 0) {
                label = getGroupLabel($group);
                break;
            }
        } else {
            var val = $group.find('input, textarea, select').filter('[name]').val();
            if (!val || $.trim(val) === '' || (type === 'file' && $.trim(val) === '[]')) {
                label = getGroupLabel($group);
                break;
            }
        }
    }
    if (label) {
        weui.alert("请完成必填项：" + label, {title: '提示'});
        return true;
    }
    return false;
}

function _autoLinkTextNodesReplace(regex, old, callback) {
    var match, i;
    var parts = [];
    var matches = [];
    var index = 0;
    while ((match = regex.exec(old)) !== null) {
        i = match.index;
        if (match[1] && match[0][0] !== match[1][0]) {
            i++;
        }

        parts.push(old.slice(index, i));
        parts.push(match[1] || match[0]);
        matches.push(i);

        index = match.index + match[0].length;
        if (match[1] && match[0][match[0].length - 1] !== match[1][match[1].length - 1]) {
            index--;
        }
    }
    if (matches.length) {
        parts.push(old.slice(index));
        for (i = 0; i < parts.length; i++) {
            if (i % 2) {
                parts[i] = callback(parts[i]);
            }
        }
        return parts;
    }
    return [old];
}

function _autoLinkTextNodes(regex, callback) {
    try {
        document.querySelectorAll('span, p, td, label, div').forEach(function (el) {
            el.childNodes.forEach(function (cel) {
                if (cel.nodeType === Node.TEXT_NODE) {
                    var html = cel.textContent;
                    var parts = _autoLinkTextNodesReplace(regex, html, callback);
                    if (parts.length > 1) {
                        var nodes = [];
                        for (var i = 0; i < parts.length; i++) {
                            var newNode;
                            if (i % 2) {
                                newNode = document.createElement('span');
                                newNode.innerHTML = parts[i];
                            } else {
                                newNode = document.createTextNode(parts[i]);
                            }
                            nodes.push(newNode);
                        }
                        cel.replaceWith.apply(cel, nodes);
                    }
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

function autoLinkTextNodes() {
    _autoLinkTextNodes(/(?:^|[^a-zA-Z0-9])(1[3-9][0-9]{9})(?:[^a-zA-Z0-9]|$)/g, function (p) {
        return '<a href="tel:' + p + '" class="link">' + p + '</a>';
    });
    _autoLinkTextNodes(/https?:\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]/g, function (p) {
        return '<a href="' + p + '" class="link" target="_blank">' + p + '</a>';
    });
}

function addRedDots() {
    $('[dote]').each(function () {
        var $t = $(this);
        var key = $t.attr('dote');
        if (key) {
            if (!localStorage.getItem(key)) {
                $t.addClass('rt-dot');
            }
            if ($t.hasClass('rt-dot-t')) {
                $t.on('click', function () {
                    localStorage.setItem(key, 'true');
                });
            }
        }
    });
}

function getFavoriteLinks() {
    try {
        var links = localStorage.getItem('exam_favorite_links') || '{}';
        links = JSON.parse(links) || {};
    } catch (e) {
        console.log(e);
        links = {};
    }
    return links;
}

function countFavoriteLink(el) {
    try {
        var links = getFavoriteLinks();

        var count = links[el.href] || 0;
        links[el.href] = count + 1;
        localStorage.setItem('exam_favorite_links', JSON.stringify(links));
    } catch (e) {
        console.log(e);
    }
}

$(function () {
    $('.menu-list2 .cell > a').on('click', function () {
        countFavoriteLink(this);
    });
});

function renderFavoriteLinks() {
    try {
        var show = [];
        var links = getFavoriteLinks();
        $.each(links, function (href, count) {
            if (count >= 10) {
                show.push({
                    href: href,
                    count: count
                });
            }
        });
        if (show.length <= 0) {
            return;
        }
        show.sort(function (a, b) {
            return b.count - a.count;
        });

        var $row = $('.favorite-list .row');

        var $as = {};
        $('.card-body.menu-list .col-3 > a').each(function () {
            $as[this.href] = $(this).parent();
        });

        var count = 0;
        $.each(show, function (i, item) {
            if (count >= 4) {
                return false;
            }
            if (!$as[item.href]) {
                return;
            }
            $as[item.href].clone().appendTo($row);
            count++;
        });
        if (count) {
            $('.favorite-list').show();
        }
    } catch (e) {
        console.log(e);
    }
}

function timeStr(s) {
    if (!s || !s.endsWith) {
        return s;
    }
    if (s.endsWith(':00')) {
        return s.substring(0, s.length - 3);
    }
    return s;
}

//表格某些的显示与隐藏 后续可扩展为按列名称进行显示隐藏
function table_col_toggle(_tableqs, _col_index_array, _toshow) {
    if (!Array.isArray(_col_index_array)) {
        _col_index_array = [_col_index_array];
    }
    $.each(_col_index_array, function (_col_i, _col_index) {
        $(_tableqs + ' tr').find('td:eq(' + _col_index + '),th:eq(' + _col_index + ')').toggle(_toshow);
    });
}

// 导出静态表格内容到 excel 文件
/*
    target - 要导出表格的 ID
    param - 参数
 */
function table2xls(target, param, noreformat) {
    var filename = null;
    var worksheet = 'sheet1';
    if (typeof param == 'string') {
        filename = param;
    } else {
        filename = param['filename'];
        worksheet = param['worksheet'] || 'Worksheet';
    }
    var _html = $('#' + target).prop("outerHTML");

    $_html = $(_html);
    $_html.find("td[export='no']").remove();
    $_html.find("th[export='no']").remove();

    _html = $_html.prop("outerHTML");

    html2xls(_html, filename, worksheet, noreformat);
}

function html2xls(_html, filename, worksheet, noreformat) {
    if (typeof (worksheet) == 'undefined')
        worksheet = 'sheet1';
    if (typeof (filename) == 'undefined')
        filename = 'data';

    filename = filename + '.xls';
    uri = 'data:application/vnd.ms-excel;base64,';
    xlstemplate = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style type="text/css">td{mso-number-format:"@"}</style></head><body>{table}</body></html>';
    base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    };
    format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
        })
    };

    var ctx = {worksheet: worksheet, table: _html};
    var origin_data = format(xlstemplate, ctx);
    var data = base64(origin_data);

    if (window.navigator.msSaveBlob) {
        var blob = b64toBlob(data);
        window.navigator.msSaveBlob(blob, filename);
    } else {

        if (navigator.userAgent.indexOf('MicroMessenger') > -1 && navigator.userAgent.indexOf('WindowsWechat') == -1) {
            var url = "/teacher/post2oss?ext=xls";
            var post = {
                content: origin_data
            };
            $.post(url, post, function (response) {
                if (response.error) {
                    alert(response.msg);
                } else {
                    document.location.href = "/teacher/exp_result?file=" + response.data;
                }
            }, 'json');
        } else {
            var alink = $('<a style="display:none"></a>').appendTo('body');
            alink[0].href = uri + data;
            alink[0].download = filename;
            alink[0].click();
            alink.remove();
        }
    }
}

function bjmform_clear(basename) {
    $('[name^="' + basename + '["]').each(function () {
        $(this).val('').prop('checked', false);
        $(this).find('+ .jFiler').remove();
    });
    $('[bjmfform_address]').find('select, input').val('');
}

function bjmform_ele_clear(_ele)//只清理一个元素的值
{
    var _type = $(_ele).attr('type');
    if (typeof (_type) != 'undefined' && (_type == 'radio' || _type == 'checkbox'))
        $(_ele).prop('checked', false);
    else
        $(_ele).val('');
}

//自定义form的各项支持
// TODO: 如果表单中可能有上传控件，记得要设置 session(['uploadpath' => '/path'])，避免上传报来源异常错误
function bjmform_ini(iniformdata, basename, readonly, form_id) {
    if (iniformdata == undefined || iniformdata == null || !iniformdata)
        iniformdata = [];

    if (typeof (form_id) == undefined) {
        form_id = 0;
    }


    $.each(iniformdata, function (k, v) {
        //非选项赋值
        $("[name='" + basename + "[" + k + "]'][type!=radio]").val(v);
        //单选
        $("[name='" + basename + "[" + k + "]'][type=radio][value='" + v + "']").prop("checked", true);

        //多选
        if (Array.isArray(v)) {
            $.each(v, function (__k, __v) {
                $("[name='" + basename + "[" + k + "][]'][value='" + __v + "']").prop("checked", true);
            });
        }
        //这种情况应该不会存在,就是多选存的不是数组
        $("[name='" + basename + "[" + k + "][]'][value='" + v + "']").prop("checked", true);
    });

    //index2value兼容value2value（页面上用的是index2value，但是数据是改革以前的value2value数据，字段里面title在用这些东西,prfile的导入数据也直接是v2v的）
    $.each(iniformdata, function (k, v) {
        //非选项赋值
        //$("[name='" + basename + "[" + k + "]'][type!=radio]").val(v);
        //单选
        $("[name='" + basename + "[" + k + "]'][type=radio][title='" + v + "']").prop("checked", true);
        //select
        $("[name='" + basename + "[" + k + "]']").find("option[title='" + v + "']").prop("selected", true);

        //多选
        if (Array.isArray(v)) {
            $.each(v, function (__k, __v) {
                $("[name='" + basename + "[" + k + "][]'][value='" + __v + "']").prop("checked", true);
            });
        }
    });

    //link_n是服务端/控制端元素，指向自己的name
    //linkn是被控制端，指向主家儿name， 会配一个linkv对应主家的值

    var checklinklink = function (_ln) {
        var _va = [];//主家的值
        $("[link_n=" + _ln + "]").each(function (__i, __v) {
            if (typeof ($(this).attr("type")) != "undefined")//radio/checkbox
            {
                if ($(this).attr("type") == 'text')//选日期会是这个
                {
                    _va.push($(this).val().trim());
                } else {
                    if ($(this).prop("checked")) {
                        //_va.push($(this).val());
                        _va.push($(this).parent().text().trim());//兼容useindex2value两种情况
                    }
                }
            } else {
                //_va.push($(this).val());
                _va.push($(this).find("option:selected").text().trim());//兼容useindex2value两种情况
            }
        });
        //根据主家儿的值，来决定是否显示
        $("[linkn=" + _ln + "]").each(function (__i, __v) {
            var _lv = JSON.parse($(this).attr("linkv"));
            var _bcanshow = false;
            $.each(_lv, function (_lvi, _lvv) {
                if (jQuery.inArray(_lvv, _va) > -1)
                    _bcanshow = true;
            });
            if (_bcanshow)
                $(this).show("fast");
            else {
                $(this).hide("fast");
                //还要清空当前里面元素的值,并联动下一级
                $(this).find('input').each(function (_ipti, _iptv) {
                    bjmform_ele_clear($(this));
                    $(this).change();//通过change，如果有下一级触发下一级进行递归清空
                });
            }
        });

    };

    $("[link_n]").bind("change", function () {
        var __n = $(this).attr("link_n");
        checklinklink(__n);
    });


    $("[link_n]").each(function () {
        checklinklink($(this).attr("link_n"));
    });


    //渲染地址选择器
    if ($('[bjmfform_address]').length > 0) {
        /*
            时间差有问题，执行代码时，文件还没有加载解释完
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.src = "/res/app_form_address.js?t=2021093001";
            document.body.appendChild(script);
        */
        /*
        //使用的是xhr加载
        $('<script type="text/javascript" src="/res/app_form_address.js?t=2021112701"></script>').appendTo('body');
        $(function () {
            bjmform_addr_auto();
        });
         */
        var cdn = window.sitecdn === undefined ? '//c.d8n.cn' : window.sitecdn;
        loadScript(cdn + "/res/app_form_address.js", function () {
            bjmform_addr_auto();
        });
    }

    if (readonly) {
        $.each(iniformdata, function (k, v) {
            $("[name='" + basename + "[" + k + "]']").prop('disabled', true);
            $("[name='" + basename + "[" + k + "][]']").prop('disabled', true);
            $("[bjmfform_address='" + basename + "_" + k + "']").find('select, input').prop('disabled', true);
            $("[name='" + basename + "[" + k + "]']:checked").parent().css('color', 'var(--primary)');
            $("[name='" + basename + "[" + k + "][]']:checked").parent().css('color', 'var(--primary)');
        });

        $('.form-group[data-type] [name^="fm["]').prop('disabled', true);

        //上面设置过value了，此处显示文件列表
        $(".form_uploadfile").each(function () {
            _attach_html = bjmf_attachment_format($(this).val());
            //console.log(_attach_html);
            $(this).after(_attach_html);
        });

        $('.form-group[data-type=file] .jFiler-input-dragDrop').hide();
        $('.form-group[data-type=file] .jFiler-item-trash-action').hide();
    } else {
        //不要重复渲染

        $(".form_uploadfile").each(function () {
            fix_attachments_url(this);
            html_upload_js($(this).attr("id"), get_current_role(), basename);
        });
        //检查一下map 和gps，对数据进行初始化
        //如果有gps的话，1秒后自动调用一下autogps

        //对test的dic字典辅助输入
        var _has_dic = false;
        $('[dic]').each(function () {
            if ($(this).attr('dic') && $(this).attr('dic').length > 0)
                _has_dic = true;
        });
        if (_has_dic) {
            loadScript('/res/app_form_dic.js', function () {
                dic_init()
            });
        }
        //pattern的验证（验证还未启用）


    }
}

//目前不支持多级[a][b][c]，还是只能一级:f[a]或f[a][]
function bjmform_getdata(_formobj, basename) {
    _fdata = {};
    _mutiFields = [];
    _formobj.find('[name]').each(function () {
        _name = $(this).attr('name');
        if (_name.length <= basename.length || _name.substr(0, basename.length) != basename)
            return;
        if (_name.indexOf('gps') > -1)
            return;
        if ($(this).attr('bjmfform_autogps') != undefined)
            return;

        _savename = _name.substr(basename.length);
        _savename = _savename.replace(/\[/ig, '').replace(/\]/ig, '');//多级会变化

        if (_name.substr(_name.length - 2, 2) == '[]') {
            if (_mutiFields.indexOf(_savename) == -1) {
                _mutiFields.push(_savename);
                _fdata[_savename] = [];
            }
        } else {
            if ($(this).attr('type') == 'radio') {
                if (_formobj.find("[name='" + _name + "']:checked").length > 0)
                    _fdata[_savename] = _formobj.find("[name='" + _name + "']:checked").val();
            } else {
                //$("[name='formdata[d]']")[0].nodeName
                _nodename = $(this)[0].nodeName;
                if (_nodename == 'SELECT' || _nodename == 'INPUT' || _nodename == 'TEXTAREA') {
                    _fdata[_savename] = $(this).val();
                }
            }
        }
    });
    //把多个的数组的处理一下
    $.each(_mutiFields, function (_fi, _fv) {
        _formobj.find("[type=checkbox][name='" + basename + "[" + _fv + "][]']:checked").each(function () {
            _fdata[_fv].push($(this).val());
        });
        //TODO 没有处理select.muti的情况，系统里面应该几乎没有，有用到再说
    });
    return _fdata;
}

//地图选择点
function mapsel(_ele_query) {
    //开一个top全屏框
    $('<div style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;background: #fff;z-index:99999;" id="bjmf_selmap_div"><iframe id="mapPage" width="100%" height="100%" frameborder=0 src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=E6LBZ-RJJCK-TBAJY-A5XM3-6ZR32-SIFZH&referer=myapp"></iframe>').appendTo('body');
    setTimeout(function () {
        $('#bjmf_selmap_div').height($(window).height());
        $('#bjmf_selmap_div').width($(window).width());
        window.addEventListener('message', function (event) {
            // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
            var loc = event.data;
            if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                console.log('location', loc);
                $('#bjmf_selmap_div').hide();
                _addr = loc.poiaddress + '|' + loc.latlng.lat.toFixed(5) + ',' + loc.latlng.lng.toFixed(5);
                $(_ele_query).val(_addr);

                $('#bjmf_selmap_div').remove();
            }
        }, false);
    }, 2000);

}

//获取gps位置
wx_readyed = false;//wx.config调用过了,不用再调用了

var geo_quick = [
    {range: [35.3236, 35.332, 113.9075, 113.9225], addr: '河南省,新乡市,牧野区,河南师范大学'},
    {range: [35.29468, 35.2989, 114.06565, 114.07241], addr: '河南省,新乡市,红旗区,新联学院'},
    {range: [21.160, 21.169, 110.237, 110.252], addr: '广东省,湛江市,麻章区,广东海洋大学寸金学院(新湖校区)'},
    {range: [36.17, 36.1744, 120.434, 120.440], addr: '山东省,青岛市,李沧区,巨峰路山东外贸职业学院'},
    {range: [23.141, 23.1453, 113.3144, 113.324], addr: '广东省,广州市,天河区,广州体育学院'}
];

function gps_in_range(_lat, _lng, _gpsrange) {
    if (_lat >= _gpsrange[0] && _lat <= _gpsrange[1] && _lng >= _gpsrange[2] && _lng <= _gpsrange[3]) {
        return true;
    }
    return false
}

function gps_in_ranges(_lat, _lng, _gpsranges) {
    var bfind = false;
    $.each(_gpsranges, function (_gi, _gpsrange) {
        if (gps_in_range(_lat, _lng, _gpsrange))
            bfind = true;
    });
    return bfind;
}

function bjmf_geo_code_parse(_geodata)//解析不同的数据给bjmf_geo_code用
{
    var _addr = '';
    var _lat = '';
    var _lng = '';
    if (typeof (_geodata['type']) != 'undefined' && _geodata['type'] == 'quick') {//硬代码查到的内容
        _addr = _geodata['addr'];
        _lat = parseFloat(_geodata['lat']).toFixed(5);
        _lng = parseFloat(_geodata['lng']).toFixed(5);
    } else if (typeof (_geodata['type']) != 'undefined' && _geodata['type'] == 'local') {//本地缓存内容
        _addr = _geodata['addr'];
        _lat = parseFloat(_geodata['lat']).toFixed(5);
        _lng = parseFloat(_geodata['lng']).toFixed(5);
    } else {
        //远程获取的内容
        _lat = _geodata.result.location.lat.toFixed(5);
        _lng = _geodata.result.location.lng.toFixed(5);
        var _ac = _geodata.result.address_component;
        _addr = _ac.province + ',' + _ac.city + ',' + _ac.district + ',' + _ac.street + _ac.street_number.replace(_ac.street, '');

        if (typeof (_geodata.result['formatted_addresses']) != 'undefined' && typeof (_geodata.result['formatted_addresses']['recommend']) != 'undefined')
            _addr += _geodata.result['formatted_addresses']['recommend'];
    }

    return {
        lat: _lat,
        lng: _lng,
        addr: _addr,
        addr4bjmf: (_addr + '|' + _lat + ',' + _lng)
    };
}

function autogps(_ele_query, _need_addr) {
    if (typeof (_ele_query) == 'undefined')
        _ele_query = '[bjmfform_autogps]';
    if (typeof (_need_addr) == 'undefined')//默认需要addr
        _need_addr = true;
    //微信，调用微信
    //获取微信的jsticket
    if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
        if (wx_readyed)//wx.config过了
            return autogps_cb(_ele_query, _need_addr);

        //已经加载了,也有前台进行wx.config的
        if (typeof (wx_js_sign_data) != 'undefined' && typeof (wx_js_sign_data['nonceStr']) != 'undefined') {
            if (typeof (wx_js_signed_by_myself) != 'undefined' && wx_js_signed_by_myself)
                return;//他要自己wx.config，要自己进行wx.ready回调，咱就不管了

            //到此处，页面上只是给出了signdata，还是需要我来进行注册和调用
            wx.ready(function () {
                wx_readyed = true;
                autogps_cb(_ele_query, _need_addr);
            });
            wx.config(wx_js_sign_data);
            return;
        }

        loadScript("//res.wx.qq.com/open/js/jweixin-1.6.0.js", function () {
            $.get('/weixin/jsticket?url=' + encodeURIComponent(document.location.href), function (_jssign) {
                wx.ready(function () {
                    wx_readyed = true;
                    autogps_cb(_ele_query, _need_addr);
                });
                wx.config({
                    debug: false,
                    appId: _jssign.appId,
                    timestamp: _jssign.timestamp,
                    nonceStr: _jssign.nonceStr,
                    signature: _jssign.signature,
                    jsApiList: [
                        'checkJsApi',
                        'openLocation',
                        'getLocation',
                        'getNetworkType'
                    ]
                });
            }, 'json');
        });
        //if (typeof (wx) == 'undefined')
        //    $('<script type="text/javascript" src="//res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>').appendTo('body');
    } else//不是微信，使用html5，以后有app可能会用app接口
    {
        //获取位置
        alert('无法自动获取位置，建议在微信中打开以自动获取位置');
    }
}

function localgeo(_geo)//获取或存储lat lng addr//带addr就是存，不带就是取
{
    var lskey = 'geos';
    if (window.localStorage) {
        var _geos = [];
        var _lgeosJson = window.localStorage.getItem(lskey);
        if (_lgeosJson) {
            try {
                _geos = JSON.parse(_lgeosJson);
            } catch (e) {
                console.log('localStorageJSON error');
            }
        }

        var _find = false;
        $.each(_geos, function (_k, _v) {
            var _diff_lat = Math.abs(parseFloat(_v.lat) - parseFloat(_geo.lat));
            var _diff_lng = Math.abs(parseFloat(_v.lng) - parseFloat(_geo.lng));
            if (_diff_lat <= 0.0001 && _diff_lng <= 0.0001) {
                _find = _v;
            }
        });

        if (typeof (_geo['addr']) == 'undefined')//不存在，说明是查找的
        {
            if (_find !== false) {
                _geo['addr'] = _find.addr;
                return _geo;
            } else
                return null;
        } else {//新增的,已经有了（找到了）就不用了新增了，没有找到才新增
            if (_find === false) {
                _geos.push(_geo);
                window.localStorage.setItem(lskey, JSON.stringify(_geos));
            }
            return _geo;
        }
    }
    return null;
}

function bjmf_geo_code_cb(results) {
    if (typeof (bjmf_geo_code) == 'undefined') {
        console.log('未定义bjmf_geo_code', results);
    } else {
        var __geo4bjmf = bjmf_geo_code_parse(results);
        localgeo(__geo4bjmf);//本地存一下
        bjmf_geo_code(results);
    }
}

function autogps_cb(_ele_query, _need_addr) {
    if (typeof (_ele_query) == 'undefined')
        _ele_query = '[bjmfform_autogps]';
    if (typeof (_need_addr) == 'undefined')//默认需要addr
        _need_addr = true;

    networkType = 'nothing';
    wx.getNetworkType({
        success: function (res) {
            networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
        }
    });
    ret = wx.getLocation({
        type: 'gcj02',//'wgs84',
        success: function (res) {

            //没有bjmf_geo_code时候，做一个更新指定字段的bjmf_geo_code
            if (typeof (bjmf_geo_code) == 'undefined')
                window.bjmf_geo_code = function (results) {
                    var _geo4bjmf = bjmf_geo_code_parse(results);
                    //localgeo(_geo4bjmf);//本地存一下

                    if (typeof (_ele_query) == 'undefined')
                        _ele_query = '[bjmfform_autogps]';
                    if ($(_ele_query).length > 0)
                        $(_ele_query).val(_geo4bjmf.addr4bjmf);
                }

            if (!_need_addr)//只需要一个坐标，不要addr
            {
                return bjmf_geo_code({
                    type: 'quick',
                    addr: '',
                    lat: res.latitude,
                    lng: res.longitude
                });
            }


            //console.log(res);
            if ($(_ele_query).length > 0) {
                $(_ele_query).val('|' + parseFloat(res.latitude).toFixed(5) + ',' + parseFloat(res.longitude).toFixed(5));
                $('.autogps_btn_area').html('已成功获取位置');
            }


            //1、先查本地
            var _findinlocal = localgeo({
                type: 'quick',
                lat: res.latitude,
                lng: res.longitude
            });
            if (_findinlocal !== null) {
                bjmf_geo_code(_findinlocal);
                return;
            }


            //2、再查常用地区硬代码
            var find_in_local = false;
            $.each(geo_quick, function (_gri, _grv) {
                if (find_in_local)
                    return;
                if (gps_in_range(res.latitude, res.longitude, _grv.range)) {
                    find_in_local = true;
                    bjmf_geo_code({
                        type: 'quick',
                        addr: _grv.addr,
                        lat: res.latitude,
                        lng: res.longitude
                    });
                }
            });
            if (find_in_local)//本地硬代码已经有了就不需要进行远程查找了
                return;

            //3、再查远程解析

            var resUrl = "https://apis.map.qq.com/ws/geocoder/v1";
            var params = {
                location: res.latitude + "," + res.longitude,
                key: 'E6LBZ-RJJCK-TBAJY-A5XM3-6ZR32-SIFZH',
                get_poi: 0,
                output: "jsonp"
            };

            $.ajax({
                type: "get",
                url: resUrl,
                data: params,
                dataType: 'jsonp',
                jsonpCallback: "bjmf_geo_code_cb",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                success: function (results) {
                    bjmf_geo_code_cb(results);
                },
                error: function (errors) {
                    console.log(errors);
                }
            });

        },
        fail: function (res)//接口调用失败时执行的回调函数。
        {
            if (networkType != 'wifi')
                alert("获取位置失败（" + JSON.stringify(res) + "），可打开WIFI和定位后再尝试");
            else
                alert("获取位置失败（" + JSON.stringify(res) + "），可进行以下操作后再尝试：打开手机定位和授权微信定位权限");
        },
        complete: function (res)//接口调用完成时执行的回调函数，无论成功或失败都会执行。
        {
            console.log('complete');
            //$("#punch_gps_form_"+_id).submit();
        },
        cancel: function (res)//用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        {
            console.log('cancel');
            alert("已取消，如果需要获取，还可以点上方“自动获取位置”按钮重试");
        }
    });
}


function bjmform_checkform() {
    _needfilla = [];
    $("[bmfe]:visible").each(function () { // TODO: 这里如果是必填的附件，input被上传控件隐藏了，会跳过检查
        _t = $(this);
        _required = !(typeof (_t.attr('bmneed')) == 'undefined');
        if (!_required)
            return;

        _v = '';
        if (typeof (_t.attr('type')) != 'undefined' && (_t.attr('type') == 'radio' || _t.attr('type') == 'checkbox')) {
            if ($("[name='" + _t.attr('name') + "']:checked").length > 0)
                _v = $("[name='" + _t.attr('name') + "']:checked").val();
        } else {
            _v = _t.val();
        }

        _fillvalue = _t.attr('name');//这里应该列label的体验更好，以后再说
        if (_v.trim().length < 1) {
            if (jQuery.inArray(_fillvalue, _needfilla) == -1)
                _needfilla.push(_fillvalue);
        }

    });

    if (_needfilla.length > 0) {
        alert('还有' + _needfilla.length + '项必填项没有填写，填写后再提交');
        return false;
    }

    //有些浏览器会把残留file也给payload post到服务器上造成异常，前面也简单设置了form.enctype，处理一下检测情况是否好转
    $('[type=file]').remove();
    return true;
}

//还没有加自定义函数，有时候需要对添加，在这里加
//做的没那么智能

//根据目前的状态，美化。目前不会自动变化，如果代码更新了状态，需要再次手动调用一下bjmf_rdochk_ini(),注意看代码绑定前先取消了所有click事件

function bjmf_rdochk_ini() {
    bjmf_rdochecked(".bjmfrdochk");
    $(".rdobox").unbind("click", bjmf_rdochecked_rdo).bind("click", bjmf_rdochecked_rdo);
    $(".chkbox").unbind("click", bjmf_rdochecked_chk).bind("click", bjmf_rdochecked_chk);
}

function bjmf_rdochecked_rdo() {
    $(this).prev().prop("checked", "checked");
    bjmf_rdochecked(".bjmfrdochk");
}

function bjmf_rdochecked_chk() {
    if ($(this).prev().prop("checked") == true) {
        $(this).prev().removeAttr("checked");
    } else {
        $(this).prev().prop("checked", "checked");
    }
    bjmf_rdochecked(".bjmfrdochk");
    if (typeof (cb_bjmf_rdochecked_chged) != 'undefined')
        cb_bjmf_rdochecked_chged($(this).prev());
}

function bjmf_rdochecked(tag) {
    $(tag).each(function (i) {
        var rdobox = $(tag).eq(i).next();
        if ($(tag).eq(i).prop("checked") == false) {
            rdobox.removeClass("checked");
            rdobox.addClass("unchecked");
            rdobox.find(".check-image").css("background", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURQAAALW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tW01flwAAAAIdFJOUwDtBpHukImILT7eIAAAACdJREFUCNdjYCANMBk6K4AZrB0dBWAGY0eHACoDKJUAUWwCVUw8AADNiwZs9OOD8wAAAABJRU5ErkJggg==)");
        } else {
            rdobox.removeClass("unchecked");
            rdobox.addClass("checked");
            rdobox.find(".check-image").css("background", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABmUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5WfaagAAAAhdFJOUwCenbkBCpUCA6ShB5+qkLSbkqu9mqIEpoqEiMCWCZy4mI+19xIAAABoSURBVCjPpY83FsMwFMPgIn/J6b0X3P+SWZJnZ8gUblhAEv5LPB/pi+/ajLlWq4H3M7VruZUzALlX+wwXPQJ5p04DuKonclGrAIiiztdqHW/5QVVX7Uc/aVSXMRSmjW5jPDEtuvbnnxeJXQfKWoecZgAAAABJRU5ErkJggg==)");
        }
    });
}

function fix_attachments_url(input) {
    if (!input.value || input.value.startsWith('[{')) {
        return;
    }
    var items = input.value.split(',');
    if (items.length === 1 && !items[0]) {
        return;
    }
    var result = [];
    $.each(items, function (i, v) {
        result.push({
            name: '附件 ' + (i + 1),
            file: v,
            size: 1,
            type: ''
        });
    });
    input.value = JSON.stringify(result);
}

function wxtask_noticeadd_cb(_d) {
    if (typeof (_d.s) == 'undefined')
        return '请求返回异常';
    if (_d.s == 'ok')
        return '已开始提醒';
    if (_d.s == 'repeat')
        return '已提醒过，一个事件的全员提醒，一天只能提醒一次';
    return '';
}

function wxtask_notice(_course_id, _flag, _tourl, _title, _group_ids) {
    _postdata = {
        flag: _flag,
        url: _tourl,
        title: _title
    };

    if (dealUndefined(_group_ids) == '')
        _postdata['courseids'] = _course_id;
    else
        _postdata['groupids'] = _group_ids;


    $.post('/teacher/course/' + _course_id + '/wxtasknotice', _postdata, function (_d) {
        alert(wxtask_noticeadd_cb(_d))
    }, 'json');
}

function pick_event_add(_course_id, _flag, _studentids, _num, _name) {
    _postdata = {
        flag: _flag,
        studentids: _studentids,
        v: _num,
        name: _name
    };

    $.post('/teacher/course/' + _course_id + '/pickevent_ajax', _postdata, function (_d) {
        if (typeof (_d.s) == 'undefined')
            alert('请求返回异常');
        if (_d.s == 'ok')
            alert('已完成批量添加');
        if (_d.s == 'repeat')
            alert('当前事件已记分过一遍啦');
    }, 'json');
}

function dealUndefined(__s) {
    if (typeof (__s) == 'undefined') {
        console.log('something undefined');
        return '';
    } else
        return __s;
}

function renderPagination() {
    var pag = window.__pagination__;
    if (!pag) {
        return;
    }

    if (window.layui) {
        layui.use(['laypage'], function () {
            var laypage = layui.laypage;

            laypage.render({
                elem: 'pagination',
                limit: pag.limit,
                curr: pag.page,
                count: pag.total,
                jump: function (obj, first) {
                    if (!first) {
                        location.href = '?limit=' + obj.limit + '&page=' + obj.curr;
                    }
                }
            });
        });
    } else {
        var $p = $('#pagination');
        $p.html('<ul class="pagination justify-content-center my-3">\n' +
            '    <li class="page-item first disabled">\n' +
            '      <a class="page-link" href="#">首页</a>\n' +
            '    </li>\n' +
            '    <li class="page-item prev disabled"><a class="page-link" href="#">上一页</a></li>\n' +
            '    <li class="page-item current"><a class="page-link" href="#">1</a></li>\n' +
            '    <li class="page-item next disabled"><a class="page-link" href="#">下一页</a></li>\n' +
            '    <li class="page-item last disabled">\n' +
            '      <a class="page-link" href="#">末页</a>\n' +
            '    </li>\n' +
            '  </ul>');
        var url = '?limit=' + pag.limit + '&page=';
        var $items = $p.find('.page-item');
        $items.filter('.current').find('a').text(pag.page).attr('href', url + pag.page);

        if (pag.page > 1) {
            $items.filter('.prev').removeClass('disabled')
                .find('a').attr('href', url + (pag.page - 1));
            $items.filter('.first').removeClass('disabled')
                .find('a').attr('href', url + 1);
        }

        if (pag.page * pag.limit < pag.total) {
            $items.filter('.next').removeClass('disabled')
                .find('a').attr('href', url + (pag.page + 1));
            $items.filter('.last').removeClass('disabled')
                .find('a').attr('href', url + Math.ceil(pag.total / pag.limit));
        }
    }
}

$(function () {
    autoLinkTextNodes();

    //自定义的radio,checkbox
    //初始化一下，如果自己js画，每次画完都要重新处理一下
    bjmf_rdochk_ini();

    renderPagination();

    $('.form-control-datetimepicker').on('click', function () {
        weuidatetimepicker(this);
    });

    $('.form-control-timepicker').on('click', function () {
        weuitimepicker(this);
    });

    addRedDots();

    $('.text2html').each(function () {
        var $t = $(this);
        $t.html(text2html($t.text()));
    });
});

//处理上传字符串，对于datagrid，可以采用在列上formatter:bjmf_attachment_format
//也可以用来对任意字符串检测是否是附件而进行格式化，系统里面还有一个函数bjmf_dealAttachment没有统一合并处理
//_urlfunc不填，自动用href，填的话，填一个附件函数名
function bjmf_attachment_format(_vv, _urlfunc) {
    if (typeof (_vv) == 'string' &&
        _vv.substr(0, 1) == '[' &&
        _vv.substr(_vv.length - 1, 1) == ']' &&
        _vv.indexOf('"file"') > -1 &&
        _vv.indexOf('"name"') > -1) {
        _aahtml = '';
        _aa = JSON.parse(_vv);
        $.each(_aa, function (_aai, _aav) {
            if (typeof (_urlfunc) == 'undefined')
                _aahtml += '<a target="_blank" href="' + _aav.file + '">附件' + (_aai + 1) + '</a> ';
            else
                _aahtml += '<a href="javascript:void(0);" onclick="' + _urlfunc + '(\'' + _aav.file + '\')">附件' + (_aai + 1) + '</a> ';
        });
        return _aahtml;
    }
    return _vv;
}

function easyui_attachment_format(value, row, index) {
    return bjmf_attachment_format(value, undefined);
}

//字符串截断并加省略号
function cutString(str, len) {
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}

//工具栏控件，就这一个函数
function bjmf_cmdbar(_bjmf_cmdbar_e_q, _bjmf_cmdbar_ele_arr) {
    $('<style>.bjmf-cmdbar{font-size:14px;color:#555}.bjmf-cmdbar-items{clear:both;margin:0;padding:0}.bjmf-cmdbar-item{padding:0 4px;margin:0;border:0;cursor:pointer;display:inline-block}.bjmf-cmdbar-item i{padding:0 4px;color:#0078d4;height:22px;line-height:22px}.bjmf-cmdbar-item span{padding:0}.bjmf-cmdbar-showarea{overflow:hidden}.bjmf-cmdbar-showarea li{float:left}.bjmf-cmdbar-morearea{position:relative;text-align:right;display:none}</style>').appendTo('body');

    _bjmf_cmdbar_html = '<div class="bjmf-cmdbar"><ul class="bjmf-cmdbar-items bjmf-cmdbar-showarea"></ul><ul class="bjmf-cmdbar-items bjmf-cmdbar-morearea"></ul></div>';
    $(_bjmf_cmdbar_e_q).html(_bjmf_cmdbar_html);

    $.each(_bjmf_cmdbar_ele_arr, function (_i, _e) {
        _tmpstyle = '';
        if (typeof _e.style != 'undefined')
            _tmpstyle = _e.style;
        _bjmfcmdbar_tmp_html = '<li class="bjmf-cmdbar-item" style="' + _tmpstyle + '"><i class="' + _e.icon + '"></i><span>' + _e.title + '</span></li>';
        $(_bjmfcmdbar_tmp_html).bind('click', _e.click).appendTo('.bjmf-cmdbar-showarea');
    });

    _morebtnhtml = '<li class="bjmf-cmdbar-item" onclick="$(\'.bjmf-cmdbar-morearea\').toggle();"><i class="las la-ellipsis-h"></i></li>';
    _morebtnlen = 30;

    _maxlen = $('.bjmf-cmdbar').width() - _morebtnlen;
    _curlen = 0;

    _willAddToMore = false;
    _allea = $('.bjmf-cmdbar-showarea').find('.bjmf-cmdbar-item');
    _allealen = _allea.length;
    _lastlen = _maxlen;

    _allea.each(function (_i, _e) {
        if (_willAddToMore) {
            $(this).clone(true).appendTo('.bjmf-cmdbar-morearea');
            $(this).remove();
            return;
        }

        _thisitemlen = $(this).outerWidth();
        //console.log("len of " + $(this).text() + " " + _thisitemlen);

        if (_curlen + _thisitemlen > _maxlen)//这个放不下了
        {
            $(_morebtnhtml).appendTo('.bjmf-cmdbar-showarea');
            _willAddToMore = true;

            $(this).clone(true).appendTo('.bjmf-cmdbar-morearea');
            $(this).remove();
            return;
        }

        _curlen += _thisitemlen;
        _lastlen = _maxlen - _curlen;
    });
}

function href(_href) {
    document.location.href = _href;
}


//gps相关代码
function geoDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = rad(lat1);
    let radLat2 = rad(lat2);
    let a = radLat1 - radLat2;
    let b = rad(lng1) - rad(lng2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137;
    s = Math.round(s);//米
    return s;
}

function rad(d) {
    return d * Math.PI / 180.0;
}

//gps相关代码
//离圈最近的距离，已经缩短了50米，在圈的话就只返回-1，不在圈就返回距离
function geoDistance2Ranges(__lat, __lng, rangArray)//[[1,2,80]]
{
    if (rangArray.length == 0)
        return -1;

    var _min_dstc2circle = 10000000;

    for (var _i = 0; _i < rangArray.length; _i++) {
        var _range = rangArray[_i];

        var _dstc = geoDistance(__lat, __lng, _range[0], _range[1]);
        var _dstc2circle = _dstc - _range[2];//两点距离减去半径

        _min_dstc2circle = Math.min(_min_dstc2circle, _dstc2circle);

        if (_dstc2circle <= 50)
            return -1;
    }
    return _min_dstc2circle;
}


function bjmf_timestamp2str(timestamp) {
    // 补全为13位
    var arrTimestamp = (timestamp + '').split('');
    for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;

    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    // 使用
    if (monthC > 12) {
        // 超过1年，直接显示年月日
        return (function () {
            var date = new Date(timestamp);
            return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
}


//写个通用函数，渲染方便php的表单（如name="a[config][a][]"这种）
function bjmf_form_filldata(_form_jq_object, ___formdata) {
    _form_jq_object.find("input,select,textarea").each(function () {
        _ele_e = $(this);
        if (!_ele_e.is('[name]'))
            return;
        _ele_name = _ele_e.attr('name').trim();
        _is_array = false;

        //checkbox select 多选，
        //radio需要选一个value设置checked
        //

        if (_ele_name.substr(_ele_name.length - 2) == '[]') {
            _v_k = _ele_name.substr(0, _ele_name.length - 2);
        } else {
            _v_k = _ele_name;
        }

        _v_k = "___formdata." + _v_k.replace(/]/g, '').replace(/\[/g, '.');
        try {//用try直接捕获多维数组a.b.c.d.e的undefined
            ___v = eval(_v_k);
        } catch (e) {
            return;
        }

        if (typeof (___v) == 'undefined')
            return;

        if (_ele_e.is('input') && _ele_e.attr('type') == 'checkbox') {
            if (___v.indexOf(_ele_e.val()) > -1)
                _ele_e.prop('checked', true);
        } else if (_ele_e.is('select') && _ele_e.is('[multiple]')) {
            _ele_e.find('option').each(function () {
                if (___v.indexOf($(this).attr('value')) > -1)
                    $(this).prop('selected', true);
            });

        } else if (_ele_e.is('input') && _ele_e.attr('type') == 'radio') {
            if (_ele_e.val() == ___v)
                _ele_e.prop('checked', true);
        } else {
            _ele_e.val(___v);
        }


    });

}

function urladd(_addarr, _baseurl) {
    if (typeof (_baseurl) == 'undefined' || _baseurl == '' || _baseurl == false)
        _baseurl = document.location.href;
    for (_urlk in _addarr) {
        _baseurl = changeQueryString(_urlk, _addarr[_urlk], _baseurl);
    }
    return _baseurl;
}

//value如果===false，是要删除这个key的，如果是null或undefined的话，可能是忘了设置这个值了，忽略
function changeQueryString(_key, _value, _baseurl) {
    if (typeof (_value) == 'undefined' || _value === null)
        return _baseurl;

    if (_baseurl.indexOf('?') != -1)
        _qs = _baseurl.substr(_baseurl.indexOf('?') + 1);
    else
        return _baseurl + "?" + _key + "=" + _value;

    //算求，我自己写吧，别人写的是个鸡巴
    _used = false;
    _qs_arr = _qs.split('&');
    for (_qs_i in _qs_arr) {
        _qs_one = _qs_arr[_qs_i];
        if (_qs_one.indexOf('=') == -1)
            continue;
        _qs_one_arr = _qs_one.split('=');
        if (_qs_one_arr[0] == _key) {
            _used = true;
            if (_value === false)//删除这个值
                _qs_arr.splice(_qs_i, 1);
            else {//修改这个值
                _qs_arr[_qs_i] = _key + '=' + _value;
            }
        }
    }
    if (!_used) {
        _qs_arr.push(_key + '=' + _value);
    }

    return _baseurl.substr(0, _baseurl.indexOf('?')) + "?" + _qs_arr.join('&');
}

//学生也要本地存储了, 如navpod
//当前页面上存一份，避免每次都要从服务器取，页面上有了就不再取了
var data_bjmf_course_getdata_data = {};

function bjmf_course_getdata(studentSel_course_id, datatype, _callback) {
    var _vnow = parseInt((new Date()).valueOf() / 1000);
    var _ldatakey = 'cd_' + studentSel_course_id + '_' + datatype;

    //当前页面上是否已经有这个数据了
    if (typeof (data_bjmf_course_getdata_data[_ldatakey]) != 'undefined')
        return _callback(data_bjmf_course_getdata_data[_ldatakey]);

    if (typeof (urlRoot) == 'undefined')
        urlRoot = '/' + document.location.pathname.split('/')[1];
    var _datageturl = urlRoot + '/course/' + (studentSel_course_id || 0) + '/data/' + datatype;
    if (window.localStorage) {
        var _ldata = false;
        var _ldataJson = window.localStorage.getItem(_ldatakey);
        var _lastask = window.localStorage.getItem(_ldatakey + '_lask');//上次问询时间
        if (_ldataJson) {
            try {
                _ldata = JSON.parse(_ldataJson);
            } catch (e) {
                console.log('localStorageJSON error');
            }
        }
        if (_ldata) {
            var _v = _ldata.v;
            var _ltruedata = _ldata.data;
            if (_vnow - _v < 180)//刚更新3分钟内强制不更新
            {
                console.log(_ldatakey, '3分钟内新数据，不再问');
                if (typeof (bjmf_filter_coursedata) != 'undefined')
                    _ltruedata = bjmf_filter_coursedata(datatype, _ltruedata);
                data_bjmf_course_getdata_data[_ldatakey] = _ltruedata;
                return _callback(_ltruedata);
            }
            //做一个上次检测间隔，检测后3分钟内不更新，不用每次新页面都要去服务器问一下更新没有
            if (_vnow - _lastask < 180)//3分钟内问过的，不再问
            {
                console.log(_ldatakey, '3分钟内问询过，不再问');
                if (typeof (bjmf_filter_coursedata) != 'undefined')
                    _ltruedata = bjmf_filter_coursedata(datatype, _ltruedata);
                data_bjmf_course_getdata_data[_ldatakey] = _ltruedata;
                return _callback(_ltruedata);
            }

            //验证_v是否需要更新
            $.ajax({
                url: _datageturl + '?v=' + _v,
                ldatakey: _ldatakey,
                vnow: _vnow,
                ltruedata: _ltruedata,
                success: function (_d) {
                    window.localStorage.setItem(this.ldatakey + '_lask', this.vnow);//记录上次服务器问询时间
                    if (typeof (_d.noc) != 'undefined' && _d.noc == 1) {
                        if (typeof (bjmf_filter_coursedata) != 'undefined')
                            _ltruedata = bjmf_filter_coursedata(datatype, this.ltruedata);
                        data_bjmf_course_getdata_data[this.ldatakey] = this.ltruedata;//console.log(this.ldatakey,this.ltruedata);//这里有问题
                        _callback(this.ltruedata);
                    } else {
                        window.localStorage.setItem(this.ldatakey, JSON.stringify(_d)); //这个得用服务器返回的v，可不能用本地的啊
                        if (typeof (bjmf_filter_coursedata) != 'undefined')
                            _ltruedata = bjmf_filter_coursedata(datatype, _d.data);
                        data_bjmf_course_getdata_data[this.ldatakey] = _ltruedata;//console.log(this.ldatakey);
                        _callback(_ltruedata);
                    }
                },
                dataType: 'json'
            });
        } else {
            $.ajax({
                url: _datageturl + '?f=1&v=' + +(new Date()),
                ldatakey: _ldatakey,
                success: function (_d) {
                    window.localStorage.setItem(this.ldatakey, JSON.stringify(_d));
                    if (typeof (bjmf_filter_coursedata) != 'undefined')
                        _ltruedata = bjmf_filter_coursedata(datatype, _d.data);
                    data_bjmf_course_getdata_data[this.ldatakey] = _ltruedata;//console.log(this.ldatakey,_d.data);
                    _callback(_ltruedata);
                },
                dataType: 'json'
            });
        }
    }
}

function hideLayUiMenuInIframe() {
    if (window.parent && window.parent !== window) {
        $('#leftmenuarea').remove();
        $('#LAY_app_body').css({left: 0});

        $(function () {
            var $head = $('#headmenuarea');
            $head.find('> .layui-layout-right').remove();
            $head.find('> .layui-layout-left').css({left: 0})
                .find('> li:not(:first)').remove();
        });
    }
}


function navpod(_course_id, _role, _navpod_cb) {
    bjmf_course_getdata(_course_id, 'navpod', function (_items) {
        _np_html = '';
        for (_np_item_key in _items) {
            _item = _items[_np_item_key];
            _np_html += navpod_item2html(_item, _course_id, _role);
        }
        $('#navpod').html(_np_html);
        if (typeof (_navpod_cb) == 'function')
            _navpod_cb(_items);
    });
}

function navpod_item2html(_item, _course_id, _role) {
    /*
    if (typeof (window['gconfig']) == 'undefined' || typeof (window['gconfig']['role']) == 'undefined')
        role = document.location.pathname.split('/')[1];
    else
        role = window.gconfig.role;

     */
    if (typeof (_item['id']) == 'undefined' || typeof (_item['name']) == 'undefined')//被损坏的数据
        return '';

    if (typeof (_item['url']) != 'undefined') {
        if (typeof (_item['url']) == 'string')
            _url = _item['url'];
        else
            _url = _item['url'][role];//数组['student'=>123,'teacher'=>'123']
    } else
        _url = menucode2url(_item['id'], _course_id, _role);

    _url = _url.replace('{ROLE}', _role).replace('{COURSEID}', _course_id);//大括号有可能被过滤掉了没替换成
    _url = _url.replace('/ROLE/', '/' + _role + '/').replace('/COURSEID/', '/' + _course_id + '/');

    return tpl2html($('#tpl_navpod_item').html(), {url: _url, item: _item});
}

function menucode2url(_code, _course_id, _role) {
    //先简单支持，profile,profile@28,29这种
    _url = '';
    _ca = _code.split('@');
    _modulecode = _ca[0];
    if (_modulecode == 'profile') {// /{ROLE}/course/{COURSEID}/profile/5123
        if (_ca.length > 1) {
            if (_ca[1].indexOf(',') > -1)
                _url = _url = '/{ROLE}/course/{COURSEID}/profiles?ids=' + _ca[1];
            else
                _url = '/{ROLE}/course/{COURSEID}/profile/' + _ca[1];
        } else {
            _url = '/{ROLE}/course/{COURSEID}/profiles';
        }
    }
    if (_modulecode == 'activity') {
        if (_ca.length > 1) {
            if (_ca[1].indexOf(',') > -1)
                _url = _url = '/{ROLE}/course/{COURSEID}/activitys?ids=' + _ca[1];
            else
                _url = '/{ROLE}/course/{COURSEID}/activitys/show?id=' + _ca[1];
        } else {
            _url = '/{ROLE}/course/{COURSEID}/activitys';
        }
    }
    return _url;
}

function clearlocal() {
    if (confirm('确认清理本地缓存?  系统可能会将一些班级学生列表保存到本地缓存，如果本地网络异常导致没有及时更新，可能会导致新加入学生不显示姓名等问题出现。可在此手动清理以加载最新数据。')) {
        localStorage.clear();
        alert('清理完成');
    }
}


var loaded_app_js = true;
