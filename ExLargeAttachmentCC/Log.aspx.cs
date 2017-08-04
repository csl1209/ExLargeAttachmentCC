using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ExLargeAttachmentCC
{
    public partial class Log : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            AdminInfo userinfo = Session["UserInfo"] as AdminInfo;
            if (userinfo == null)
            {
                Response.Redirect("Login.aspx");
            }
            loginAccount.Value = userinfo.UserAccount;
        }
    }
}