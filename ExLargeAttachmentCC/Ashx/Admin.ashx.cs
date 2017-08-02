using Common;
using Entity;
using Manager;
using System;
using System.Collections.Generic;
using System.Data;
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
                        strJsonResult = AddSysAdmin(context);
                        break;
                    case "DeleteSysAdmin":
                       strJsonResult = DeleteSysAdmin(context);
                        break;
                    case "GetAdminCount":
                        strJsonResult = GetAdminCount(context);
                        break;
                    case "GetAdminPager":
                        strJsonResult = GetAdminPager(context);
                        break;
                    case "Login":
                        strJsonResult = Login(context);
                        break;
                }
            }
            while (false);
            return strJsonResult;
        }

        public string AddSysAdmin(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Guid transactionid = Guid.NewGuid();
            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("AddSysAdmin" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                AdminInfo info = JsonHelper.FromJsonTo<AdminInfo>(strJsonPara);
                if (info == null)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("AddSysAdmin" + Convert.ToString(error.Code));
                    break;
                }

                AdminManager manage = new AdminManager();
                manage.AddSysAdmin(transactionid, strAccount, info.UserAccount, info.Password, out strJsonResult);
            } while (false);
            return strJsonResult;
        }

        public string DeleteSysAdmin(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Guid transactionid = Guid.NewGuid();
            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("AddSysAdmin" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                int adminID = Convert.ToInt32(ds.Tables[0].Rows[0]["adminID"]);

                AdminManager manage = new AdminManager();
                manage.DeleteSysAdmin(transactionid, strAccount, adminID, out strJsonResult);
            } while (false);
            return strJsonResult;
        }

        public string GetAdminCount(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Guid transactionid = Guid.NewGuid();
            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("GetAdminCount" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                int pagesize = Convert.ToInt32(ds.Tables[0].Rows[0]["pagesize"]);

                AdminManager manage = new AdminManager();
                manage.GetAdminCount(transactionid, strAccount, pagesize, out strJsonResult);
            } while (false);
            return strJsonResult;
        }

        public string GetAdminPager(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Guid transactionid = Guid.NewGuid();
            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("GetAdminPager" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                int pagesize = Convert.ToInt32(ds.Tables[0].Rows[0]["pagesize"]);

                int curpage = Convert.ToInt32(ds.Tables[0].Rows[0]["curpage"]);

                AdminManager manage = new AdminManager();
                manage.GetAdminPager(transactionid, strAccount, pagesize, curpage, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string Login(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Guid transactionid = Guid.NewGuid();
            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("Login" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["account"]);
                string strPassword = Convert.ToString(ds.Tables[0].Rows[0]["password"]);

                if (string.IsNullOrEmpty(strAccount) || string.IsNullOrEmpty(strPassword))
                {
                    error.Code = ErrorCode.AccountOrPasswordError;
                    strJsonResult = JsonHelper.ReturnstrResult(false, error.Info);
                    Log4netHelper.Info("Login" + Convert.ToString(error.Code));
                    break;
                }

                AdminManager manage = new AdminManager();
                manage.Login(transactionid, strAccount, strPassword, out strJsonResult);


            } while (false);
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