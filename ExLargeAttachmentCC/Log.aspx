<%@ Page Language="C#" AutoEventWireup="true"  MasterPageFile="~/Head.Master" CodeBehind="Log.aspx.cs" Inherits="ExLargeAttachmentCC.Log" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="JS/common.js"></script>
    <script type="text/javascript" src="JS/Log/Log.js"></script>
    <!--时间输入框控件-->
    <link rel="stylesheet" type="text/css" href="css/jquery/jquery-ui.min.css" />
    <link rel="stylesheet" type="text/css" href="css/jquery/jquery-ui-timepicker-addon.css" />
    <script src="JS/plugins/jquery/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="JS/plugins/jquery/jquery-ui-timepicker-addon.js" type="text/javascript" charset="utf-8"></script>
    <script src="JS/plugins/jquery/jquery-ui-timepicker-zh-CN.js" type="text/javascript" charset="utf-8"></script>
     <script type="text/javascript">
        function getAccount() {
            return $("#<%=loginAccount.ClientID %>").val();
        }
      </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="row page-row1">
        <div class="searchBox">
            <div class="form-group">
                <input id="search_code" type="text" class="form-control" name="search_code" placeholder="日志编号" />
            </div>
            <div class="form-group" style="margin-right: 10px">
                <div class="input-group input-group-minimal">
                    <input id="search_start_createtime" type="text" class="form-control datepicker" name="search_start_createtime" placeholder="开始时间" />
                </div>
            </div>
            <div id="coo-icon" class="form-group" style="width: 10px; text-align: center; margin-right: 0px; margin-left: -10px;margin-top:4px;">
                <span class="coo-icon">~</span>
            </div>
            <div class="form-group">
                <div class="input-group input-group-minimal">
                    <input id="search_end_createtime" type="text" class="form-control datepicker" name="search_end_createtime" placeholder="结束时间" />
                </div>
            </div>
            <div class="form-group">
                <input id="search_account" type="text" class="form-control" name="search_account" placeholder="账号" />
            </div>
            <div class="oprate-butons form-group">
                <button type="reset" class="btn btn-theme" style="margin-left:6px;margin-right:9px;">清除</button>
                <button
                    type="button" class="btn btn-theme" onclick="searchLog();return false;">
                    查询</button>
            </div>
        </div>
        <div class="data-fluid">
            <table class="table dtable lcnp" cellpadding="0" cellspacing="0" width="100%" id="tb_contact">
                <thead>
                    <tr>
                        <th style="width: 165px">日志编号</th>
                        <th style="width: 260px">账号</th>
                        <th style="width: 150px">时间</th>
                        <th style="width: auto">内容</th>
                    </tr>
                </thead>
                <tbody id="tbody_logs">
                </tbody>
            </table>
            <div id="div_logpage" class="pull-right ">
            <ul id="pagination" class="pagination">               
            </ul>
        </div>
        </div>
        <asp:HiddenField runat="server" ID="loginAccount" />
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder2" runat="server">
</asp:Content>
