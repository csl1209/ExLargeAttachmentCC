using Common;
using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ExLargeAttachmentCC.Ashx
{
    /// <summary>
    /// Admin 的摘要说明
    /// </summary>
    public class Admin : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(Operate(context));
        }

        private string Operate(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            do
            {
                string strOp = context.Request["op"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strOp))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }
                switch (strOp)
                {

                    case "AddSysAdmin":
                       // strJsonResult = AddSysAdmin(context);
                        break;
                    case "DeleteSysAdmin":
                       // strJsonResult = DeleteSysAdmin(context);
                        break;
                    case "GetAdminCount":
                        //strJsonResult = GetAdminCount(context);
                        break;
                    case "GetAdminPager":
                       // strJsonResult = GetAdminPager(context);
                        break;
                    case "Login":
                        //strJsonResult = Login(context);
                        break;
                }
            }
            while (false);
            return strJsonResult;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}