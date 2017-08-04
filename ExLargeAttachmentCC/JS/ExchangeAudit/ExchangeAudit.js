var zTree;
var treeSelectNodeID = "";
var treeSelectNode;
var rootTreeNode;
var treeSelectNodeType;
var treeSelectNode1;
var nodeExpend = '';
var firstAsyncSuccessFlag = 0;
$(document).ready(function () {
    var winHeight = $(window).height();
    $("#tree").css({"height":winHeight-312+"px","overflow-y":"auto"});
    $("div#ctl00_tab1.Head_Menu_Normal").click();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRootBack, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryTree"));
});

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
        view:{
            showLine:false,
        },
        callback: {
            onAsyncError: onAsyncError,
            onClick: onClick,
            onRightClick: onRightClick,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };
    $.fn.zTree.init($("#tree"), setting, obj);
    zTree = $.fn.zTree.getZTreeObj("tree");
    $("#tree_1_switch").click();
}

function getUrl(treeId, treeNode) {
    if (treeNode.PID == "0")
        rootTreeNode = treeNode;
    var param = "json={login:'" + getAccount() + "',path:'" + encodeURIComponent(treeNode.ID) + "'}&op=QueryTree";
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
            //responseData[i].icon = "../imgs/tree_user.png";
        }
        else if (responseData[i].Type == "group") {
            //responseData[i].icon = "../imgs/tree_group.png";
        }
        else if (responseData[i].Type == "activegroup") {
            //responseData[i].icon = "../imgs/activeGroup.png";
        }
        //if (parentNode.PID == "0" && i == 0) {
        //    zTree.expandNode(responseData.treeNode);
        //}
    }
    if (parentNode.PID == "0") {
        var type = responseData[0].Type;
        treeSelectNode1 = responseData[0].ID;
        gotoDataTable(type);
    }
    return responseData;
}

function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        var selectedNode = zTree.getSelectedNodes();
        var nodes = zTree.getNodes();
        zTree.expandNode(nodes[0], true);

        var childNodes = zTree.transformToArray(nodes[0]);
        zTree.expandNode(childNodes[1], true);
        zTree.selectNode(childNodes[1]);
        var childNodes1 = zTree.transformToArray(childNodes[1]);
        firstAsyncSuccessFlag = 1;
        $(".ztree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
}

function onClick(event, treeId, treeNode) {
    treeSelectNodeID = treeNode.ID;
    treeSelectNode1 = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;   
    //组
    if (treeNode.Type == "group") {
        gotoDataTable("group");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    else if (treeNode.Type == "user") {
        gotoDataTable("user");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-5px", "padding-left": "5px" });
    }
    else if (treeNode.Type == "organizationalUnit") {
        if (treeNode.PID == "0") {
            treeSelectNode1 = "";
            $("#tree li a.curSelectedNode").css({ "background-color": "#fff" });
        } else {
            gotoDataTable("group");
            $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
        }
    }
    else if (treeNode.Type == "activegroup") {
        gotoDataTable("group");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    zTree.expandNode(treeNode);  
}

function onRightClick(event, treeId, treeNode) {
    zTree.selectNode(treeNode);
    treeSelectNodeID = treeNode.ID;
    treeSelectNode1 = treeNode.ID;
    treeSelectNode = treeNode;
    //组
    if (treeNode.Type == "group") {
        gotoDataTable("group");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    else if (treeNode.Type == "user") {
        gotoDataTable("user");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-5px", "padding-left": "5px" });
    }
    else if (treeNode.Type == "organizationalUnit") {
        if (treeNode.PID == "0") {
            treeSelectNode1 = "";
            $("#tree li a.curSelectedNode").css({ "background-color": "#fff" });
        } else {
            gotoDataTable("group");
            $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
        }
    }
    else if (treeNode.Type == "activegroup") {
        gotoDataTable("group");
        $("#tree li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    $("body").bind("mousedown", onBodyMouseDown);
}

function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    $("#OP_Error").text("异步获取数据出现异常。");
    zTree.updateNode(treeNode);
}

function gotoDataTable(type) {
    $("#contentDatas-group").html("");
    $("#contentDatas").html("");
    if (type == "user") {
        $("#user").css("display", "block");
        $("#Group").css("display", "none");
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getUserInfo, "json={login:'" + getAccount() + "',userid:'" + encodeURIComponent(treeSelectNode1) + "'}&op=GetUserInfo");
    } else {
        $("#user").css("display", "none");
        $("#Group").css("display", "block");
        if (treeSelectNode1 != "") {
            sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getGroupInfo, "json={login:'" + getAccount() + "',ouid:'" + encodeURIComponent(treeSelectNode1) + "'}&op=GetOUInfo");
        }
    }
}

function getUserInfo(data) {
    var obj = eval("((" + data + "))");
    if (obj.result == 'true') {
        var str = '';
        if (obj.data.Status == "True") {
            if (obj.data.ManagerUPN != "") {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.UPN + '(' + obj.data.Name + ')</td><td>' + obj.data.ManagerName + '(' + obj.data.ManagerUPN + ')</td><td><a onclick="disable()">停用</a></td></tr>';
            } else {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.UPN + '(' + obj.data.Name + ')</td><td>无</td><td><a onclick="disable()"> 停用</a></td></tr>';
            }
        } else {
            if (obj.data.ManagerUPN != "") {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.UPN + '(' + obj.data.Name + ')</td><td>' + obj.data.ManagerName + '(' + obj.data.ManagerUPN + ')</td><td><a onclick="Enable()">启用</a></td></tr>';
            } else {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.UPN + '(' + obj.data.Name + ')</td><td>无</td><td><a onclick="Enable()"> 启用</a></td></tr>';
            }
        }              
        $("#contentDatas").html(str);
    }
}

function getGroupInfo(data) {
    var obj = eval("((" + data + "))");
    if (obj.result == 'true') {
        var str = '';
        if (obj.data.ManagerStatus == "True") {
            if (obj.data.ManagerAD == "True") {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.Name + '</td><td>' + obj.data.ManagerName + '(' + obj.data.ManagerUPN + ')</td><td><a onclick="disOrgAudit()">停用</a></td></tr>';
            } else {
                str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.Name + '</td><td>无</td><td><a onclick="setOrgAudit()">启用</a></td></tr>';
            }
        } else {
            str = '<tr id="' + obj.data.DName + '"><td>' + obj.data.Name + '</td><td>无</td><td><a onclick="setOrgAudit()">启用</a></td></tr>';
        }
        $("#contentDatas-group").html(str);
    }
}

//弹出框上的树
var zTree2;
function getRootBack2(data) {
    hideLoading();
    data = data.replace("isParent:''", "isParent:'true'");
    var obj = eval("((" + data + "))");
    var setting = {
        async: {
            enable: true,
            url: getUrl2,
            dataFilter: ajaxDataFilter2
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            showLine: false,
        },
        callback: {
            onAsyncError: onAsyncError2,
            onClick: onClick2,
            onRightClick: onRightClick2
        }
    };
    $.fn.zTree.init($("#tree2"), setting, obj);
    zTree2 = $.fn.zTree.getZTreeObj("tree2");
    $("#tree2_1_switch").click();
}

function getUrl2(treeId, treeNode) {
    if (treeNode.PID == "0")
        rootTreeNode = treeNode;
    var param = "json={login:'" + getAccount() + "',path:'" + encodeURIComponent(treeNode.ID) + "'}&op=QueryTree";
    return "../ashx/ADManage_ashx/AdManage.ashx?" + param;
}

function ajaxDataFilter2(treeId, parentNode, responseData) {
    for (var i = 0; i < responseData.length; i++) {
        if (responseData[i].Type == "organizationalUnit") {
            responseData[i].isParent = true;
        }
        if (responseData[i].Type == "organizationalUnit1") {
            responseData[i].isParent = true;
        }
        else if (responseData[i].Type == "user") {
            //responseData[i].icon = "../imgs/tree_user.png";
        }
        else if (responseData[i].Type == "group") {
            //responseData[i].icon = "../imgs/tree_group.png";
        }
        else if (responseData[i].Type == "activegroup") {
            //responseData[i].icon = "../imgs/activeGroup.png";
        }
    }
    return responseData;
}

function onClick2(event, treeId, treeNode) {
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    editAccountName = treeNode.sAMAccountName;
    treeSelectNodeType = treeNode.Type;
    if (treeNode.Type == "group") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    else if (treeNode.Type == "user") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-5px", "padding-left": "5px" });
    }
    else if (treeNode.Type == "organizationalUnit") {
        if (treeNode.PID == "0") {
            $("#tree2_1_a").css({ "background-color": "#fff" });
        } else {
            $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
        }
    }
    else if (treeNode.Type == "activegroup") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    $("#treeTxt").val(treeNode.name);
    zTree2.expandNode(treeNode);
}

function onRightClick2(event, treeId, treeNode) {
    zTree.selectNode(treeNode);
    treeSelectNodeID = treeNode.ID;
    treeSelectNode = treeNode;
    treeSelectNodeType = treeNode.Type;
    if (treeNode.Type == "group") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    else if (treeNode.Type == "user") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-5px", "padding-left": "5px" });
    }
    else if (treeNode.Type == "organizationalUnit") {
        if (treeNode.PID == "0") {
            $("#tree2_1_a").css({ "background-color": "#fff" });
        } else {
            $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
        }
    }
    else if (treeNode.Type == "activegroup") {
        $("#tree2 li a.curSelectedNode").css({ "margin-left": "-22px", "padding-left": "22px" });
    }
    $("#treeTxt").val(treeNode.name);
    $("body").bind("mousedown", onBodyMouseDown);
}

function onAsyncError2(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    $("#OP_Error").text("异步获取数据出现异常。");
    zTree2.updateNode(treeNode);
}


function searchTree() {
    if ($.trim($("#treeTxt").val()) == "") {
        return;
    }
    $("#setOrgAudit-submit-info").html("");
    treeSelectNodeType = "";
    var _searchValue = $.trim($("#treeTxt").val());
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchTreeBack, "json={login:'" + getAccount() + "',txt:'" +encodeURIComponent( _searchValue) + "'}&op=SearchTree");
    showLoading();
}

function getSearchTreeBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (data == "[]") {
        $("#tree2").html("<p style='padding-top:6px;'>未找到该用户！</p>");
        treeSelectNodeType = "";
    } else {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].Type == "organizationalUnit") {
                //obj[i].isParent = true;
                obj[i].icon = "../js/tree/zTreeStyle/img/group.png";
            }
            if (obj[i].Type == "organizationalUnit1") {
                //obj[i].isParent = true;
                obj[i].icon = "../js/tree/zTreeStyle/img/group.png";
            }
            else if (obj[i].Type == "user") {
                obj[i].icon = "../js/tree/zTreeStyle/img/user.png";
            }
            else if (obj[i].Type == "group") {
                obj[i].icon = "../js/tree/zTreeStyle/img/group.png";
            }
            else if (obj[i].Type == "activegroup") {
                obj[i].icon = "../js/tree/zTreeStyle/img/group.png";
            }
        }
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            view: {
                showLine: false,
            },
            callback: {
                onClick: onClick2,
                onRightClick: onRightClick2
            }
        };
        $.fn.zTree.init($("#tree2"), setting, obj);
        zTree2 = $.fn.zTree.getZTreeObj("tree2");
    }
}

function returnNormalTree() {   
    showLoading();
    $("#treeTxt").val("");
    $("#setOrgAudit-submit-info").html("");
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRootBack2, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryTree"));
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

function showLoading() {
    $("#background").show();
    $("#progressBar").show();
}

function hideLoading() {
    $("#background").hide();
    $("#progressBar").hide();
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

function setOrgAudit() {
    $("#p_group_E").html($("#contentDatas-group td:nth-child(1)").html());
    $('#setOrgAudit_Modal').modal('show');
    $("#setOrgAudit_btn").button("reset");
    $("#setOrgAudit_btn").css("display", "inline-block");
    $("#treeTxt").css("display", "block");
    $("#treeTxt").val("");
    $("#p_Audit").css("display", "none");
    $(".oprate-butons").css("display", "block");
    $(".treeHide").css("display", "block");
    $("#setOrgAudit-submit-info").html("");
    $("#setOrgAudit_btn").removeClass("noborder");
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRootBack2, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryTree"));
}

function setOrgAuditBT() {
    if (treeSelectNodeType == "user") {
        var _ouid = $("#contentDatas-group tr").attr("id");
        $("#setOrgAudit_btn").button("loading");
        $("#setOrgAudit_btn").addClass("noborder");
        $(".loadingCSS").css("visibility", "visible");
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", setOrgAuditBTBack, "json={login:'" + getAccount() + "',ouid:'" + encodeURIComponent(_ouid) + "',userid:'" + encodeURIComponent(treeSelectNodeID) + "'}&op=UpdateOUInfo");
    } else {
        $("#setOrgAudit-submit-info").html("<span style='color:#e80000;'>操作失败！请选择用户。</span>");
    }
}

function setOrgAuditBTBack(data) {
    $(".loadingCSS").css("visibility", "hidden");
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#p_Audit").html($("#treeTxt").val());
        $("#p_Audit").css("display", "block");
        $(".oprate-butons").css("display", "none");
        $(".treeHide").css("display", "none");
        $("#treeTxt").css("display", "none");
        $("#setOrgAudit_btn").css("display", "none"); 
        $("#setOrgAudit-submit-info").html("操作成功！");
        gotoDataTable("ou");
    } else {
        gotoDataTable("ou");
        $("#setOrgAudit_btn").button("reset");
        $("#setOrgAudit_btn").removeClass("noborder");
        $("#setOrgAudit-submit-info").html("<span style='color:#e80000;'>操作失败！</span>");
    }
}

function disOrgAudit() {
    $('#disOrgAudit_Modal').modal('show');
    $("#p_group_D").html($("#contentDatas-group td:nth-child(1)").html());
    $("#p_disAudit").html("无");
    var _ouid = $("#contentDatas-group tr").attr("id");
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", disOrgAuditBack, "json={login:'" + getAccount() + "',ouid:'" + encodeURIComponent(_ouid) + "',userid:''}&op=UpdateOUInfo");
}

function disOrgAuditBack(data) {
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#disOrgAudit-submit-info").html("操作成功！");
        gotoDataTable("ou");
    } else {
        gotoDataTable("ou");
        $("#p_disAudit").html("无");
        $("#disOrgAudit-submit-info").html("<span style='color:#e80000;'>操作失败！</span>");
    }
}

function Enable() {
    $('#Enable_Modal').modal('show');
    $("#p_useraccount_E").html($("#contentDatas td:nth-child(1)").html());
    $("#p_userAudit_E").html($("#contentDatas td:nth-child(2)").html());
    var _userid = $("#contentDatas tr").attr("id");
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", EnableBack, "json={login:'" + getAccount() + "',userid:'" + encodeURIComponent(_userid) + "',status:'True'}&op=UpdateUserInfo");
}

function EnableBack(data) {
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#Enable-submit-info").html("操作成功！");
        gotoDataTable("user");
    } else {
        $("#Enable-submit-info").html("<span style='color:#e80000;'>操作失败！</span>");
    }
}

function disable() {
    $('#disable_Modal').modal('show');
    $("#p_useraccount_D").html($("#contentDatas td:nth-child(1)").html());
    $("#p_userAudit_D").html($("#contentDatas td:nth-child(2)").html());
    var _userid = $("#contentDatas tr").attr("id");
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", disableBack, "json={login:'" + getAccount() + "',userid:'" + encodeURIComponent(_userid) + "',status:'False'}&op=UpdateUserInfo");
}

function disableBack(data) {
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#disable-submit-info").html("操作成功！");
        gotoDataTable("user");
    } else {
        $("#disable-submit-info").html("<span style='color:#e80000;'>操作失败！</span>");
    }
}