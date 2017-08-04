var SMCTable;
var zTree;
var treeSelectNodeID = "";
var treeSelectNode;
var openFor = "U";
var saveSuccessId = "";
var rootTreeNode;
var editAccountName = "";

$(document).ready(function () {
    var SMC_cols = [
                    { title: '接收邮件', name: 'ReceiveMailCount', width: 80, align: 'left' },
                    { title: '发送邮件', name: 'SendMailCount', width: 80, align: 'left' },
                    { title: '汇总邮件', name: 'TotalMailCount', width: 80, align: 'left' }
                ];
    SMCTable = $('#SMC_table').mmGrid({
        cols: SMC_cols,
        width: "480px",
        height: "355px",
        nowrap: true,
        fullWidthRows: true,
        showBackboard: false
    });
    sendAjaxRequest("../ashx/Report_ashx/Report.ashx", getSMCBack, encodeURI("json={login:'" + getAccount() + "',db:'" + jQuery("#SMC_dayselect option:selected")[0].value + "'}&op=Query_SystemMailCount"));
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRootBack, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryTree"));
});
function getSMCBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        SMCTable.load(obj.data);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function searchSMCData() {
    showLoading();
    sendAjaxRequest("../ashx/Report_ashx/Report.ashx", getSMCBack, encodeURI("json={login:'" + getAccount() + "',db:'" + jQuery("#SMC_dayselect option:selected")[0].value + "'}&op=Query_SystemMailCount"));
}
function getRootBack(data) {
    hideLoading();
    data = data.replace("isParent:''", "isParent:'true'");
    var obj = eval("((" + data + "))");
    var setting = {
        async: {
            enable: true,
            url: getUrl,
            dataFilter: ajaxDataFilter
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onAsyncError: onAsyncError,
            onClick: onClick,
            onRightClick: onRightClick
        }
    };
    $.fn.zTree.init($("#tree"), setting, obj);
    zTree = $.fn.zTree.getZTreeObj("tree");
}
function getUrl(treeId, treeNode) {
    if (treeNode.PID == "0")
        rootTreeNode = treeNode;
    var param = encodeURI("json={login:'" + getAccount() + "',path:'" + treeNode.ID + "'}&op=QueryTree");
    return "../ashx/ADManage_ashx/AdManage.ashx?" + param;
}
function ajaxDataFilter(treeId, parentNode, responseData) {
    for (var i = 0; i < responseData.length; i++) {
        if (responseData[i].Type == "organizationalUnit") {
            responseData[i].isParent = true;
        }
        if (responseData[i].Type == "organizationalUnit1") {
            responseData[i].isParent = true;
        }
        else if (responseData[i].Type == "user") {
            responseData[i].icon = "../imgs/tree_user.png";
        }
        else if (responseData[i].Type == "group") {
            responseData[i].icon = "../imgs/tree_group.png";
        } 
        else if (responseData[i].Type == "activegroup") {
            responseData[i].icon = "../imgs/activeGroup.png";
        }
    }
    return responseData;
}
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    $("#OP_Error").text("异步获取数据出现异常。");
    zTree.updateNode(treeNode);
}
function searchTree() {
    if ($.trim($("#treeTxt").val()) == "") {
        return;
    }
    initAllPanel();
    $("#searchTree").show();
    $("#opTxt").text("搜索");
    $("#returnBT").prop("disabled", "");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt").val() + "'}&op=SearchTree"));
}
function getSearchTreeBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].Type == "organizationalUnit") {
            //obj[i].isParent = true;
            obj[i].icon = "../imgs/ou.png";
        }
        if (obj[i].Type == "organizationalUnit1") {
            //obj[i].isParent = true;
            obj[i].icon = "../imgs/ou.png";
        }
        else if (obj[i].Type == "user") {
            obj[i].icon = "../imgs/tree_user.png";
        }
        else if (obj[i].Type == "group") {
            obj[i].icon = "../imgs/tree_group.png";
        }
        else if (obj[i].Type == "activegroup") {
            obj[i].icon = "../imgs/activeGroup.png";
        }
    }
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onRightClick: onRightClick
        }
    };
    $.fn.zTree.init($("#tree"), setting, obj);
    zTree = $.fn.zTree.getZTreeObj("tree");
}
function returnNormalTree() {
    initAllPanel();
    $("#sysMailsCount").show();
    $("#opTxt").text("系统邮件数量");
    $("#returnBT").prop("disabled", "disabled");
    $("#treeTxt").val("");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRootBack, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryTree"));
}

function onRightClick(event, treeId, treeNode) {
    zTree.selectNode(treeNode);
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;
    if (treeNode.Type == "organizationalUnit") {
        $("#ouMenu ul").show();
        $("#ouMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
        if (treeNode.PID == "0") {
            $("#m_ou_edit").hide();
            $("#m_ou_del").hide();
            $("#m_ou_move").hide();
            if (getAccountType() != "0") {
                $("#m_ou_add").hide();
                $("#m_user_add").hide();
                $("#m_sgroup_add").hide();
                $("#m_agroup_add").hide();
            }
        } else {
            $("#m_ou_edit").show();
            $("#m_ou_del").show();
            $("#m_ou_move").show();
        }
    }
    if (treeNode.Type == "organizationalUnit1") {
        //$("#ouMenu ul").show();
        //$("#ouMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
        $("#m_ou_edit").hide();
        $("#m_ou_del").hide();
        $("#m_ou_move").hide();
        $("#m_ou_add").hide();
        $("#m_user_add").hide();
        $("#m_sgroup_add").hide();
        $("#m_agroup_add").hide();
    }
    else if (treeNode.Type == "group") {
        $("#staticGroupMenu ul").show();
        $("#staticGroupMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }
    else if (treeNode.Type == "user") {
        $("#userMenu ul").show();
        $("#userMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }
    else if (treeNode.Type == "activegroup") {
        $("#activeGroupMenu ul").show();
        $("#activeGroupMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }

    $("body").bind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event) {
    if (!(event.target.id == "ouMenu" || $(event.target).parents("#ouMenu").length > 0)) {
        $("#ouMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "staticGroupMenu" || $(event.target).parents("#staticGroupMenu").length > 0)) {
        $("#staticGroupMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "userMenu" || $(event.target).parents("#userMenu").length > 0)) {
        $("#userMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "activeGroupMenu" || $(event.target).parents("#activeGroupMenu").length > 0)) {
        $("#activeGroupMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "publicOuMenu" || $(event.target).parents("#publicOuMenu").length > 0)) {
        $("#publicOuMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "publicUserMenu" || $(event.target).parents("#publicUserMenu").length > 0)) {
        $("#publicUserMenu").css({ "visibility": "hidden" });
    }
    if (!(event.target.id == "delUserMenu" || $(event.target).parents("#delUserMenu").length > 0)) {
        $("#delUserMenu").css({ "visibility": "hidden" });
    }
}
function hideRMenu() {
    $("#ouMenu").css({ "visibility": "hidden" });
    $("#staticGroupMenu").css({ "visibility": "hidden" });
    $("#userMenu").css({ "visibility": "hidden" });
    $("#activeGroupMenu").css({ "visibility": "hidden" });

    $("#publicOuMenu").css({ "visibility": "hidden" });
    $("#publicUserMenu").css({ "visibility": "hidden" });
    $("#delUserMenu").css({ "visibility": "hidden" });
    $("body").unbind("mousedown", onBodyMouseDown);
}

function onClick(event, treeId, treeNode) {
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;
    initAllPanel();
    if (treeSelectNode.PID == "0") {
        $("#sysMailsCount").show();
        $("#opTxt").text("系统邮件数量");
        return;
    }
    //组
    if (treeNode.Type == "group") {
        openFor = "GU";
        gotoGroupEditPanel();
    }
    else if (treeNode.Type == "user") {
        openFor = "U";
        gotoUserEditPanel();
    }
    else if (treeNode.Type == "organizationalUnit") {
        gotoOUEditPanel();
    }
    else if (treeNode.Type == "activegroup") {
        gotoActiveGroupEditPanel();
    }
}

function showLoading() {
    $("#background").show();
    $("#progressBar").show();
}
function hideLoading() {
    $("#background").hide();
    $("#progressBar").hide();
}

function initAllPanel() {
    $("#OP_Error").text("");
    $("#searchTree").hide();
    $("#sysMailsCount").hide();
    $("#OUAdd").hide();
    $("#OUEdit").hide();
    $("#OUMove").hide();
    $("#OUDel").hide();
    $("#OUDelSuccess").hide();
    $("#OUAddSuccess").hide();
    $("#OUMoveSuccess").hide();

    $("#UserAdd1").hide();
    $("#UserAdd2").hide();
    $("#UserAdd3").hide();
    $("#UserEdit").hide();
    $("#UE_click1").attr("class", "propClick");
    $("#UE_click2").attr("class", "propNoClick");
    $("#UE_click3").attr("class", "propNoClick");
    $("#UE_click4").attr("class", "propNoClick");
    $("#UE_accountprop").show();
    $("#UE_groupprop").hide();
    $("#UE_statusprop").hide();
    $("#UE_mailprop").hide();
    $("#UserMove").hide();
    $("#DelUserMove").hide();
    $("#UserDel").hide();
    $("#UserDelSuccess").hide();
    $("#UserAddSuccess").hide();
    $("#UserMoveSuccess").hide();

    $("#GroupAdd1").hide();
    $("#GroupAdd2").hide();
    $("#GroupEdit").hide();
    $("#GE_click1").attr("class", "propClick");
    $("#GE_click2").attr("class", "propNoClick");
    $("#GE_propprop").show();
    $("#GE_member").hide();
    $("#GroupDel").hide();
    $("#GroupDelSuccess").hide();
    $("#GroupAddSuccess").hide();

    $("#ActiveGroupAdd1").hide();
    $("#ActiveGroupAdd2").hide();
    $("#ActiveGroupEdit").hide();
    $("#AGE_click1").attr("class", "propClick");
    $("#AGE_click2").attr("class", "propNoClick");
    $("#AGE_propprop").show();
    $("#AGE_filterprop").hide();
    $("#ActiveGroupDel").hide();
    $("#ActiveGroupDelSuccess").hide();
    $("#ActiveGroupDel").hide();
    $("#ActiveGroupAddSuccess").hide();
}

function searchData() {
    if ($.trim($("#Pop_txt").val()) == "") {
        return;
    }
    showLoading();
    if (openFor == "GU") {
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchGUDataBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#Pop_txt").val() + "',id:'" + treeSelectNodeID + "'}&op=SearchGroupData"));
    }
    else if (openFor == "U") {
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchUDataBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#Pop_txt").val() + "',id:'" + treeSelectNodeID + "'}&op=SearchUserData"));
    }
    else if (openFor == "AGA_B" || openFor == "AGA_M" || openFor == "AGE_M") {
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchOUDataBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#Pop_txt").val() + "'}&op=SearchOUData"));
    }
}
function searchGUDataBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            html += "<option value='" + obj.data[i].ID + "' tag='" + obj.data[i].Type + "' tn='" + obj.data[i].name + "' >" + obj.data[i].name + "(" + obj.data[i].Type + ")" + "</option>";
        }
        $("#Pop_searchlist").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function searchUDataBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            html += "<option value='" + obj.data[i].ID + "' tag='" + obj.data[i].Type + "'>" + obj.data[i].name + "</option>";
        }
        $("#Pop_searchlist").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function searchOUDataBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            html += "<option value='" + obj.data[i].ID + "'>" + obj.data[i].name + "</option>";
        }
        $("#Pop_searchlist").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function setDataBackToPage() {
    if (jQuery("#Pop_searchlist  option:selected").length <= 0)
        return;
    var ous = "[";
    if (openFor == "GU") {
        ous += "{name:'" + jQuery("#Pop_searchlist  option:selected")[0].attributes["tn"].value + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[0].value + "',Type:'" + jQuery("#Pop_searchlist  option:selected")[0].attributes["tag"].value + "' }";
        for (var i = 1; i < jQuery("#Pop_searchlist  option:selected").length; i++) {
            ous += ",{name:'" + jQuery("#Pop_searchlist  option:selected")[i].attributes["tn"].value + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[i].value + "',Type:'" + jQuery("#Pop_searchlist  option:selected")[i].attributes["tag"].value + "' }";
        }
        ous += "]";
        setToStaticAddGroupMembers(ous);
    }
    else if (openFor == "U") {
        ous += "{name:'" + jQuery("#Pop_searchlist  option:selected")[0].text + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[0].value + "',Type:'" + jQuery("#Pop_searchlist  option:selected")[0].attributes["tag"].value + "' }";
        for (var i = 1; i < jQuery("#Pop_searchlist  option:selected").length; i++) {
            ous += ",{name:'" + jQuery("#Pop_searchlist  option:selected")[i].text + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[i].value + "',Type:'" + jQuery("#Pop_searchlist  option:selected")[i].attributes["tag"].value + "' }";
        }
        ous += "]";
        setToAddUserBelongs(ous);
    }
    else if (openFor == "AGA_B") {
        ous = "{name:'" + jQuery("#Pop_searchlist  option:selected")[0].text + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[0].value + "' }";
        setToAddActiveGroupBelongs(ous);
    }
    else if (openFor == "AGA_M") {
        ous = "{name:'" + jQuery("#Pop_searchlist  option:selected")[0].text + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[0].value + "' }";
        setToAddActiveGroupMembers(ous);
    }
    else if (openFor == "AGE_M") {
        ous = "{name:'" + jQuery("#Pop_searchlist  option:selected")[0].text + "',ID:'" + jQuery("#Pop_searchlist  option:selected")[0].value + "' }";
        setToEditActiveGroupMembers(ous);
    }
    $("#Pop_close").click();
    $("#Pop_txt").val("");
    $("#Pop_searchlist").html("");
}
function initPopSearch() {
    $("#Pop_txt").val("");
    $("#Pop_searchlist").html("");
}

function refreshTree(level) {
    hideRMenu();
    if (level == "parent") {
        if (treeSelectNode.getParentNode() != null)
            zTree.reAsyncChildNodes(treeSelectNode.getParentNode(), "refresh");
        else {
            showLoading();
            sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt").val() + "'}&op=SearchTree"));
        }
    } else if (level == "self") {
        zTree.reAsyncChildNodes(treeSelectNode, "refresh");
    } else {
        zTree.reAsyncChildNodes(rootTreeNode, "refresh");
    }
}


var treeTab = 1;
var zTree2, zTree3;
function changeTree(type) {
    if (treeTab == type)
        return;
    treeTab = type;
    $("#treeTab1").css("backgroundColor", "#D3D1D3");
    $("#treeTab2").css("backgroundColor", "#D3D1D3");
    $("#treeTab3").css("backgroundColor", "#D3D1D3");
    $("#treeDiv1").hide();
    $("#treeDiv2").hide();
    $("#treeDiv3").hide();
    initAllPanel();
    $("#opTxt").text("系统邮件数量");
    $("#sysMailsCount").show();
    if (treeTab == 1) {
        $("#treeTab1").css("backgroundColor", "white");
        $("#treeDiv1").show();
        if (typeof (rootTreeNode) != "undefined") {
            refreshTree("root");
        }
        if (!$("#returnBT").prop("disabled")) {
            returnNormalTree();
        }
    }
    else if (treeTab == 2) {
        $("#treeTab2").css("backgroundColor", "white");
        $("#treeDiv2").show();
        $("#treeTxt2").val("");
        $("#returnBT2").prop("disabled", "disabled");
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRoot2Back, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryPublicTree"));
    }
    else if (treeTab == 3) {
        $("#treeTab3").css("backgroundColor", "white");
        $("#treeDiv3").show();
        $("#treeTxt3").val("");
        $("#returnBT3").prop("disabled", "disabled");
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRoot3Back, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryDelTree"));
    }
}
function getUrl2(treeId, treeNode) {
    var param = encodeURI("json={login:'" + getAccount() + "',path:'" + treeNode.ID + "'}&op=QueryPublicTree");
    return "../ashx/ADManage_ashx/AdManage.ashx?" + param;
}
function getRoot2Back(data) {
    hideLoading();
    data = data.replace("isParent:''", "isParent:'true'");
    var obj = eval("((" + data + "))");
    var setting = {
        async: {
            enable: true,
            url: getUrl2,
            dataFilter: ajaxDataFilter
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onAsyncError: onAsyncError,
            onClick: onClick,
            onRightClick: onRightClick2
        }
    };
    $.fn.zTree.init($("#tree2"), setting, obj);
    zTree2 = $.fn.zTree.getZTreeObj("tree2");
}
function onRightClick2(event, treeId, treeNode) {
    zTree2.selectNode(treeNode);
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;
    if (treeNode.Type == "organizationalUnit") {
        $("#publicOuMenu ul").show();
        $("#publicOuMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }
    else if (treeNode.Type == "user") {
        $("#publicUserMenu ul").show();
        $("#publicUserMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }

    $("body").bind("mousedown", onBodyMouseDown);
}

function getUrl3(treeId, treeNode) {
    var param = encodeURI("json={login:'" + getAccount() + "',path:'" + treeNode.ID + "'}&op=QueryDelTree");
    return "../ashx/ADManage_ashx/AdManage.ashx?" + param;
}
function getRoot3Back(data) {
    hideLoading();
    data = data.replace("isParent:''", "isParent:'true'");
    var obj = eval("((" + data + "))");
    var setting = {
        async: {
            enable: true,
            url: getUrl3,
            dataFilter: ajaxDataFilter
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onAsyncError: onAsyncError,
            onRightClick: onRightClick3
        }
    };
    $.fn.zTree.init($("#tree3"), setting, obj);
    zTree3 = $.fn.zTree.getZTreeObj("tree3");
}
function onRightClick3(event, treeId, treeNode) {
    zTree3.selectNode(treeNode);
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;
    if (treeNode.Type == "user") {
        $("#delUserMenu ul").show();
        $("#delUserMenu").css({ "top": event.clientY + "px", "left": event.clientX + "px", "visibility": "visible" });
    }

    $("body").bind("mousedown", onBodyMouseDown);
}

function searchPublicTree() {
    if ($.trim($("#treeTxt2").val()) == "") {
        return;
    }
    initAllPanel();
    $("#searchTree").show();
    $("#opTxt").text("搜索");
    $("#returnBT2").prop("disabled", "");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchPublicTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt2").val() + "'}&op=SearchPublicTree"));
}
function getSearchPublicTreeBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].Type == "organizationalUnit") {
            //obj[i].isParent = true;
            obj[i].icon = "../imgs/ou.png";
        }
        else if (obj[i].Type == "user") {
            obj[i].icon = "../imgs/tree_user.png";
        }
        else if (obj[i].Type == "group") {
            obj[i].icon = "../imgs/tree_group.png";
        }
        else if (obj[i].Type == "activegroup") {
            obj[i].icon = "../imgs/activeGroup.png";
        }
    }
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            onRightClick: onRightClick2
        }
    };
    $.fn.zTree.init($("#tree2"), setting, obj);
}
function returnNormalPublicTree() {
    initAllPanel();
    $("#sysMailsCount").show();
    $("#opTxt").text("系统邮件数量");
    $("#returnBT2").prop("disabled", "disabled");
    $("#treeTxt2").val("");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRoot2Back, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryPublicTree"));
}

function searchDelTree() {
    if ($.trim($("#treeTxt3").val()) == "") {
        return;
    }
    initAllPanel();
    $("#searchTree").show();
    $("#opTxt").text("搜索");
    $("#returnBT3").prop("disabled", "");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchDelTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt3").val() + "'}&op=SearchDelTree"));
}
function getSearchDelTreeBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].Type == "organizationalUnit") {
            //obj[i].isParent = true;
            obj[i].icon = "../imgs/ou.png";
        }
        else if (obj[i].Type == "user") {
            obj[i].icon = "../imgs/tree_user.png";
        }
        else if (obj[i].Type == "group") {
            obj[i].icon = "../imgs/tree_group.png";
        }
        else if (obj[i].Type == "activegroup") {
            obj[i].icon = "../imgs/activeGroup.png";
        }
    }
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onRightClick: onRightClick3
        }
    };
    $.fn.zTree.init($("#tree3"), setting, obj);
}
function returnNormalDelTree() {
    initAllPanel();
    $("#sysMailsCount").show();
    $("#opTxt").text("系统邮件数量");
    $("#returnBT3").prop("disabled", "disabled");
    $("#treeTxt3").val("");
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRoot3Back, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryDelTree"));
}


function gotoDelUserMovePanel() {
    initAllPanel();
    $("#opTxt").text("移动并启用用户");
    $("#DelUserMove").show();
    hideRMenu();
    $("#DUM_text").val("");
    $("#DUM_ous").html("");
    $("#DUM_account").text(treeSelectNode.name);
    $("#DUM_ou").text(treeSelectNode.PID);
    if ($.trim($("#DUM_ou").val()) == "") {
        var ou = treeSelectNode.ID.substring(treeSelectNode.ID.indexOf(',') + 1, treeSelectNode.ID.indexOf('DC=')-1);

        $("#DUM_ou").text(ou);
    }
}
function searchDelMoveOus() {
    if ($.trim($("#DUM_text").val()) == "") {
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchDelMoveOusBack, encodeURI(
        "json={login:'" + getAccount() + "',txt:'" + $("#DUM_text").val() + "'}&op=SearchUserOus")
        );
}
function searchDelMoveOusBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            html += "<option value='" + obj.data[i].ID + "' >" + obj.data[i].name + "</option>";
        }
        $("#DUM_ous").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function moveDelUserToOU() {
    if (jQuery("#DUM_ous  option:selected").length <= 0)
        return;
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", moveDelUserToOUBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',ou:'" + jQuery("#DUM_ous  option:selected")[0].value + "'}&op=MoveDelUserToOu")
        );
}
function moveDelUserToOUBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#UserMoveSuccess").show();
        if ($("#returnBT3").prop("disabled"))
            zTree3.reAsyncChildNodes(treeSelectNode.getParentNode(), "refresh");
        else {
            showLoading();
            sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchDelTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt3").val() + "'}&op=SearchDelTree"));
        }
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}