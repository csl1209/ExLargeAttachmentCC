using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Entity;

namespace ExLargeAttachmentCC
{
    public partial class Head : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ChangeTab();
            AdminInfo userinfo = Session["UserInfo"] as AdminInfo;
            if (userinfo != null)
            {
                loginTxt.InnerText = userinfo.UserAccount;
                username.InnerText = userinfo.UserAccount;
            }
        }

        private void ChangeTab()
        {
            if (Session["tab"] != null)
            {
                string val = Session["tab"].ToString();
                switch (val)
                {
                    case "tab1":
                        tab1.Attributes["class"] = "Head_Menu_Click";
                        break;
                    case "tab2":
                        tab2.Attributes["class"] = "Head_Menu_Click";
                        //reportMenu.Style["display"] = "";
                        tab1.Style["background-image"] = "none";
                      break;
                    case "tab4":
                        tab4.Attributes["class"] = "Head_Menu_Click";
                        tab2.Style["background-image"] = "none";
                         break;
                }
            }
        }

        protected void GoToTab_Click(object sender, EventArgs e)
        {
            Session["tab"] = tabNow.Value;
             switch (tabNow.Value)
            {
                case "tab1":
                    Response.Redirect("ExLAManager.aspx");
                    break;
                case "tab2":
                    Response.Redirect("Admin.aspx");
                    break;
                case "tab4":
                    Response.Redirect("Log.aspx");
                    break;
                default:
                    break;
            }
        }
      
        protected void LogoutSystem_Click(object sender, EventArgs e)
        {
            Session["UserInfo"] = null;
            Session["tab"] = null;
            Response.Write("<script>window.location.href='Login.aspx'</script>");
        }
    }
}