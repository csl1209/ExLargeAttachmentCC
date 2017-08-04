using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity;
using Provider;
using Common;
using Newtonsoft.Json;

namespace Manager
{
    public class VersionManager
    {
        public bool AddVersion(Guid transactionid, string strOperatorAccount, VersionInfo info, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();

            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount)
                        || string.IsNullOrEmpty(info.VersionNum))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.AddVersion(transactionid, ref info, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("AddVersion Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool EnableVersion(Guid transactionid, string strOperatorAccount, Guid versionID, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();

            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.EnableVersion(transactionid, versionID, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("EnableVersion Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool DisableVersion(Guid transactionid, string strOperatorAccount, Guid versionID, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();

            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.DisableVersion(transactionid, versionID, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("DisableVersion Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool DeleteVersion(Guid transactionid, string strOperatorAccount, Guid versionID, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();

            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.DeleteVersion(transactionid, versionID, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("DeleteVersion Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool GetVersionCount(Guid transactionid, string strOperatorAccount, int pagesize, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            Dictionary<string, object> Dictionary = new Dictionary<string, object>();

            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount)
                        || string.IsNullOrEmpty(pagesize.ToString()))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    int totlecount = 0;
                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.GetVesionCount(transactionid, out totlecount, out error))
                    {
                        bResult = false;
                        break;
                    }

                    int pagecount = 0;
                    if (totlecount > 0)
                    {
                        pagecount = totlecount / pagesize;
                        if (totlecount % pagesize != 0)
                        {
                            pagecount += 1;
                        }
                    }

                    Dictionary = new Dictionary<string, object>();
                    Dictionary.Add("pagecount", pagecount);

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("GetVersionCount Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, Dictionary);
            return bResult;
        }

        public bool GetVersionPager(Guid transactionid, string strOperatorAccount, int pagesize, int curpage, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            List<VersionInfo> infoList = new List<VersionInfo>();
            string json = string.Empty;
            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strOperatorAccount)
                        || string.IsNullOrEmpty(pagesize.ToString()))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.GetVersionPager(transactionid, curpage, pagesize, out infoList, out error))
                    {
                        bResult = false;
                        break;
                    }

                    json = JsonConvert.SerializeObject(infoList);

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("GetAdminPager Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, json);
            return bResult;
        }

        public bool DownloadVersion()
        {
            return true;
        }

        public bool CheckVersion(string strCurrentVersion, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            string json = string.Empty;
            try
            {
                do
                {
                    //参数验证
                    if (string.IsNullOrEmpty(strCurrentVersion))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    VersionInfo Info = new VersionInfo();
                    VersionDBProvider provider = new VersionDBProvider();
                    if (!provider.CheckCurrentVersion(out Info, out error))
                    {
                        bResult = false;
                        break;
                    }
                    json = JsonConvert.SerializeObject(Info);

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("CheckVersion Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, json);
            return bResult;
        }
    }
}
