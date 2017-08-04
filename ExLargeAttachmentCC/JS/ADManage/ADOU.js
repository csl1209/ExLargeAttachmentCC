function addOU() {
    initAllPanel();
    $("#opTxt").text("添加OU");
    $("#OUAdd").show();
    initOUInput();
    hideRMenu();
}
function initOUInput() {
    $("#OA_name").val("");
    $("#OA_detail").val("");

    $("#OE_name").val("");
    $("#OE_detail").val("");
}
function addOUClick() {
    if ($.trim($("#OA_name").val()) == "") {
        $("#OP_Error").text("请输入OU的显示名称!");
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addOUClickBack, encodeURI(
        "json={login:'" + getAccount() + "',pid:'" + treeSelectNodeID + "',name:'" + $("#OA_name").val() + "',detail:'" + $("#OA_detail").val() + "'}&op=AddOU")
        );
}
function addOUClickBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#OUAddSuccess").show();
        refreshTree("self");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
var oldOUName = "";
function gotoOUEditPanel() {
    initAllPanel();
    $("#opTxt").text("修改OU");
    $("#OUEdit").show();
    initGroupInput();
    hideRMenu();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoOUEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryOneOU")
        );
}
function gotoOUEditPanelBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OE_name").val(obj.data.name);
        oldOUName = obj.data.name;
        $("#OE_detail").val(obj.data.Description);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function editOU() {
    if ($.trim($("#OE_name").val()) == "") {
        $("#OP_Error").text("请输入OU的显示名称!");
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", editOUBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',name:'" + $("#OE_name").val() + "',detail:'" + $("#OE_detail").val() + "'}&op=ModifyOU")
        );
}
function editOUBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("修改成功!");
        refreshTree("parent");
        treeSelectNodeID = treeSelectNodeID.replace(oldOUName, $("#OE_name").val());
        oldOUName = $("#OE_name").val();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}


function gotoOUMovePanel() {
    initAllPanel();
    $("#opTxt").text("移动OU");
    $("#OUMove").show();
    hideRMenu();
    $("#OM_name").text(treeSelectNode.name);
    $("#OM_text").val("");
    $("#OM_ous").html("");
}
function searchOUMoveToOus() {
    if ($.trim($("#OM_text").val()) == "") {
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchOUMoveToOusBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',txt:'" + $("#OM_text").val() + "'}&op=SearchOuOus")
        );
}
function searchOUMoveToOusBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            html += "<option value='" + obj.data[i].ID + "' >" + obj.data[i].name + "</option>";
        }
        $("#OM_ous").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function moveOuToOu() {
    if (jQuery("#OM_ous  option:selected").length <= 0)
        return;
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", moveOuToOuBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',ou:'" + jQuery("#OM_ous  option:selected")[0].value + "'}&op=MoveOuToOu")
        );
}
function moveOuToOuBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#OUMoveSuccess").show();
        if ($("#returnBT").prop("disabled"))
            refreshTree("root");
        else
            refreshTree("parent");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoOUDelPanel() {
    hideRMenu();
    initAllPanel();
    $("#opTxt").text("删除OU");
    $("#OUDel").show();
}
function delOU() {
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", delOUBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',pid:'" + treeSelectNode.PID + "'}&op=DelOU")
        );
}
function delOUBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#OUDelSuccess").show();
        refreshTree("parent");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}