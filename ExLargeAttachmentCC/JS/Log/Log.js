var lognum = "";
var start = "";
var end = "";
var account = "";
var pagesize = 12;
var totelPage = 0;
$(document).ready(function () {
    $("#search_start_createtime").datepicker({//添加日期选择功能  
        //changeMonth:true,
        //changeYear:true,
        numberOfMonths: 1,//显示几个月  
        //showButtonPanel: true,//是否显示按钮面板  
        dateFormat: 'yy-mm-dd',//日期格式  
        clearText: "清除",//清除日期的按钮名称  
        closeText: "关闭",//关闭选择框的按钮名称 
        yearSuffix: '年', //年的后缀
        prevText: "上月",
        nextText: "下月",
        //currentText: "今天",
        showMonthAfterYear: true,//是否把月放在年的后面  
        defaultDate: new Date(),//默认日期  
        //minDate: new Date(),//最小日期  
        //maxDate: '2011-03-20',//最大日期  
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onClose: function (selectedDate) {
            $("#search_end_createtime").datepicker("option", "minDate", selectedDate);
        },
        onSelect: function (selectedDate) {//选择日期后执行的操作  
            // alert(selectedDate);
        }
    });

    $("#search_end_createtime").datepicker({//添加日期选择功能  
        //changeMonth:true,
        //changeYear:true,
        numberOfMonths: 1,//显示几个月  
        //showButtonPanel: true,//是否显示按钮面板  
        dateFormat: 'yy-mm-dd',//日期格式  
        clearText: "清除",//清除日期的按钮名称  
        closeText: "关闭",//关闭选择框的按钮名称 
        yearSuffix: '年', //年的后缀
        prevText: "上月",
        nextText: "下月",
        //currentText: "今天",
        showMonthAfterYear: true,//是否把月放在年的后面  
        defaultDate: new Date(),//默认日期  
        //minDate: new Date(),//最小日期  
        //maxDate: '2011-03-20',//最大日期  
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onSelect: function (selectedDate) {//选择日期后执行的操作  
            // alert(selectedDate);
        }
    });

    lognum = $.trim($("#search_code").val());
    start = $("#search_start_createtime").val();
    end = $("#search_end_createtime").val();
    account = $.trim($("#search_account").val());
    sendAjaxRequest("ashx/Log.ashx", getTotelPage, encodeURI("json={login:'" + getAccount() + "',lognum:'" + lognum + "',account:'" + account + "',start:'" + start + "',end:'" + end + "',pagesize:'" + pagesize + "'}&op=GetLogCount"));
})

function searchLog() {
    $("#tbody_logs").html("");
    lognum = $.trim($("#search_code").val());
    start = $("#search_start_createtime").val();
    end = $("#search_end_createtime").val();
    account = $.trim($("#search_account").val());
    sendAjaxRequest("ashx/Log.ashx", getTotelPage, encodeURI("json={login:'" + getAccount() + "',lognum:'" + lognum + "',account:'" + account + "',start:'" + start + "',end:'" + end + "',pagesize:'" + pagesize + "'}&op=GetLogCount"));
}

function getTotelPage(data) {
    var obj = eval("((" + data + "))");
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
    sendAjaxRequest("ashx/Log.ashx", getPaginateDataBack, encodeURI("json={login:'" + getAccount() + "',lognum:'" + lognum + "',account:'" + account + "',start:'" + start + "',end:'" + end + "',curpage:'" + page + "',pagesize:'" + pagesize + "'}&op=GetLogPager"));
}

function getPaginateDataBack(data) {
    var obj = eval("(" + data + ")");
    var tabletr = '';
    try {
        $(obj.data).each(function (i, j) {
            tabletr += '<tr id="' + j.LogID + '">';
            tabletr += '<td><span>' + j.LogNum + '</span></td>';
            tabletr += '<td><span>' + j.Account + '</span></td>';
            tabletr += '<td><span>' + j.OperateTime + '</span></td>';
            tabletr += '<td><span>' + j.OperateLog + '</span></td>';
            tabletr += '</tr>';
        });
        $("#tbody_logs").html(tabletr);
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

function addNulltr(length, pageSize) {
    if (length < pageSize) {
        var tabletr = '';
        for (var n = 0; n < pageSize - length; n++) {
            tabletr += '<tr>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '<td>&nbsp;</td>';
            tabletr += '</tr>';
        }
        $("#tbody_logs").append($(tabletr));
    }
}

