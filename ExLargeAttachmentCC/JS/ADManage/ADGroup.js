var GA2Table = null;
var GETable = null;
var oldUserName = "";
function showGA2_Table() {
    if (GA2Table == null) {
        var GA2_cols = [
                    { title: '名称', name: 'name', width: 120, align: 'left' },
                    { title: '类型', name: 'Type', width: 120, align: 'left' },
                    { title: '操作', name: '', width: 50, align: 'center', lockWidth: true, renderer: function (val) {
                        return "<img src='../imgs/del.png' class='btnDel' title='删除' style='cursor:pointer'/>"
                    }
                    }
                ];
        GA2Table = $('#GA2_table').mmGrid({
            cols: GA2_cols,
            width: "370px",
            height: "320px",
            nowrap: true,
            fullWidthRows: true,
            showBackboard: false
        });
        GA2Table.on('cellSelected', function (e, item, rowIndex, colIndex) {
            if ($(e.target).is('.btnDel')) {
                e.stopPropagation();
                GA2Table.removeRow(rowIndex);
            }
        });
    }
}
function showGE_Table() {
    if (GETable == null) {
        var GE_cols = [
                    { title: '名称', name: 'name', width: 120, align: 'left' },
                    { title: '类型', name: 'Type', width: 120, align: 'left' },
                    { title: '操作', name: '', width: 50, align: 'center', lockWidth: true, renderer: function (val) {
                        return "<img src='../imgs/del.png' class='btnDel' title='删除' style='cursor:pointer'/>"
                    }
                    }
                ];
        GETable = $('#GE_table').mmGrid({
            cols: GE_cols,
            width: "370px",
            height: "320px",
            nowrap: true,
            fullWidthRows: true,
            showBackboard: false
        });
        GETable.on('cellSelected', function (e, item, rowIndex, colIndex) {
            if ($(e.target).is('.btnDel')) {
                e.stopPropagation();
                GETable.removeRow(rowIndex);
            }
        });
    }
}

function addStaticGroup() {
    initAllPanel();
    $("#opTxt").text("添加静态组");
    $("#GroupAdd1").show();
    initGroupInput();
    hideRMenu();
}

function initGroupInput() {
    $("#GA1_upn").val("");
    $("#GA1_name").val("");
    $("#GA1_type_TX").prop("checked", true);
    $("#GA1_zonetype_TY").prop("checked", true);
    $("#GA1_detail").val("");
    $("#GA1_aTR").show();

    $("#GE_detail").val("");
}
function getGroupAddType() {
    var type = "";
    if ($("#GA1_zonetype_TY").prop("checked") && $("#GA1_type_Safe").prop("checked")) {
        type = "3";
    } else if ($("#GA1_zonetype_TY").prop("checked") && $("#GA1_type_TX").prop("checked")) {
        type = "1";
    } else if ($("#GA1_zonetype_QJ").prop("checked") && $("#GA1_type_Safe").prop("checked")) {
        type = "4";
    } else if ($("#GA1_zonetype_QJ").prop("checked") && $("#GA1_type_TX").prop("checked")) {
        type = "2";
    }
    return type;
}
function getGroupEditType() {
    var type = "";
    if ($("#GE_zonetype_TY").prop("checked") && $("#GE_type_Safe").prop("checked")) {
        type = "3";
    } else if ($("#GE_zonetype_TY").prop("checked") && $("#GE_type_TX").prop("checked")) {
        type = "1";
    } else if ($("#GE_zonetype_QJ").prop("checked") && $("#GE_type_Safe").prop("checked")) {
        type = "4";
    } else if ($("#GE_zonetype_QJ").prop("checked") && $("#GE_type_TX").prop("checked")) {
        type = "2";
    }
    return type;
}
function addGroup_toNext2() {
    if (!$("#GA1_zonetype_QJ").prop("checked") && $.trim($("#GA1_upn").val()) == "") {
        $("#OP_Error").text("请输入静态组的用户!");
        return;
    } else if ($.trim($("#GA1_name").val()) == "") {
        $("#OP_Error").text("请输入静态组的显示名称!");
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addGroup_toNext2Back, encodeURI(
        "json={login:'" + getAccount() + "',pid:'" + treeSelectNodeID + "',upn:'" + $("#GA1_upn").val() + "',name:'" + $("#GA1_name").val() +
        "',detail:'" + $("#GA1_detail").val() + "',type:'" + getGroupAddType() + "'}&op=AddGroup")
        );
}

function addGroup_toNext2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("添加成功，继续添加成员");
        $("#GroupAdd1").hide();
        $("#GroupAdd2").show();
        openFor = "GU";
        $("#GA2_account").text($("#GA1_name").val());
        showGA2_Table();
        GA2Table.load([]);
        saveSuccessId = obj.data.ID;
        refreshTree("self");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function setToStaticAddGroupMembers(mes) {
    var data = eval("((" + mes + "))");
    if (treeSelectNodeID.indexOf("OU") == 0)
        checkAndAddTableRow(GA2Table, data);
    else if (treeSelectNodeID.indexOf("CN") == 0)
        checkAndAddTableRow(GETable, data);
}
function addGroup_Finish() {
    showLoading();
    var ms = "";
    if (typeof (GA2Table.rows()[0]) != "undefined") {
        for (var i = 0; i < GA2Table.rows().length; i++) {
            ms += GA2Table.rows()[i].ID + ";";
        }
    }
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addGroup_FinishBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + saveSuccessId + "',member:'" + ms + "'}&op=AddGroupMembers")
        );
}
function addGroup_FinishBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#GroupAddSuccess").show();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function toChangeGroupEditPanel1() {
    if ($("#GE_click1").attr("class") != "propClick") {
        $("#GE_click1").attr("class", "propClick");
        $("#GE_click2").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#GE_propprop").show();
    $("#GE_member").hide();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoGroupEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryOneGroup")
        );
}
function toChangeGroupEditPanel2() {
    if ($("#GE_click2").attr("class") != "propClick") {
        $("#GE_click2").attr("class", "propClick");
        $("#GE_click1").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#GE_propprop").hide();
    $("#GE_member").show();
    showGE_Table();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", toChangeGroupEditPanel2Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryGroupMember")
        );
}
function toChangeGroupEditPanel2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        GETable.load(obj.data);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoGroupEditPanel() {
    initAllPanel();
    openFor = "GU";
    $("#opTxt").text("修改静态组");
    $("#GroupEdit").show();
    //$("#GE_account1").val(editAccountName);
    //$("#GE_account2").text(editAccountName);
    initGroupInput();
    hideRMenu();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoGroupEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryOneGroup")
        );
}
function gotoGroupEditPanelBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#GE_account1").val(obj.data.name);
        $("#GE_account2").text(obj.data.name);
        oldUserName = obj.data.name;
        $("#GE_detail").val(obj.data.Description);
        if (obj.data.Type == "1") {
            $("#GE_type_TX").prop("checked", true);
            $("#GE_zonetype_TY").prop("checked", true);
        } else if (obj.data.Type == "2") {
            $("#GE_type_TX").prop("checked", true);
            $("#GE_zonetype_QJ").prop("checked", true);
        }
        else if (obj.data.Type == "3") {
            $("#GE_type_Safe").prop("checked", true);
            $("#GE_zonetype_TY").prop("checked", true);
        }
        else if (obj.data.Type == "4") {
            $("#GE_type_Safe").prop("checked", true);
            $("#GE_zonetype_QJ").prop("checked", true);
        }
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}



function editStaticGroup() {
    if ($("#GE_click1").attr("class") == "propClick") {
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", editStaticGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',name:'" + $("#GE_account1").val() + "',detail:'" + $("#GE_detail").val() +
        "',type:'" + getGroupEditType() + "'}&op=ModifyGroup")
        );
    }
    else {
        showLoading();
        var ms = "";
        if (typeof (GETable.rows()[0]) != "undefined") {
            for (var i = 0; i < GETable.rows().length; i++) {
                ms += GETable.rows()[i].ID + ";";
            }
        }
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", editStaticGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',member:'" + ms + "'}&op=AddGroupMembers")
        );
    }
}
function editStaticGroupBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#GE_account2").text($("#GE_account1").val());
        $("#OP_Error").text("修改成功!");
        refreshTree("parent");
        treeSelectNodeID = treeSelectNodeID.replace(oldUserName, $("#GE_account1").val());
        oldUserName = $("#GE_account1").val();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoGroupDelPanel() {
    hideRMenu();
    initAllPanel();
    $("#opTxt").text("删除静态组");
    $("#GroupDel").show();
}
function delStaticGroup() {
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", delStaticGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',pid:'" + treeSelectNode.PID + "'}&op=DelGroup")
        );
}
function delStaticGroupBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#GroupDelSuccess").show();
        refreshTree("parent");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function changeGroupZone() {
    if ($("#GA1_zonetype_QJ").prop("checked")) {
        $("#GA1_aTR").hide();
        $("#GA1_upn").val("");
    } else {
        $("#GA1_aTR").show();
    }
}