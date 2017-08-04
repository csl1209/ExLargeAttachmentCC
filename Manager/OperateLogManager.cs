using Common;
using Entity;
using Newtonsoft.Json;
using Provider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
    public class OperateLogManager
    {
        public bool GetOperateLogCount(Guid transactionid, string strOperatorAccount, string lognum, string account, DateTime starttime, DateTime endtime, int pagesize, out string strJsonResult)
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
                    OperateLogDBProvider provider = new OperateLogDBProvider();
                    if (!provider.GetOperateLogCount(transactionid, lognum, account, starttime, endtime, out totlecount, out error))
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
                Log4netHelper.Error("GetOperateLogCount Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, Dictionary);
            return bResult;
        }

        public bool GetOperateLogPager(Guid transactionid, string strOperatorAccount, string lognum, string account, DateTime starttime, DateTime endtime, int curpage, int pagesize, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            List<LogInfo> infoList = new List<LogInfo>();
            DataSet ds = new DataSet();
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

                    OperateLogDBProvider provider = new OperateLogDBProvider();
                    if (!provider.GetOperateLogPager(transactionid, lognum, account, starttime, endtime, curpage, pagesize, out ds, out error))
                    {
                        bResult = false;
                        break;
                    }
                    
                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("GetOperateLogPager Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, ds);
            return bResult;
        }
    }
}
