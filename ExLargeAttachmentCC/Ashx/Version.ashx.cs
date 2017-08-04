using Common;
using Entity;
using Manager;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;

namespace ExLargeAttachmentCC.Ashx
{
    /// <summary>
    /// Version 的摘要说明
    /// </summary>
    public class Version : IHttpHandler
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }
                switch (strOp)
                {

                    case "AddVersion":
                         strJsonResult = AddVersion(context);
                        break;
                    case "EnableVersion":
                        strJsonResult = EnableVersion(context);
                        break;
                    case "DisableVersion":
                        strJsonResult = DisableVersion(context);
                        break;
                    case "DeleteVersion":
                         strJsonResult = DeleteVersion(context);
                        break;
                    case "GetVersionCount":
                        strJsonResult = GetVersionCount(context);
                        break;
                    case "GetVersionPager":
                        strJsonResult = GetVersionPager(context);
                        break;
                    case "CheckVersion":
                        strJsonResult = CheckVersion(context);
                        break;
                }
            }
            while (false);
            return strJsonResult;
        }

        public string AddVersion(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("AddVersion" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                VersionInfo info = JsonHelper.FromJsonTo<VersionInfo>(strJsonPara);
                if (info == null)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("AddVersion" + Convert.ToString(error.Code));
                    break;
                }

                HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
                string versionFile = string.Empty;
                string filePath = string.Empty;
                if (hfc.Count > 0)
                {
                    HttpServerUtility page = System.Web.HttpContext.Current.Server;
                    //原始文件名
                    string filename = System.IO.Path.GetFileName(hfc[0].FileName);

                    //新文件名
                    //string namepre = filename.Substring(0, filename.IndexOf("."));
                    //namepre = namepre.Length > 10 ? namepre.Substring(0, 10) : namepre;
                    versionFile = DateTime.Now.Ticks.ToString() + filename.Substring(filename.IndexOf("."));

                    //服务器端文件路径 例：配置文件 UploadFile_Path \ 组织编号 \ 新文件名
                    filePath = ConfigHelper.ConfigInstance["UploadFile_Path"];

                    string newPath = Path.Combine(filePath, "version");
                    Directory.CreateDirectory(newPath);

                    //新文件路径
                    filePath = newPath + "\\" + versionFile;

                    //保存文件
                    hfc[0].SaveAs(filePath);

                    info.FileName = versionFile;
                    info.FilePath = filePath;

                    VersionManager manage = new VersionManager();
                    manage.AddVersion(transactionid, strAccount, info, out strJsonResult);
                }

            } while (false);
            return strJsonResult;
        }

        public string EnableVersion(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("EnableVersion" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                Guid versionID = Guid.Parse(Convert.ToString(ds.Tables[0].Rows[0]["versionID"]));

                VersionManager manage = new VersionManager();
                manage.EnableVersion(transactionid, strAccount, versionID, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string DisableVersion(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("DisableVersion" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                Guid versionID = Guid.Parse(Convert.ToString(ds.Tables[0].Rows[0]["versionID"]));

                VersionManager manage = new VersionManager();
                manage.DisableVersion(transactionid, strAccount, versionID, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string DeleteVersion(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("DeleteVersion" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                Guid versionID = Guid.Parse(Convert.ToString(ds.Tables[0].Rows[0]["versionID"]));

                VersionManager manage = new VersionManager();
                manage.DeleteVersion(transactionid, strAccount, versionID, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string GetVersionCount(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("GetVersionCount" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                int pagesize = Convert.ToInt32(ds.Tables[0].Rows[0]["pagesize"]);

                VersionManager manage = new VersionManager();
                manage.GetVersionCount(transactionid, strAccount, pagesize, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string GetVersionPager(HttpContext context)
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
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("GetVersionPager" + Convert.ToString(error.Code));
                    break;
                }

                string strAccount = Convert.ToString(ds.Tables[0].Rows[0]["login"]);
                if (string.IsNullOrEmpty(strAccount.Trim()))
                {
                    error.Code = ErrorCode.AdminIsNotExist;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                int pagesize = Convert.ToInt32(ds.Tables[0].Rows[0]["pagesize"]);

                int curpage = Convert.ToInt32(ds.Tables[0].Rows[0]["curpage"]);

                VersionManager manage = new VersionManager();
                manage.GetVersionPager(transactionid, strAccount, pagesize,curpage, out strJsonResult);


            } while (false);
            return strJsonResult;
        }

        public string CheckVersion(HttpContext context)
        {
            string strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();

            do
            {
                string strJsonPara = context.Request["json"];
                //判断json参数是否为空
                if (string.IsNullOrEmpty(strJsonPara))
                {
                    error.Code = ErrorCode.JsonRequestEmpty;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    break;
                }

                DataSet ds = JsonHelper.ConvertToDataSetFromJson(strJsonPara);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    error.Code = ErrorCode.JsonRequestIllegal;
                    strJsonResult = JsonHelper.ReturnstrJson(false, error.Info);
                    Log4netHelper.Info("CheckVersion" + Convert.ToString(error.Code));
                    break;
                }

                string curVersion = Convert.ToString(ds.Tables[0].Rows[0]["curVersion"]);
                VersionManager manage = new VersionManager();
                manage.CheckVersion(curVersion, out strJsonResult);


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