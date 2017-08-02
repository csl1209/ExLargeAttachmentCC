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
    /// Log 的摘要说明
    /// </summary>
    public class Log : IHttpHandler
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
                    case "GetLogCount":
                        strJsonResult = GetLogCount(context);
                        break;
                    case "GetLogPager":
                        strJsonResult = GetLogPager(context);
                        break;
                }
            }
            while (false);
            return strJsonResult;
        }

        public string GetLogCount(HttpContext context)
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
                    Log4netHelper.Info("GetLogCount" + Convert.ToString(error.Code));
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

                OperateLogManager manage = new OperateLogManager();
                manage.GetOperateLogCount(transactionid, strAccount, pagesize, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string GetLogPager(HttpContext context)
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
                    Log4netHelper.Info("GetLogPager" + Convert.ToString(error.Code));
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

                OperateLogManager manage = new OperateLogManager();
                manage.GetOperateLogPager(transactionid, strAccount, pagesize, curpage, out strJsonResult);


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