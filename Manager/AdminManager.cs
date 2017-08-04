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
    public class AdminManager
    {
        public bool AddSysAdmin(Guid transactionid, string strOperatorAccount, string userAccount, string Password, out string strJsonResult)
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
                        || string.IsNullOrEmpty(userAccount)
                        || string.IsNullOrEmpty(Password))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    AdminInfo info = new AdminInfo();
                    info.UserAccount = userAccount;
                    info.Password = Password;

                    AdminDBProvider provider = new AdminDBProvider();
                    if (!provider.AddAdmin(transactionid, ref info, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("AddSysAdmin Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool DeleteSysAdmin(Guid transactionid, string strOperatorAccount, string deleteAccount, out string strJsonResult)
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
                        || string.IsNullOrEmpty(deleteAccount))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    AdminDBProvider provider = new AdminDBProvider();
                    if (!provider.DeleteAdmin(transactionid, deleteAccount, out error))
                    {
                        bResult = false;
                        break;
                    }

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("DeleteSysAdmin Exception：" + ex.ToString());
                bResult = false;
            }
            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info);
            return bResult;
        }

        public bool GetAdminCount(Guid transactionid, string strOperatorAccount, int pagesize, out string strJsonResult)
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
                    AdminDBProvider provider = new AdminDBProvider();
                    if (!provider.GetAdminCount(transactionid, out totlecount, out error))
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
                Log4netHelper.Error("GetAdminCount Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, Dictionary);
            return bResult;
        }

        public bool GetAdminPager(Guid transactionid, string strOperatorAccount, int pagesize, int curpage, out string strJsonResult)
        {
            bool bResult = true;
            strJsonResult = string.Empty;
            ErrorCodeInfo error = new ErrorCodeInfo();
            List<AdminInfo> infoList = new List<AdminInfo>();
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

                    AdminDBProvider provider = new AdminDBProvider();
                    if (!provider.GetAdminPager(transactionid, curpage, pagesize, out infoList, out error))
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

        public bool Login(Guid transactionid, string userAccount, string Password, out string strJsonResult)
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
                    //参数验证
                    if (string.IsNullOrEmpty(userAccount)
                        || string.IsNullOrEmpty(Password))
                    {
                        error.Code = ErrorCode.JsonRequestEmpty;
                        bResult = false;
                        break;
                    }

                    AdminInfo info = new AdminInfo();
                    info.UserAccount = userAccount;
                    info.Password = Password;

                    AdminDBProvider provider = new AdminDBProvider();
                    if (!provider.Login(transactionid, info, out error))
                    {
                        bResult = false;
                        break;
                    }

                    Dictionary.Add("useraccount", info.UserAccount);

                } while (false);
            }
            catch (Exception ex)
            {
                error.Code = ErrorCode.Exception;
                Log4netHelper.Error("Login Exception：" + ex.ToString());
                bResult = false;
            }

            strJsonResult = JsonHelper.ReturnstrJson(bResult, error.Info, Dictionary);
            return bResult;
        }
    }
}
