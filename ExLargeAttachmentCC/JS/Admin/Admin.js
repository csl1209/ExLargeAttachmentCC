var pagesize = 12;
var totelPage = 0;
var treeSelectNodeType;
$(document).ready(function () {
    searchAdminPage();
})

function searchAdminPage() {
    sendAjaxRequest("ashx/Admin.ashx", getTotelPage, encodeURI("json={login:'" + getAccount() + "',pagesize:'" + pagesize + "'}&op=GetAdminCount"));
}

function getTotelPage(data) {
    var obj = eval("(" + data + ")");
    totelPage = obj.data[0].pagecount;
    if (obj.result == "true") {
        if (totelPage > 0) {
            setPaginate();
            getPaginateData(pagesize, 1);
        } else {
            addNulltr(0, pagesize);
        }
    }
}

function setPaginate() {
    var pages = 1;
    if (totelPage != 0) {
        pages = totelPage; //总页面数
    }
    var options = {
        bootstrapMajorVersion: 3, //版本
        currentPage: 1, //当前页数
        totalPages: pages, //总页数
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        },//点击事件，用于通过Ajax来刷新整个list列表
        onPageClicked: function (event, originalEvent, type, page) {
            getPaginateData(pagesize, page);
        }
    };
    $('#pagination').bootstrapPaginator(options);
}

function getPaginateData(pagesize, page) {
    sendAjaxRequest("ashx/Admin.ashx", getPaginateDataBack, encodeURI("json={login:'" + getAccount() + "',curpage:'" + page + "',pagesize:'" + pagesize + "'}&op=GetAdminPager"));
}

function getPaginateDataBack(data) {
    var obj = eval("(" + data + ")");
    var tabletr = '';
    try {
        $(obj.data).each(function (i, j) {
            tabletr += '<tr>';
            tabletr += '<td><span>' + j.UserAccount + '</span></td>';
            tabletr += '<td><span>' + j.UserAccount + '</span></td>';
            tabletr += '<td><a onclick="delAdminInfo(this)" id="' + j.UserAccount + '" disAdmin="' + j.UserAccount + '">删除</a></td>';
            tabletr += '</tr>';
        });
        $("#tbody_admin").html(tabletr);
        addNulltr(obj.data.length, pagesize);
        var winHeight = $(window).height();
        var contentHeight = $(".content_body").height();
        if (winHeight -312 > contentHeight) {
            $(".footer").css({ "top": winHeight - 100 + "px" });
        } else {
            $(".footer").css({ "top": contentHeight + 212 + "px" });
        }
    }
    catch (e) {
        return;
    }
}

function addNulltr(length, pagesize) {
    if (length < pagesize) {
        var tabletr = '';
        for (var n = 0; n < pagesize - length; n++) {
            tabletr += '<tr>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '</tr>';
        }
        $("#tbody_admin").append($(tabletr));
    }
}

function addAdminInfo() {
    $('#addAdmin_Modal').modal('show');
    $("#txtadmin").val("");
    $("#password").val("");
    $(".oprate-butons").css("display", "block");
    $("#addAdmin-submit-info").html("");
    $("#addAdmin_btn").button("reset");
    $("#addAdmin_btn").removeClass("noborder");
    $("#addAdmin_btn").css("display", "inline-block");
}

function addAdmin() {
    if ($.trim($("#txtadmin").val()) == "") {
        $("#addAdmin-submit-info").html("请输入账户！");
        return;
    }
    else if ($.trim($("#password").val()) == "") {
        $("#addAdmin-submit-info").html("请输入密码！");
        return;
    }

    var useraccount = $.trim($("#txtadmin").val());
    var passord = $.trim($("#password").val());
    sendAjaxRequest("ashx/Admin.ashx", addAdminBack, "json={login:'" + getAccount() + "',UserAccount:'" + useraccount + "',Password:'" + passord + "'}&op=AddSysAdmin");
}

function addAdminBack(data) {
    $("#addAdmin_btn").removeClass("noborder");
    $(".loadingCSS").css("visibility", "hidden");
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#p_admin").html($("#admin").val());
        $("#p_admin").css("display", "block");
        $("#admin").css("display", "none");
        $(".oprate-butons").css("display", "none");
        $(".treeHide").css("display", "none");
        $("#addAdmin_btn").css("display", "none");
        $("#addAdmin-submit-info").html("操作成功！");
        searchAdminPage();
    } else {
        $("#addAdmin_btn").button("reset");
        $("#addAdmin-submit-info").html("<span style='color:#e80000;'>" + obj.errMsg + "</span>");
    }
}

function delAdminInfo(obj) {
    $('#delAdmin_Modal').modal('show');
    $("#delAdmin").val($(obj).attr("id"));
    $("#ckdel").parent().removeClass("checked");
    $("#delAdmin_btn").button("reset");
    $("#delAdmin_btn").css("display", "inline-block");
    $('#delAdmin-submit-info').html("");
    $("#del_realname").html($(obj).attr("disAdmin"));
    $("#ckdel").attr("checked", false);
}

function delAdmin() {
    if (document.getElementById("ckdel").checked) {
        $('#delAdmin-submit-info').html("");
        $(".loadingCSS").css("visibility", "visible");
        $("#delAdmin_btn").button("loading");
        $("#delAdmin_btn").addClass("noborder");
        var _delAdmin = $("#delAdmin").val();
        sendAjaxRequest("ashx/Admin.ashx", delAdminBack, "json={login:'" + getAccount() + "',adminID:'" + encodeURIComponent(_delAdmin) + "'}&op=DeleteSysAdmin");
    } else {
        $('#delAdmin-submit-info').html("<span style='color:#e80000;'>请确认可能产生的问题。</span>");
    }
}

function delAdminBack(data) {
    $("#delAdmin_btn").removeClass("noborder");
    $(".loadingCSS").css("visibility", "hidden");
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#delAdmin_btn").css("display", "none");
        $("#delAdmin-submit-info").html("操作成功！");
        searchAdminPage();
    } else {
        $("#delAdmin_btn").button("reset");
        $("#delAdmin-submit-info").html("<span style='color:#e80000;'>" + obj.errMsg + "</span>");
    }
}

function checkWay(obj) {
    if (!$(obj).is(":checked")) {
        $(obj).removeAttr("checked");
    } else {
        $(obj).attr("checked", "checked");
    }
}