function addActiveGroup() {
    initAllPanel();
    $("#opTxt").text("添加动态组");
    $("#ActiveGroupAdd1").show();
    initActiveGroupInput();
    hideRMenu();
    $("#AGA1_oubelong").val(treeSelectNode.name);
    AGABelongOuID = treeSelectNodeID;
    $("#AGA1_memberarea").val(treeSelectNode.name);
    AGAmemberOuID = treeSelectNodeID;
}
function setToAddActiveGroupBelongs(ou) {
    var data = eval("((" + ou + "))");
    AGABelongOuID = data.ID;
    $("#AGA1_oubelong").val(data.name);
}
function setToAddActiveGroupMembers(ou) {
    var data = eval("((" + ou + "))");
    AGAmemberOuID = data.ID;
    $("#AGA1_memberarea").val(data.name);
}
function setToEditActiveGroupMembers(ou) {
    var data = eval("((" + ou + "))");
    AGAmemberOuID = data.ID;
    $("#AGE_memberarea").val(data.name);
}
var AGABelongOuID = "";
var AGAmemberOuID = "";
function initActiveGroupInput() {
    $("#AGA1_oubelong_bt").prop("disabled", "");
    $("#AGA1_oubelong").val("");
    $("#AGA1_useou").prop("checked", true);
    $("#AGA1_name").val("");
    $("#AGA1_othername").val("");
    $("#AGA1_memberarea").val("");

    $("#AGA1_type_all").prop("checked", true);
    $("#AGA1_yxyh").prop("checked", false);
    $("#AGA1_wbyh").prop("checked", false);
    $("#AGA1_zyyx").prop("checked", false);
    $("#AGA1_wblxr").prop("checked", false);
    $("#AGA1_txz").prop("checked", false);
    $("#AGA1_yxyh").prop("disabled", "disabled");
    $("#AGA1_wbyh").prop("disabled", "disabled");
    $("#AGA1_zyyx").prop("disabled", "disabled");
    $("#AGA1_wblxr").prop("disabled", "disabled");
    $("#AGA1_txz").prop("disabled", "disabled");

    $("#AGA2_department").prop("checked", false);
    $("#AGA2_corp").prop("checked", false);
    $("#AGA2_custom1").prop("checked", false);
    $("#AGA2_custom2").prop("checked", false);
    $("#AGA2_custom3").prop("checked", false);
    $("#AGA2_department_p").hide();
    $("#AGA2_corp_p").hide();
    $("#AGA2_custom1_a").hide();
    $("#AGA2_custom2_p").hide();
    $("#AGA2_custom3_p").hide();
    $("#AGA2_department_a").text("‘某个’");
    $("#AGA2_department_a").attr("val", "");
    $("#AGA2_corp_a").text("‘某个’");
    $("#AGA2_corp_a").attr("val", "");
    $("#AGA2_custom1_a").text("‘自定义1’");
    $("#AGA2_custom1_a").attr("val", "");
    $("#AGA2_custom2_a").text("‘自定义2’");
    $("#AGA2_custom2_a").attr("val", "");
    $("#AGA2_custom3_a").text("‘自定义3’");
    $("#AGA2_custom3_a").attr("val", "");
}

function changeAGABelongOu() {
    if ($("#AGA1_useou").prop("checked")) {
        $("#AGA1_oubelong_bt").prop("disabled", "");
    } else {
        $("#AGA1_oubelong").val(treeSelectNode.name);
        AGABelongOuID = treeSelectNodeID;
        $("#AGA1_oubelong_bt").prop("disabled", "disabled");
    }
}
function changeAGAType() {
    if ($("#AGA1_type_all").prop("checked")) {
        $("#AGA1_yxyh").prop("checked", false);
        $("#AGA1_wbyh").prop("checked", false);
        $("#AGA1_zyyx").prop("checked", false);
        $("#AGA1_wblxr").prop("checked", false);
        $("#AGA1_txz").prop("checked", false);
        $("#AGA1_yxyh").prop("disabled", "disabled");
        $("#AGA1_wbyh").prop("disabled", "disabled");
        $("#AGA1_zyyx").prop("disabled", "disabled");
        $("#AGA1_wblxr").prop("disabled", "disabled");
        $("#AGA1_txz").prop("disabled", "disabled");
    } else {
        $("#AGA1_yxyh").prop("disabled", "");
        $("#AGA1_wbyh").prop("disabled", "");
        $("#AGA1_zyyx").prop("disabled", "");
        $("#AGA1_wblxr").prop("disabled", "");
        $("#AGA1_txz").prop("disabled", "");
    }
}
function setOpenForAGABelong() {
    openFor = "AGA_B";
}
function setOpenForAGAMember() {
    openFor = "AGA_M";
}
function addActiveGroup_toNext2() {
    if ($.trim($("#AGA1_name").val()) == "") {
        $("#OP_Error").text("请输入动态组的名称!");
        return;
    }
    var AGAType = "";
    if ($("#AGA1_type_all").prop("checked")) {
        AGAType = "AllRecipients";
    }
    else {
        if($("#AGA1_yxyh").prop("checked"))
            AGAType += "MailboxUsers,";
        if ($("#AGA1_wbyh").prop("checked"))
            AGAType += "MailUsers,";
        if ($("#AGA1_zyyx").prop("checked"))
            AGAType += "Resources,";
        if ($("#AGA1_wblxr").prop("checked"))
            AGAType += "MailContacts,";
        if ($("#AGA1_txz").prop("checked"))
            AGAType += "MailGroups,";
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addActiveGroup_toNext2Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + AGABelongOuID + "',name:'" + $("#AGA1_name").val() + "',oname:'" + $("#AGA1_othername").val() +
        "',mid:'" + AGAmemberOuID + "',type:'" + AGAType + "'}&op=AddActiveGroup")
        );
}
function addActiveGroup_toNext2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("添加成功，继续添加筛选条件");
        $("#ActiveGroupAdd1").hide();
        $("#ActiveGroupAdd2").show();
        $("#AGA2_name").text($("#AGA1_name").val());
        saveSuccessId = $("#AGA1_name").val();
        refreshTree("self");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
var AGAOpenFor = "a1";
function changeAGFilter(type, obj) {
    $("#filtertxt").val("");
    $("#ActiveGroupFilterSelect").html("");
    $("#ActiveGroupFilter_Op").text("");
    AGAOpenFor = type;
    if ($("#" + obj.id).attr("val") != "") {
        var temp = $("#" + obj.id).attr("val").split(",");
        for (var i = 0; i < temp.length; i++) {
            $("#ActiveGroupFilterSelect").html($("#ActiveGroupFilterSelect").html() + "<option>" + temp[i] + "</option>");
        }
    }
}
function addToActiveGroupFilterList() {
    if ($.trim($("#filtertxt").val()) == "")
        return;
    for (var i = 0; i < jQuery("#ActiveGroupFilterSelect  option").length; i++) {
        if ($.trim($("#filtertxt").val()) == jQuery("#ActiveGroupFilterSelect  option")[i].text) {
            $("#ActiveGroupFilter_Op").text($.trim($("#filtertxt").val()) + "已经存在!");
            return;
        }
    }
    $("#ActiveGroupFilter_Op").text("");
    $("#ActiveGroupFilterSelect").html($("#ActiveGroupFilterSelect").html() + "<option>" + $.trim($("#filtertxt").val()) + "</option>");
    $("#filtertxt").val("");
}

function setFilterDataBackToPage() {
    if (jQuery("#ActiveGroupFilterSelect  option").length <= 0)
        return;
    var filterText = "";
    var filterVal = "";
    for (var i = 0; i < jQuery("#ActiveGroupFilterSelect  option").length; i++) {
        filterText += "‘" + jQuery("#ActiveGroupFilterSelect  option")[i].text + "’或";
        filterVal += jQuery("#ActiveGroupFilterSelect  option")[i].text + ",";
    }
    filterText = filterText.substr(0, filterText.length - 1);
    filterVal = filterVal.substr(0, filterVal.length - 1);
    if (AGAOpenFor == "a1") {
        $("#AGA2_department_a").text(filterText);
        $("#AGA2_department_a").attr("val", filterVal);
    } else if (AGAOpenFor == "a2") {
        $("#AGA2_corp_a").text(filterText);
        $("#AGA2_corp_a").attr("val", filterVal);
    } else if (AGAOpenFor == "a3_1") {
        $("#AGA2_custom1_a").text(filterText);
        $("#AGA2_custom1_a").attr("val", filterVal);
    } else if (AGAOpenFor == "a3_2") {
        $("#AGA2_custom2_a").text(filterText);
        $("#AGA2_custom2_a").attr("val", filterVal);
    } else if (AGAOpenFor == "a3_3") {
        $("#AGA2_custom3_a").text(filterText);
        $("#AGA2_custom3_a").attr("val", filterVal);
    } else if (AGAOpenFor == "e1") {
        $("#AGE_department_a").text(filterText);
        $("#AGE_department_a").attr("val", filterVal);
    } else if (AGAOpenFor == "e2") {
        $("#AGE_corp_a").text(filterText);
        $("#AGE_corp_a").attr("val", filterVal);
    } else if (AGAOpenFor == "e3_1") {
        $("#AGE_custom1_a").text(filterText);
        $("#AGE_custom1_a").attr("val", filterVal);
    } else if (AGAOpenFor == "e3_2") {
        $("#AGE_custom2_a").text(filterText);
        $("#AGE_custom2_a").attr("val", filterVal);
    } else if (AGAOpenFor == "e3_3") {
        $("#AGE_custom3_a").text(filterText);
        $("#AGE_custom3_a").attr("val", filterVal);
    }

    $("#AGF_close").click();
}
function setAGA2_department() {
    if ($("#AGA2_department").prop("checked")) {
        $("#AGA2_department_p").show();
    } else {
        $("#AGA2_department_p").hide();
    }
}
function setAGA2_corp() {
    if ($("#AGA2_corp").prop("checked")) {
        $("#AGA2_corp_p").show();
    } else {
        $("#AGA2_corp_p").hide();
    }
}
function setAGA2_custom1() {
    if ($("#AGA2_custom1").prop("checked")) {
        $("#AGA2_custom1_p").show();
    } else {
        $("#AGA2_custom1_p").hide();
    }
}
function setAGA2_custom2() {
    if ($("#AGA2_custom2").prop("checked")) {
        $("#AGA2_custom2_p").show();
    } else {
        $("#AGA2_custom2_p").hide();
    }
}
function setAGA2_custom3() {
    if ($("#AGA2_custom3").prop("checked")) {
        $("#AGA2_custom3_p").show();
    } else {
        $("#AGA2_custom3_p").hide();
    }
}
function setAGE_department() {
    if ($("#AGE_department").prop("checked")) {
        $("#AGE_department_p").show();
    } else {
        $("#AGE_department_p").hide();
    }
}
function setAGE_corp() {
    if ($("#AGE_corp").prop("checked")) {
        $("#AGE_corp_p").show();
    } else {
        $("#AGE_corp_p").hide();
    }
}
function setAGE_custom1() {
    if ($("#AGE_custom1").prop("checked")) {
        $("#AGE_custom1_p").show();
    } else {
        $("#AGE_custom1_p").hide();
    }
}
function setAGE_custom2() {
    if ($("#AGE_custom2").prop("checked")) {
        $("#AGE_custom2_p").show();
    } else {
        $("#AGE_custom2_p").hide();
    }
}
function setAGE_custom3() {
    if ($("#AGE_custom3").prop("checked")) {
        $("#AGE_custom3_p").show();
    } else {
        $("#AGE_custom3_p").hide();
    }
}
function addActiveGroup_Finish() {
    var department = "";
    if ($("#AGA2_department").prop("checked")) {
        department = $("#AGA2_department_a").attr("val");
    }
    var corp = "";
    if ($("#AGA2_corp").prop("checked")) {
        corp = $("#AGA2_corp_a").attr("val");
    }
    var custom1 = "";
    if ($("#AGA2_custom1").prop("checked")) {
        custom1 = $("#AGA2_custom1_a").attr("val");
    }
    var custom2 = "";
    if ($("#AGA2_custom2").prop("checked")) {
        custom2 = $("#AGA2_custom2_a").attr("val");
    }
    var custom3 = "";
    if ($("#AGA2_custom3").prop("checked")) {
        custom3 = $("#AGA2_custom3_a").attr("val");
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addActiveGroup_FinishBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + saveSuccessId + "',d:'" + department + "',c:'" + corp + "',c1:'" + custom1 + "',c2:'" + custom2 + "',c3:'" + custom3 + "'}&op=AddActiveGroupFilter")
        );
}
function addActiveGroup_FinishBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#ActiveGroupAddSuccess").show();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function changeAGEType() {
    if ($("#AGE_type_all").prop("checked")) {
        $("#AGE_yxyh").prop("disabled", "disabled");
        $("#AGE_wbyh").prop("disabled", "disabled");
        $("#AGE_zyyx").prop("disabled", "disabled");
        $("#AGE_wblxr").prop("disabled", "disabled");
        $("#AGE_txz").prop("disabled", "disabled");
    }
    else {
        $("#AGE_yxyh").prop("disabled", "");
        $("#AGE_wbyh").prop("disabled", "");
        $("#AGE_zyyx").prop("disabled", "");
        $("#AGE_wblxr").prop("disabled", "");
        $("#AGE_txz").prop("disabled", "");
    }
}
function gotoActiveGroupEditPanel() {
    initAllPanel();
    openFor = "AGE_M";
    $("#opTxt").text("修改动态组");
    $("#ActiveGroupEdit").show();
    hideRMenu();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoActiveGroupEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNode.name + "'}&op=QueryOneActiveGroup")
        );
}
var oldActiveGroupName = "";
var e_c ="";
var e_d ="";
var e_c1 = "";
var e_c2 = "";
var e_c3 = "";
var e_type = "";
function gotoActiveGroupEditPanelBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        oldActiveGroupName = treeSelectNode.name;
        $("#AGE_name").val(treeSelectNode.name);
        AGAmemberOuID = obj.data.ID;
        $("#AGE_member").val(obj.data.Name);

        if (obj.data.IncludedRecipients == "AllRecipients") {
            $("#AGE_type_all").prop("checked", true);
        }
        else {
            $("#AGE_type_other").prop("checked", true);
            if (obj.data.IncludedRecipients.indexOf("MailboxUsers") >= 0)
                $("#AGE_yxyh").prop("checked", true);
            if (obj.data.IncludedRecipients.indexOf("MailUsers") >= 0)
                $("#AGE_wbyh").prop("checked", true);
            if (obj.data.IncludedRecipients.indexOf("Resources") >= 0)
                $("#AGE_zyyx").prop("checked", true);
            if (obj.data.IncludedRecipients.indexOf("MailContacts") >= 0)
                $("#AGE_wblxr").prop("checked", true);
            if (obj.data.IncludedRecipients.indexOf("MailGroups") >= 0)
                $("#AGE_txz").prop("checked", true);
        }
        if ($("#AGE_type_all").prop("checked")) {
            $("#AGE_yxyh").prop("disabled", "disabled");
            $("#AGE_wbyh").prop("disabled", "disabled");
            $("#AGE_zyyx").prop("disabled", "disabled");
            $("#AGE_wblxr").prop("disabled", "disabled");
            $("#AGE_txz").prop("disabled", "disabled");
        } else {
            $("#AGE_yxyh").prop("disabled", "");
            $("#AGE_wbyh").prop("disabled", "");
            $("#AGE_zyyx").prop("disabled", "");
            $("#AGE_wblxr").prop("disabled", "");
            $("#AGE_txz").prop("disabled", "");
        }
        //第二属性
        e_c = obj.data.ConditionalCompany;
        e_d = obj.data.ConditionalDepartment;
        e_c1 = obj.data.ConditionalCustomAttribute1;
        e_c2 = obj.data.ConditionalCustomAttribute2;
        e_c3 = obj.data.ConditionalCustomAttribute3;
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function toChangeActiveGroupEditPanel1() {
    if ($("#AGE_click1").attr("class") != "propClick") {
        $("#AGE_click1").attr("class", "propClick");
        $("#AGE_click2").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#AGE_propprop").show();
    $("#AGE_filterprop").hide();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoActiveGroupEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNode.name + "'}&op=QueryOneActiveGroup")
        );
}
function toChangeActiveGroupEditPanel2() {
    if ($("#AGE_click2").attr("class") != "propClick") {
        $("#AGE_click2").attr("class", "propClick");
        $("#AGE_click1").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#AGE_propprop").hide();
    $("#AGE_filterprop").show();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", toChangeActiveGroupEditPanel2Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNode.name + "'}&op=QueryActiveGroupFilter")
        );
}
function resetFilterWord(text) {
    var temp = text.split(",");
    var newtxt = temp.join("’或‘");
    return newtxt;
}
function toChangeActiveGroupEditPanel2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        e_type = obj.data.IncludedRecipients;
        if (obj.data.ConditionalCompany == "") {
            $("#AGE_corp").prop("checked", false);
            $("#AGE_corp_p").hide();
            $("#AGE_corp_a").text("‘某个’");
            $("#AGE_corp_a").attr("val", "");
        }
        else {
            $("#AGE_corp").prop("checked", true);
            $("#AGE_corp_p").show();
            $("#AGE_corp_a").text("‘" + resetFilterWord(obj.data.ConditionalCompany) + "’");
            $("#AGE_corp_a").attr("val", obj.data.ConditionalCompany);
        }
        if (obj.data.ConditionalDepartment == "") {
            $("#AGE_department").prop("checked", false);
            $("#AGE_department_p").hide();
            $("#AGE_department_a").text("‘某个’");
            $("#AGE_department_a").attr("val", "");
        }
        else {
            $("#AGE_department").prop("checked", true);
            $("#AGE_department_p").show();
            $("#AGE_department_a").text("‘" + resetFilterWord(obj.data.ConditionalDepartment) + "’");
            $("#AGE_department_a").attr("val", obj.data.ConditionalDepartment);
        }
        if (obj.data.ConditionalCustomAttribute1 == "") {
            $("#AGE_custom1").prop("checked", false);
            $("#AGE_custom1_p").hide();
            $("#AGE_custom1_a").text("‘自定义1’");
            $("#AGE_custom1_a").attr("val", "");
        }
        else {
            $("#AGE_custom1").prop("checked", true);
            $("#AGE_custom1_p").show();
            $("#AGE_custom1_a").text("‘" + resetFilterWord(obj.data.ConditionalCustomAttribute1) + "’");
            $("#AGE_custom1_a").attr("val", obj.data.ConditionalCustomAttribute1);
        }
        if (obj.data.ConditionalCustomAttribute2 == "") {
            $("#AGE_custom2").prop("checked", false);
            $("#AGE_custom2_p").hide();
            $("#AGE_custom2_a").text("‘自定义2’");
            $("#AGE_custom2_a").attr("val", "");
        }
        else {
            $("#AGE_custom2").prop("checked", true);
            $("#AGE_custom2_p").show();
            $("#AGE_custom2_a").text("‘" + resetFilterWord(obj.data.ConditionalCustomAttribute2) + "’");
            $("#AGE_custom2_a").attr("val", obj.data.ConditionalCustomAttribute2);
        }
        if (obj.data.ConditionalCustomAttribute3 == "") {
            $("#AGE_custom3").prop("checked", false);
            $("#AGE_custom3_p").hide();
            $("#AGE_custom3_a").text("‘自定义3’");
            $("#AGE_custom3_a").attr("val", "");
        }
        else {
            $("#AGE_custom3").prop("checked", true);
            $("#AGE_custom3_p").show();
            $("#AGE_custom3_a").text("‘" + resetFilterWord(obj.data.ConditionalCustomAttribute3) + "’");
            $("#AGE_custom3_a").attr("val", obj.data.ConditionalCustomAttribute3);
        }
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function editActiveGroup() {
    if ($("#AGE_click1").attr("class") == "propClick") {
        if ($.trim($("#AGE_name").val()) == "") {
            $("#OP_Error").text("请输入动态组名称!");
            return;
        }
        var AGEType = "";
        if ($("#AGE_type_all").prop("checked")) {
            AGEType = "AllRecipients";
        }
        else {
            if ($("#AGE_yxyh").prop("checked"))
                AGEType += "MailboxUsers,";
            if ($("#AGE_wbyh").prop("checked"))
                AGEType += "MailUsers,";
            if ($("#AGE_zyyx").prop("checked"))
                AGEType += "Resources,";
            if ($("#AGE_wblxr").prop("checked"))
                AGEType += "MailContacts,";
            if ($("#AGE_txz").prop("checked"))
                AGEType += "MailGroups,";
        }
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", editActiveGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',oldname:'" + oldActiveGroupName + "',name:'" + $("#AGE_name").val() +
        "',mid:'" + AGAmemberOuID + "',type:'" + AGEType + "',d:'" + e_d + "',c:'" + e_c + "',c1:'" + e_c1 + 
        "',c2:'" + e_c2 + "',c3:'" + e_c3 + "'}&op=ModifyActiveGroup")
        );
    }
    else {
        var department = "";
        if ($("#AGE_department").prop("checked")) {
            department = $("#AGE_department_a").attr("val");
        }
        var corp = "";
        if ($("#AGE_corp").prop("checked")) {
            corp = $("#AGE_corp_a").attr("val");
        }
        var custom1 = "";
        if ($("#AGE_custom1").prop("checked")) {
            custom1 = $("#AGE_custom1_a").attr("val");
        }
        var custom2 = "";
        if ($("#AGE_custom2").prop("checked")) {
            custom2 = $("#AGE_custom2_a").attr("val");
        }
        var custom3 = "";
        if ($("#AGE_custom3").prop("checked")) {
            custom3 = $("#AGE_custom3_a").attr("val");
        }

        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", editActiveGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + oldActiveGroupName + "',name:'" + treeSelectNode.name +
        "',mid:'" + AGAmemberOuID + "',type:'" + e_type + "',d:'" + department + "',c:'" + corp + 
        "',c1:'" + custom1 + "',c2:'" + custom2 + "',c3:'" + custom3 + "'}&op=ModifyActiveGroupFilter")
        );
    }
}
function editActiveGroupBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("修改成功!");
        refreshTree("parent");
        //treeSelectNodeID = treeSelectNodeID.replace(oldActiveGroupName, $("#AGE_name").val());
        //oldActiveGroupName = $("#AGE_name").val();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoActiveGroupDelPanel() {
    hideRMenu();
    initAllPanel();
    $("#opTxt").text("删除动态组");
    $("#ActiveGroupDel").show();
}
function delActiveGroup() {
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", delActiveGroupBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',pid:'" + treeSelectNode.PID + "'}&op=DelActiveGroup")
        );
}
function delActiveGroupBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#ActiveGroupDelSuccess").show();
        refreshTree("parent");
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}