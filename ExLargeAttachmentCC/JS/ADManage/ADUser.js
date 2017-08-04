var UA3Table=null;
var UETable = null;
function showUA3_Table() {
    if (UA3Table == null) {
        var UA3_cols = [
                    { title: '名称', name: 'name', width: 120, align: 'left' },
                    { title: '类型', name: 'Type', width: 120, align: 'left' },
                    { title: '操作', name: '', width: 50, align: 'center', lockWidth: true, renderer: function (val) {
                        return "<img src='../imgs/del.png' class='btnDel' title='删除' style='cursor:pointer'/>"
                    }
                    }
                ];
        UA3Table = $('#UA3_grouptable').mmGrid({
            cols: UA3_cols,
            width: "370px",
            height: "320px",
            nowrap: true,
            fullWidthRows: true,
            showBackboard: false
        });
        UA3Table.on('cellSelected', function (e, item, rowIndex, colIndex) {
            if ($(e.target).is('.btnDel')) {
                e.stopPropagation();
                UA3Table.removeRow(rowIndex);
            }
        });
    }
}

function showUE_Table() {
    if (UETable == null) {
        var UE_cols = [
                    { title: '名称', name: 'name', width: 120, align: 'left' },
                    { title: '类型', name: 'Type', width: 120, align: 'left' },
                    { title: '操作', name: '', width: 50, align: 'center', lockWidth: true, renderer: function (val) {
                        return "<img src='../imgs/del.png' class='btnDel' title='删除' style='cursor:pointer'/>"
                    }
                    }
                ];
        UETable = $('#UE_grouptable').mmGrid({
            cols: UE_cols,
            width: "370px",
            height: "320px",
            nowrap: true,
            fullWidthRows: true,
            showBackboard: false
        });
        UETable.on('cellSelected', function (e, item, rowIndex, colIndex) {
            if ($(e.target).is('.btnDel')) {
                e.stopPropagation();
                UETable.removeRow(rowIndex);
            }
        });
    }
}
function initUserInput() {
    $("#UA1_sn").val("");
    $("#UA1_givenname").val("");
    $("#UA1_upn").val("");
    $("#UA1_displayname").val("");
    $("#UA1_psd").val("");
    $("#UA1_psd_text").val("");
    $("#UA1_repsd").val("");
    $("#UA1_repsd_text").val("");
    $("#UA1_showpsd_cb").prop("checked", false);
    $("#UA1_nextchangepsd_cb").prop("checked", true);
    $("#UA1_createMail_cb").prop("checked", true);
    $("#UA2_phone").val("");
    $("#UA2_office").val("");
    $("#UA2_detail").val("");
    $("#UA2_mobile").val("");
    $("#UA2_fax").val("");
    $("#UA2_corp").val("");
    $("#UA2_department").val("");
    $("#UA2_job").val("");
}
function ayncPsd(type) {
    if (type == 1)
        $("#UA1_psd_text").val($("#UA1_psd").val());
    else if (type == 2)
        $("#UA1_psd").val($("#UA1_psd_text").val());
}
function ayncRePsd(type) {
    if (type == 1)
        $("#UA1_repsd_text").val($("#UA1_repsd").val());
    else if (type == 2)
        $("#UA1_repsd").val($("#UA1_repsd_text").val());
}
function showPsd() {
    if ($("#UA1_showpsd_cb").prop("checked")) {
        $("#UA1_psd").hide();
        $("#UA1_repsd").hide();
        $("#UA1_psd_text").show();
        $("#UA1_repsd_text").show();
    } else {
        $("#UA1_psd").show();
        $("#UA1_repsd").show();
        $("#UA1_psd_text").hide();
        $("#UA1_repsd_text").hide();
    }
}
function addUser() {
    initAllPanel();
    $("#opTxt").text("添加用户");
    $("#UserAdd1").show();
    initUserInput();
    hideRMenu();
}
function addUserToNext2() {
    if ($.trim($("#UA1_sn").val()) == "") {
        $("#OP_Error").text("请输入姓!");
        return;
    } else if ($.trim($("#UA1_givenname").val()) == "") {
        $("#OP_Error").text("请输入名!");
        return;
    } else if ($.trim($("#UA1_upn").val()) == "") {
        $("#OP_Error").text("请输入用户!");
        return;
    } else if (/[\u4E00-\u9FA5]/i.test($("#UA1_upn").val())) {
        $("#OP_Error").text("用户不能输入中文!");
        return;
    } else if ($.trim($("#UA1_displayname").val()) == "") {
        $("#OP_Error").text("请输入显示名称!");
        return;
    } else if ($.trim($("#UA1_psd").val()) == "") {
        $("#OP_Error")("请输入密码!");
        return;
    } else if ($.trim($("#UA1_repsd").val()) == "") {
        $("#OP_Error").text("请再次输入密码!");
        return;
    }
    else if ($("#UA1_psd").val() != $("#UA1_repsd").val()) {
        $("#OP_Error").text("两次输入的密码不一致!");
        return;
    }
    var c_p = "0";
    if ($("#UA1_nextchangepsd_cb").prop("checked"))
        c_p = "1";
    var c_m = "0";
    if ($("#UA1_createMail_cb").prop("checked"))
        c_m = "1";
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addUserToNext2Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',sn:'" + $("#UA1_sn").val() + "',gn:'" + $("#UA1_givenname").val() +
        "',account:'" + $("#UA1_upn").val() + "',dn:'" + $("#UA1_displayname").val() + "',psd:'" + $("#UA1_psd").val() +
        "',c_psd:'" + c_p + "',c_mail:'" + c_m + "'}&op=AddUser")
        );
}
function addUserToNext2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("添加成功，继续添加属性");
        $("#UserAdd1").hide();
        $("#UserAdd2").show();
        $("#UA2_account").text($("#UA1_upn").val());
        var ou = treeSelectNodeID.substring(0, treeSelectNodeID.indexOf('DC=')-1);
        $("#UA2_ou").text(ou);


        saveSuccessId = obj.data.ID;
        if ($("#treeTab1").css("backgroundColor") == "white") {
            refreshTree("self");
        } else if ($("#treeTab2").css("backgroundColor") == "white") {
            sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getRoot2Back, encodeURI("json={login:'" + getAccount() + "',path:'0'}&op=QueryPublicTree"));
        }
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function addUserToNext3() {
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addUserToNext3Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + saveSuccessId + "',tel:'" + $("#UA2_phone").val() + "',office:'" + $("#UA2_office").val() +
        "',detail:'" + $("#UA2_detail").val() + "',mobile:'" + $("#UA2_mobile").val() + "',fax:'" + $("#UA2_fax").val() +
        "',comp:'" + $("#UA2_corp").val() + "',depart:'" + $("#UA2_department").val() + "',job:'" + $("#UA2_job").val() + "'}&op=AddUserOtherProp")
        );
}
function addUserToNext3Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("添加成功，继续添加组");
        $("#UserAdd2").hide();
        $("#UserAdd3").show();
        openFor = "U";
        $("#UA3_account").text($("#UA2_account").text());
        var ou = treeSelectNodeID.substring(0, treeSelectNodeID.indexOf('DC=') - 1);
        $("#UA3_ou").text(ou);
        showUA3_Table();
        UA3Table.load([]);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function setToAddUserBelongs(mes) {
    var data = eval("((" + mes + "))");
    if (treeSelectNodeID.indexOf("OU") == 0)
        checkAndAddTableRow(UA3Table, data);
    else if (treeSelectNodeID.indexOf("CN") == 0)
        checkAndAddTableRow(UETable, data);
}
function addUserFinished() {
    showLoading();
    var ms = "";
    if (typeof (UA3Table.rows()[0]) != "undefined") {
        for (var i = 0; i < UA3Table.rows().length; i++) {
            ms += UA3Table.rows()[i].ID + ";";
        }
    }
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", addUserFinishedBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + saveSuccessId + "',belong:'" + ms + "'}&op=AddUserBelongs")
        );
}
function addUserFinishedBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#UserAddSuccess").show();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

var oldUserName = "";
function gotoUserEditPanel() {
    initAllPanel();
    openFor = "U";
    $("#opTxt").text("修改用户");
    $("#UserEdit").show();
    $("#UE_account1").text(editAccountName);
    $("#UE_account2").text(editAccountName);
    $("#UE_account3").text(editAccountName);
    $("#UE_account4").text(editAccountName);
    var ou = treeSelectNodeID.substring(treeSelectNodeID.indexOf(',') + 1, treeSelectNodeID.indexOf('DC=') - 1);
    $("#UE_ou1").text(ou);
    $("#UE_ou2").text(ou);
    $("#UE_ou3").text(ou);
    $("#UE_ou4").text(ou);
    hideRMenu();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoUserEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryOneUser")
        );
}
function gotoUserEditPanelBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#UE_sn").val(obj.data.Sn);
        $("#UE_givenname").val(obj.data.GivenName);
        $("#UE_displayname").val(obj.data.DisplayName);
        oldUserName = obj.data.DisplayName;
        $("#UE_phone").val(obj.data.TelephoneNumber);
        $("#UE_office").val(obj.data.PhysicalDeliveryOfficeName);
        $("#UE_detail").val(obj.data.Description);
        $("#UE_mobile").val(obj.data.Mobile);
        $("#UE_fax").val(obj.data.FacsimileTelephoneNumber);
        $("#UE_corp").val(obj.data.Company);
        $("#UE_department").val(obj.data.Department);
        $("#UE_job").val(obj.data.Title);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function toChangeUserEditPanel1() {
    if ($("#UE_click1").attr("class") != "propClick") {
        $("#UE_click1").attr("class", "propClick");
        $("#UE_click2").attr("class", "propNoClick");
        $("#UE_click3").attr("class", "propNoClick");
        $("#UE_click4").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#UE_accountprop").show();
    $("#UE_groupprop").hide();
    $("#UE_statusprop").hide();
    $("#UE_mailprop").hide();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", gotoUserEditPanelBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryOneUser")
        );
}
function toChangeUserEditPanel2() {
    if ($("#UE_click2").attr("class") != "propClick") {
        $("#UE_click1").attr("class", "propNoClick");
        $("#UE_click2").attr("class", "propClick");
        $("#UE_click3").attr("class", "propNoClick");
        $("#UE_click4").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#UE_accountprop").hide();
    $("#UE_groupprop").show();
    $("#UE_statusprop").hide();
    $("#UE_mailprop").hide();
    showUE_Table();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", toChangeUserEditPanel2Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryUserBelongs")
        );
}
function toChangeUserEditPanel3() {
    if ($("#UE_click3").attr("class") != "propClick") {
        $("#UE_click1").attr("class", "propNoClick");
        $("#UE_click2").attr("class", "propNoClick");
        $("#UE_click3").attr("class", "propClick");
        $("#UE_click4").attr("class", "propNoClick");
    }
    else {
        return;
    }
    $("#UE_accountprop").hide();
    $("#UE_groupprop").hide();
    $("#UE_statusprop").show();
    $("#UE_mailprop").hide();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", toChangeUserEditPanel3Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryUserStatus")
        );
}
function toChangeUserEditPanel4() {
    if ($("#UE_click4").attr("class") != "propClick") {
        $("#UE_click1").attr("class", "propNoClick");
        $("#UE_click2").attr("class", "propNoClick");
        $("#UE_click3").attr("class", "propNoClick");
        $("#UE_click4").attr("class", "propClick");
    }
    else {
        return;
    }
    $("#UE_accountprop").hide();
    $("#UE_groupprop").hide();
    $("#UE_statusprop").hide();
    $("#UE_mailprop").show();
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", toChangeUserEditPanel4Back, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "'}&op=QueryUserExchange")
        );
}
function toChangeUserEditPanel2Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        UETable.load(obj.data);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function setUserEnableOrNot() {
    if ($("#UE_statusopen").prop("checked")) {
        $("#UE_newpsd").prop("disabled", "");
        $("#UE_repsd").prop("disabled", "");
        $("#UE_nextchangepsd").prop("disabled", "");
        $("#UE_unlock").prop("disabled", "");
        $("#UE_psdpast").prop("disabled", "");
        $("#UE_psdpast").prop("disabled", "");
    }
    else {
        $("#UE_newpsd").prop("disabled", "disabled");
        $("#UE_repsd").prop("disabled", "disabled");
        $("#UE_nextchangepsd").prop("disabled", "disabled");
        $("#UE_unlock").prop("disabled", "disabled");
        $("#UE_psdpast").prop("disabled", "disabled");
        $("#UE_psdpast").prop("disabled", "disabled");
    }
}
function toChangeUserEditPanel3Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        if (obj.data.IsEnable == "True") {
            $("#UE_statusopen").prop("checked", true);
        }
        else {
            $("#UE_statusclose").prop("checked", true);
        }
        setUserEnableOrNot();
        if (obj.data.IsChangePwdNext == "True") {
            $("#UE_nextchangepsd").prop("checked", true);
        }
        else {
            $("#UE_nextchangepsd").prop("checked", false);
        }
        if (obj.data.IsPasswordNerverExpire == "True") {
            $("#UE_psdnever").prop("checked", true);
        }
        else {
            $("#UE_psdafter").prop("checked", true);
        }
        $("#UE_pasttime").text(obj.data.PasswordExpireTime);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function setUEMailBox() {
    if ($("#UE_defaultMB").prop("checked")) {
        $("#UE_maildb").val("");
        $("#UE_maildb").prop("disabled", "disabled");
    } else {
        $("#UE_maildb").prop("disabled", "");
    }
}
function setUserExchangeEnableOrNot() {
    if ($("#UE_mailstatus_on").prop("checked")) {
        $("#UE_ActiveSync_on").prop("checked", true);
        $("#UE_MAPI_on").prop("checked", true);
        $("#UE_POP3_on").prop("checked", true);
        $("#UE_IMAP4_on").prop("checked", true);
        $("#UE_OWA_on").prop("checked", true);
    }
    else {
        $("#UE_ActiveSync_off").prop("checked", true);
        $("#UE_MAPI_off").prop("checked", true);
        $("#UE_POP3_off").prop("checked", true);
        $("#UE_IMAP4_off").prop("checked", true);
        $("#UE_OWA_off").prop("checked", true);
    }
    checkExchangeStatus();
}
function checkExchangeStatus() {
    if ($("#UE_mailstatus_on").prop("checked")) {
        $("#UE_ActiveSync_on").prop("disabled", "");
        $("#UE_ActiveSync_off").prop("disabled", "");
        $("#UE_MAPI_on").prop("disabled", "");
        $("#UE_MAPI_off").prop("disabled", "");
        $("#UE_POP3_on").prop("disabled", "");
        $("#UE_POP3_off").prop("disabled", "");
        $("#UE_IMAP4_on").prop("disabled", "");
        $("#UE_IMAP4_off").prop("disabled", "");
        $("#UE_OWA_on").prop("disabled", "");
        $("#UE_OWA_off").prop("disabled", "");
        $("#UE_defaultMB").prop("disabled", "");
        if ($.trim($("#UE_maildb").val()) != "") {
            $("#UE_defaultMB").prop("checked", false);
            $("#UE_maildb").prop("disabled", "");
        }
        else {
            $("#UE_defaultMB").prop("checked", true);
            $("#UE_maildb").prop("disabled", "disabled");
        }
    }
    else {
        $("#UE_ActiveSync_on").prop("disabled", "disabled");
        $("#UE_ActiveSync_off").prop("disabled", "disabled");
        $("#UE_MAPI_on").prop("disabled", "disabled");
        $("#UE_MAPI_off").prop("disabled", "disabled");
        $("#UE_POP3_on").prop("disabled", "disabled");
        $("#UE_POP3_off").prop("disabled", "disabled");
        $("#UE_IMAP4_on").prop("disabled", "disabled");
        $("#UE_IMAP4_off").prop("disabled", "disabled");
        $("#UE_OWA_on").prop("disabled", "disabled");
        $("#UE_OWA_off").prop("disabled", "disabled");
        $("#UE_defaultMB").prop("disabled", "disabled");
        $("#UE_maildb").prop("disabled", "disabled");
    }
    if (getAccountType() != 0) {
        $("#UE_defaultMB").prop("disabled", "disabled");
        $("#UE_maildb").prop("disabled", "disabled");
    }
}
function toChangeUserEditPanel4Back(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        if (obj.data.bexEnable != "True") {
            $("#UE_mailstatus_off").prop("checked", true);
        }
        else {
            $("#UE_mailstatus_on").prop("checked", true);
        }
        if (obj.data.bexEnable == "True") {
            if (obj.data.bEnableActivesync == "True") {
                $("#UE_ActiveSync_on").prop("checked", true);
            }
            else {
                $("#UE_ActiveSync_off").prop("checked", true);
            }
            if (obj.data.bEnableMapi == "True") {
                $("#UE_MAPI_on").prop("checked", true);
            }
            else {
                $("#UE_MAPI_off").prop("checked", true);
            }
            if (obj.data.bEnablePOP3 == "True") {
                $("#UE_POP3_on").prop("checked", true);
            }
            else {
                $("#UE_POP3_off").prop("checked", true);
            }
            if (obj.data.bEnableImap4 == "True") {
                $("#UE_IMAP4_on").prop("checked", true);
            }
            else {
                $("#UE_IMAP4_off").prop("checked", true);
            }
            if (obj.data.bEnableOWA == "True") {
                $("#UE_OWA_on").prop("checked", true);
            }
            else {
                $("#UE_OWA_off").prop("checked", true);
            }
            if (obj.data.iMailSize == "-1") {
                $("#UE_defaultMB").prop("checked", true);
                $("#UE_maildb").prop("disabled", "disabled");
            }
            else {
                $("#UE_defaultMB").prop("checked", false);
                $("#UE_maildb").val(obj.data.iMailSize);
            }
        }
        checkExchangeStatus();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function saveUserEdit() {
    if ($("#UE_click1").attr("class") == "propClick") {
        if ($.trim($("#UE_sn").val()) == "") {
            $("#OP_Error").text("请输入姓!");
            return;
        } else if ($.trim($("#UE_givenname").val()) == "") {
            $("#OP_Error").text("请输入名!");
            return;
        } else if ($.trim($("#UE_displayname").val()) == "") {
            $("#OP_Error").text("请输入显示名称!");
            return;
        }
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", saveUserEditBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',sn:'" + $("#UE_sn").val() + "',gn:'" + $("#UE_givenname").val() +
        "',dn:'" + $("#UE_displayname").val() + "',tel:'" + $("#UE_phone").val() + "',office:'" + $("#UE_office").val() +
        "',detail:'" + $("#UE_detail").val() + "',mobile:'" + $("#UE_mobile").val() + "',fax:'" + $("#UE_fax").val() +
        "',comp:'" + $("#UE_corp").val() + "',depart:'" + $("#UE_department").val() + "',job:'" + $("#UE_job").val() + "'}&op=ModifyUserProp")
        );
    }
    else if ($("#UE_click2").attr("class") == "propClick") {
        var ms = "";
        if (typeof (UETable.rows()[0]) != "undefined") {
            for (var i = 0; i < UETable.rows().length; i++) {
                ms += UETable.rows()[i].ID + ";";
            }
        }
        showLoading();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", saveUserEditBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',belong:'" + ms + "'}&op=AddUserBelongs")
        );
    }
    else if ($("#UE_click3").attr("class") == "propClick") {
        if ($.trim($("#UE_newpsd").val()) != "" && $("#UE_newpsd").val() != $("#UE_repsd").val()) {
            $("#OP_Error").text("两次密码输入不相同!");
            return;
        }
        showLoading();
        var us = $("#UE_statusopen").prop("checked") ? "1" : "0";
        var pn = $("#UE_nextchangepsd").prop("checked") ? "1" : "0";
        var pass = $("#UE_psdnever").prop("checked") ? "1" : "0";
        var lock = $("#UE_unlock").prop("checked") ? "1" : "0";
        var psd = $("#UE_newpsd").val();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", saveUserEditBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',an:'" + editAccountName + "',us:'" + us + "',pn:'" + pn + "',pass:'" + pass + "',lock:'" + lock + "',psd:'" + psd + "'}&op=ModifyUserOtherProp")
        );
    }
    else if ($("#UE_click4").attr("class") == "propClick") {
        if (!validate("UE_maildb")) {
            $("#OP_Error").text("请输入数字!");
            return;
        }
        showLoading();
        var ms = $("#UE_mailstatus_on").prop("checked") ? "1" : "0";
        var as = $("#UE_ActiveSync_on").prop("checked") ? "1" : "0";
        var mapi = $("#UE_MAPI_on").prop("checked") ? "1" : "0";
        var pop3 = $("#UE_POP3_on").prop("checked") ? "1" : "0";
        var imap4 = $("#UE_IMAP4_on").prop("checked") ? "1" : "0";
        var owa = $("#UE_OWA_on").prop("checked") ? "1" : "0";
        var db = $("#UE_defaultMB").prop("checked") ? "-1" : $("#UE_maildb").val();
        sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", saveUserEditBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',ms:'" + ms + "',as:'" + as + "',mapi:'" + mapi +
        "',pop3:'" + pop3 + "',imap4:'" + imap4 + "',owa:'" + owa + "',db:'" + db + "'}&op=ModifyUserExchange")
        );
    }
}
function validate(id) {
    var reg = new RegExp("^[0-9]*$");
    var obj = $("#" + id)[0];
    if (!reg.test(obj.value)) {
        return false;
    }
    return true;
}
function saveUserEditBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        $("#OP_Error").text("修改成功!");
        if ($("#treeTab1").css("backgroundColor") == "white" || $("#treeTab1").css("backgroundColor") == "rgb(255, 255, 255)") {
            refreshTree("parent");
        } else if ($("#treeTab2").css("backgroundColor") == "white" || $("#treeTab2").css("backgroundColor") == "rgb(255, 255, 255)") {
            if ($("#returnBT2").prop("disabled"))
                zTree2.reAsyncChildNodes(treeSelectNode.getParentNode(), "refresh");
            else
                sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchPublicTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt2").val() + "'}&op=SearchPublicTree"));
        }
        treeSelectNodeID = treeSelectNodeID.replace(oldUserName, $("#UE_displayname").val());
        oldUserName = $("#UE_displayname").val();
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoUserMovePanel() {
    initAllPanel();
    $("#opTxt").text("移动用户");
    $("#UserMove").show();
    hideRMenu();
    $("#UM_text").val("");
    $("#UM_ous").html("");
    $("#UM_account").text(treeSelectNode.name);
    if ($.trim($("#UM_ou").val()) == "") {
        var ou = treeSelectNode.ID.substring(treeSelectNode.ID.indexOf(',') + 1, treeSelectNode.ID.indexOf('DC=') - 1);
        $("#UM_ou").text(ou);
    }
}
function searchMoveOus() {
    if ($.trim($("#UM_text").val()) == "") {
        return;
    }
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", searchMoveOusBack, encodeURI(
        "json={login:'" + getAccount() + "',txt:'" + $("#UM_text").val() + "'}&op=SearchUserOus")
        );
}
function searchMoveOusBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        var html = "";
        for (var i = 0; i < obj.data.length; i++) {
            
            html += "<option value='" + obj.data[i].ID + "' >" + obj.data[i].name + "</option>";
        }
        $("#UM_ous").html(html);
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}
function moveUserToOU() {
    if (jQuery("#UM_ous  option:selected").length <= 0)
        return;
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", moveUserToOUBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',ou:'" + jQuery("#UM_ous  option:selected")[0].value + "'}&op=MoveUserToOu")
        );
}
function moveUserToOUBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#UserMoveSuccess").show();
        if ($("#treeTab1").css("backgroundColor") == "white" || $("#treeTab1").css("backgroundColor") == "rgb(255, 255, 255)") {
            if ($("#returnBT").prop("disabled"))
                refreshTree("root");
            else
                refreshTree("parent");
        } else if ($("#treeTab2").css("backgroundColor") == "white" || $("#treeTab2").css("backgroundColor") == "rgb(255, 255, 255)") {
            if ($("#returnBT2").prop("disabled"))
                zTree2.reAsyncChildNodes(treeSelectNode.getParentNode(), "refresh");
            else
                sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchPublicTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt2").val() + "'}&op=SearchPublicTree"));
        }
     //   treeSelectNodeID = treeSelectNodeID.replace(oldUserName, $("#UE_displayname").val());
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}

function gotoUserDelPanel() {
    hideRMenu();
    initAllPanel();
    //    $("#opTxt").text("删除用户");
    $("#opTxt").text("禁用并移动至离职人员组");
    $("#UserDel").show();
}
function delUser() {
    showLoading();
    sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", delUserBack, encodeURI(
        "json={login:'" + getAccount() + "',id:'" + treeSelectNodeID + "',pid:'" + treeSelectNode.PID + "'}&op=DelUser")
        );
}
function delUserBack(data) {
    hideLoading();
    var obj = eval("((" + data + "))");
    if (obj.result == "true") {
        initAllPanel();
        $("#UserDelSuccess").show();
        if ($("#treeTab1").css("backgroundColor") == "white" || $("#treeTab1").css("backgroundColor") == "rgb(255, 255, 255)") {
            refreshTree("parent");
        } else if ($("#treeTab2").css("backgroundColor") == "white" || $("#treeTab2").css("backgroundColor") == "rgb(255, 255, 255)") {
            if ($("#returnBT2").prop("disabled"))
                zTree2.reAsyncChildNodes(treeSelectNode.getParentNode(), "refresh");
            else {
                showLoading();
                sendAjaxRequest("../ashx/ADManage_ashx/AdManage.ashx", getSearchPublicTreeBack, encodeURI("json={login:'" + getAccount() + "',txt:'" + $("#treeTxt2").val() + "'}&op=SearchPublicTree"));
            }
        }
    } else {
        $("#OP_Error").text(obj.errMsg);
    }
}