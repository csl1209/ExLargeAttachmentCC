//--------------------------------------AJAX begin--------------------------------------------------//
//AJAX请求
//url:请求地址  callback:回调函数 param:post传值的参数不带问号
function sendAjaxRequest(url, callback, param) {
    $.ajax({ url: url, type: 'POST', data: param, dataType: "text", error: ajaxError, dataFilter: backCheck, success: callback });
};

//回调检查
function backCheck(data, type) {
    var allData = data.replace(/(^\s*)|(\s*$)/g, "");
    if (allData == "TimeOut") {
        alert("登录失效！请重新登录！");
        location.href = "../Login.aspx";
        data = "{errMsg:'',result:'false',data:{}}";
        return data;
    }
    else if (allData != "TimeOut") {
        return data;
    }
    return "";
};

function ajaxError(err) {
    //alert("Ajax错误！请联系客服！");
};
//--------------------------------------AJAX end--------------------------------------------------//
function GetPageSize() {
    var xScroll; //页面滚动宽度 
    var yScroll; //页面滚动高度

    if (window.innerHeight && window.scrollMaxY) {
        xScroll = document.body.scrollWidth;
        yScroll = window.innerHeight + window.scrollMaxY;
    }
    else if (document.body.scrollHeight > document.body.offsetHeight) {
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
    }
    else {
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }

    var windowWidth; //屏幕宽度
    var windowHeight; //屏幕高度

    if (self.innerHeight) { // all except Explorer
        windowWidth = self.innerWidth;
        windowHeight = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
    }
    else if (document.body) { // other Explorers
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }
    /*当页面滚动高度比屏幕高度小的时候，页面高度为屏幕高度，反之，为页面滚动高度*/
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    }
    else {
        pageHeight = yScroll;
    }
    /*当页面滚动宽度比屏幕宽度小的时候，页面宽度为屏幕宽度，反之，为页面滚动宽度*/
    if (xScroll < windowWidth) {
        pageWidth = windowWidth;
    }
    else {
        pageWidth = xScroll;
    }

    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
};
//AddRow
function checkAndAddTableRow(table, data) {
    if (typeof (table.rows()[0]) != "undefined" || table.rowsLength() != 0) {
        var hasV = false;
        for (var i = 0; i < data.length; i++) {
            hasV = false;
            for (var j = 0; j < table.rows().length; j++) {
                if (data[i].ID == table.rows()[j].ID) {
                    hasV = true;
                    break;
                }
            }
            if (!hasV)
                table.addRow(data[i], table.rowsLength());
        }
    } 
    else {
        table.addRow(data, table.rowsLength());
    }
}