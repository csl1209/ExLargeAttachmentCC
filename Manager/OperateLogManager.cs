using Common;
using Entity;
using Newtonsoft.Json;
using Provider;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
    public class OperateLogManager
    {
        public bool GetOperateLogCount(Guid transactionid, string strOperatorAccount, int pagesize, out string strJsonResult)
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
                    if (!provider.GetOperateLogCount(transactionid, out totlecount, out error))
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

            strJsonResult = JsonHelper.ReturnstrResult(bResult, error.Info, Dictionary);
            return bResult;
        }

        public bool GetOperateLogPager(Guid transactionid, string strOperatorAccount, int pagesize, int curpage, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            List<LogInfo> infoList = new List<LogInfo>();
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

                    OperateLogDBProvider provider = new OperateLogDBProvider();
                    if (!provider.GetOperateLogPager(transactionid, curpage, pagesize, out infoList, out error))
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
                Log4netHelper.Error("GetOperateLogPager Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrResult(bResult, error.Info, json);
            return bResult;
        }
    }
}
