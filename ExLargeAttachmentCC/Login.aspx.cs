using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Entity;

namespace ExLargeAttachmentCC
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void LoginIntoSys(object sender, EventArgs e)
        {
            AdminInfo userinfo = new AdminInfo();
            userinfo.UserAccount = loginUser.Value;
            Session["UserInfo"] = userinfo;

            Response.Redirect("ExLAManager.aspx");
        }
    }
}