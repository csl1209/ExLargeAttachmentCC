<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="ExLargeAttachmentCC.Login" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Exchange大附件管理</title>
    <link href="css/style.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="JS/checkCode.js"></script>
    <script type="text/javascript">
        function loginCheck() {
            if ($.trim($("#login_account").val()) == "") {
                $("#loginInfo").html("请输入账号！");
                return;
            } else if ($.trim($("#login_psd").val()) == "") {
                $("#loginInfo").html("请输入密码！");
                return;
            } else if ($.trim($("#d2yzmcode").val()) == "") {
                $("#loginInfo").html("请输入验证码！");
                return;
            } else if ($.trim($("#d2yzmcode").val()).toLowerCase() != $("#code").val().toLowerCase()) {
                $("#loginInfo").html("验证码错误！");
                createCode();
                return;
            }
            $("#btnlogin").button("loading");
            $("#btnlogin").css("background-color", "rgba(255, 255, 255, 0.12)");
            $("#btnlogin").css({"padding-right": "16px" });
            $(".loadingCSS").css("visibility", "visible");
            sendAjaxRequest("ashx/admin.ashx", checkLoginBack, encodeURI("json={name:'" + $.trim($("#login_account").val()) + "',psd:'" + $.trim($("#login_psd").val()) + "'}&op=Login"));

        }
        function checkLoginBack(data) {
            var obj = eval("(" + data + ")");
            if (obj.result == "true") {
                $("#loginUser").val(obj.data[0].useraccount);
                $("#loginBT").click();
            } else {
                createCode();
                $("#loginInfo").html("账号或密码错误！");
                $("#btnlogin").button("reset");
                $("#btnlogin").css("background-color", "rgba(255, 255, 255, 0)");
                $("#btnlogin").css({ "padding-right": "0" });
                $(".loadingCSS").css("visibility", "hidden");
            }
        }

        $(window).keydown(function () {
            if (event.keyCode == "13") {//keyCode=13是回车键
                $("#btnlogin").click();
                return false;
            }
        });
  
        function setCenter() {
            var ps = GetPageSize();
            $("#form1").css("margin-left", (ps[2] - 380) / 2);
        }
        $(document).ready(function () {
            setCenter();
            createCode();
        });


    </script>
</head>
<body onresize="setCenter();" style="background-color:#fff;">
    <form id="form1" runat="server">
        <div class="loginBox" style="text-align:center">
            <div class="userimg">
                <img src="imgs/logo.jpg" alt="" style="margin-left:100px;margin-bottom:66px;display:block" />
            </div>
            <div class="input-group">
                <input type="text" name="login_account" id="login_account" placeholder="账号" autocomplete="off" class="username" />
            </div>
            <div class="input-group">
                <input type="password" name="login_psd" id="login_psd" placeholder="密码" autocomplete="off" class="password" />
            </div>
            <div class="input-group">
                <input type="text" name="d2yzmcode" id="d2yzmcode" class="code" autocomplete="off" placeholder="验证码" />
                <div class="codeImg" id="codeDiv">
                    <input type="button" id="code" onclick="createCode();" style="width:42px;height:72px;line-height:72px;padding:0;" /></div>
            </div>
            <div id="loginInfo" class="submit-error-info">                
            </div>          
            <button type="button" id="btnlogin" class="btn loginBtn" onclick="loginCheck();return false;" data-loading-text="登录中">登  录</button>
            <div class='loadingCSS white' style='margin-left:62px;margin-top:-34px;visibility:hidden;'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>
        </div>
        <asp:Button ID="loginBT" runat="server" OnClick="LoginIntoSys" Style="display: none" />
        <asp:HiddenField ID="loginUser" runat="server" />
    </form>
</body>
</html>
