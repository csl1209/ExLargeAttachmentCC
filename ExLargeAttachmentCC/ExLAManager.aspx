<%@ Page Language="C#" MasterPageFile="~/Head.Master" AutoEventWireup="true" CodeBehind="ExLAManager.aspx.cs" Inherits="ExLargeAttachmentCC.ExLAManager" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="JS/common.js"></script>
   <%-- <script type="text/javascript" src="../js/Admin/Admin.js"></script>--%>
    <script type="text/javascript">
        function getAccount() {
            return $("#<%=loginAccount.ClientID %>").val();
        }
        function getAccountType() {
            return $("#<%=accountType.ClientID %>").val();
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="row page-row1">
        <span id="savebtnbox" class="pull-right right-oprate-btn" style="margin-bottom: 18px;">
            <a id="saveOrgbtn" class="abtn" href="#" onclick="addAdminInfo()">添加管理员</a>
        </span>
        <div>
            <table class="table dtable lcnp" cellpadding="0" cellspacing="0" id="tb_UpdateOrgInternational">
                <thead>
                    <tr>
                        <th style="width: 260px">账号</th>
                        <th>显示名称</th>
                        <th style="width: 60px;">操作</th>
                    </tr>
                </thead>
                <tbody id="tbody_admin">
<%--                    <tr>
                        <td>csgg@betternext.com</td>
                        <td>张三</td>
                        <td><a onclick="delAdminInfo()">删除</a></td>
                    </tr>
                    <tr>
                        <td>dfds@betternext.com</td>
                        <td>里斯</td>
                        <td><a onclick="delAdminInfo()">删除</a></td>
                    </tr>--%>
                </tbody>
            </table>
        <div id="div_logpage" class="pull-right ">
            <ul id="pagination" class="pagination">                
            </ul>
        </div>
        </div>
        <asp:HiddenField runat="server" ID="loginAccount" />
        <asp:HiddenField runat="server" ID="accountType" />
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ContentPlaceHolder2" runat="server">
    <%--addAdmin--%>
    <div class="modal fade" id="addAdmin_Modal" tabindex="-1" role="dialog" aria-labelledby="addAdminModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="addAdminLabel">添加管理员</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="control-label" style="margin-bottom:12px;">管理员</label><p id="p_admin" style="margin-left: 90px; margin-top: -30px;display:none"></p>
                        <input id="admin" type="text" class="form-control" name="admin" value="" placeholder="搜索用户" style="width: 377px;" />
                    </div>
                    <div class="oprate-butons form-group" style="margin-left: 395px; margin-top: -48px;">
                        <button type="reset" class="btn btn-theme" onclick="getRootTree();return false;" style="margin-right: 9px;">清除</button>
                        <button type="button" class="btn btn-theme" onclick="searchTree();return false;">查询</button>
                    </div>
                    <div class="form-group treeHide">
                        <ul class="ztree scroll_bar" id="tree" style="margin:0;padding:15px 18px;height:356px;overflow-y:auto;"></ul>
                    </div>
                    <input type="hidden" id="setAdminValue" />
                    <div class="submit-info" id="addAdmin-submit-info"></div>
                </div>
                <div id="addAdmin-modal-footer" class="modal-footer">
                    <button id="addAdmin_btn" type="button" class="btn btn-theme" data-loading-text="执行中" onclick="addAdmin();return false;">确定</button>
                    <div class='loadingCSS pull-right blues' style='margin-left: -24px; margin-top: 5px; visibility: hidden;'>
                        <div class='bounce1'></div>
                        <div class='bounce2'></div>
                        <div class='bounce3'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--delAdmin--%>
    <div class="modal fade" id="delAdmin_Modal" tabindex="-1" role="dialog" aria-labelledby="delAdminModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="delAdminLabel">删除管理员</h4>
                </div>
                <div class="modal-body">
                    <table id="delete-warning" class="table table-info">
                        <tr>
                            <td>管理员</td>
                            <td id="del_realname"></td>
                        </tr>
                    </table>
                    <div id="delbox" class="row" style="padding-left: 18px; padding-right: 18px;">
                        <div class="col-md-12" style="background-color: #f8f8f8; padding-top: 18px; padding-left: 18px; padding-right: 18px;">
                            <div>管理员删除后：</div>
                            <div style="margin-top: 8px;">1.无法再使用 BetterUMC 邮件审计及相关服务。</div>
                            <div style="margin-top: 8px;">2.相关数据会被全部删除并且无法恢复。</div>
                            <div style="margin-top: 18px; margin-bottom: 18px;">
                                <div class="checkbox">
                                    <input id="ckdel" class="chk_1" type="checkbox" onclick="checkWay(this)" />
                                    <label for="ckdel" style="margin-top: 3px;"></label>
                                    我明白该操作可能产生的问题，我愿意承担执行该操作后可能产生的一切后果。
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12  col-xs-12" style="padding-left: 0; margin-top: 18px;padding-top:12px;">
                            <div id="delAdmin-submit-info" class="submit-info"></div>
                        </div>
                    </div>
                    <input type="hidden" id="delAdmin" />
                </div>
                <div id="delAdmin-modal-footer" class="modal-footer">
                    <button id="delAdmin_btn" type="button" class="btn btn-theme" data-loading-text="执行中"  onclick="delAdmin();return false;">确定</button>
                    <div class='loadingCSS pull-right blues' style='margin-left: -24px; margin-top: 5px; visibility: hidden;'>
                        <div class='bounce1'></div>
                        <div class='bounce2'></div>
                        <div class='bounce3'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
