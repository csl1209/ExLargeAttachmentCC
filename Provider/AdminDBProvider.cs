using Common;
using DBUtility;
using Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Provider
{
    public class AdminDBProvider
    {
        public bool AddAdmin(Guid transactionid, ref AdminInfo info, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "UserAccount:" + info.UserAccount;
            paramstr += "||Password:" + info.Password;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraUserAccount = new SqlParameter("@UserAccount", info.UserAccount);
                SqlParameter paraPassword = new SqlParameter("@Password", info.Password);

                paras.Add(paraUserAccount);
                paras.Add(paraPassword);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_AddAdmin]", out ds, out strError))
                    {
                        strError = "prc_AddAdmin数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("AdminDBProvider调用AddAdmin异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        int iResult = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                        switch (iResult)
                        {
                            case 0:
                                bResult = true;
                                break;
                            case -1:
                                bResult = false;
                                error.Code = ErrorCode.AccountIsExist;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("AdminDBProvider调用AddAdmin异常", paramstr, "-9999", transactionid);
                                break;
                            default:
                                bResult = false;
                                error.Code = ErrorCode.Exception;
                                break;
                        }
                        if (ds.Tables.Count > 1)
                        {
                            if (ds.Tables[1].Rows.Count > 0)
                            {
                                DataRow sdr = ds.Tables[1].Rows[0];
                                info.ID = Guid.Parse(Convert.ToString(sdr[0]));
                            }
                        }
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("AdminDBProvider调用AddAdmin异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool DeleteAdmin(Guid transactionid, string deleteAccount, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "deleteAccount:" + deleteAccount;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraUserAccount = new SqlParameter("@UserAccount", deleteAccount);

                paras.Add(paraUserAccount);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_DeleteAdmin]", out ds, out strError))
                    {
                        strError = "prc_DeleteAdmin数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("AdminDBProvider调用DeleteAdmin异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        int iResult = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                        switch (iResult)
                        {
                            case 0:
                                bResult = true;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("AdminDBProvider调用DeleteAdmin异常", paramstr, "-9999", transactionid);
                                break;
                            default:
                                bResult = false;
                                error.Code = ErrorCode.Exception;
                                break;
                        }
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("AdminDBProvider调用DeleteAdmin异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetAdminCount(Guid transactionid, out int totlecount, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            totlecount = 0;

            try
            {
                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction("dbo.[prc_GetAdminCount]", out ds, out strError))
                    {
                        strError = "prc_GetAdminCount数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("AdminDBProvider调用GetAdminCount异常", "", strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        if (ds.Tables.Count > 0)
                        {
                            totlecount = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                        }
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("AdminDBProvider调用GetAdminCount异常", "", ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetAdminPager(Guid transactionid, int curpage, int pagesize, out List<AdminInfo> infoList, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            infoList = new List<AdminInfo>();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "curpage:" + curpage;
            paramstr += "pagesize:" + pagesize;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraCurPage = new SqlParameter("@Curpage", curpage);
                SqlParameter paraPageSize = new SqlParameter("@Pagesize", pagesize);

                paras.Add(paraCurPage);
                paras.Add(paraPageSize);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_GetAdminPager]", out ds, out strError))
                    {
                        strError = "prc_GetAdminPager数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("AdminDBProvider调用GetAdminPager异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                AdminInfo info = new AdminInfo();
                                info.ID = Guid.Parse(Convert.ToString(dr["ID"]));
                                info.UserAccount = Convert.ToString(dr["UserAccount"]);
                                info.Status = (UserState)Convert.ToInt32(dr["Status"]);
                                infoList.Add(info);
                            }
                        }


                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("AdminDBProvider调用GetAdminPager异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool Login(Guid transactionid, AdminInfo info, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "UserAccount:" + info.UserAccount;
            paramstr += "||Password:" + info.Password;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraUserAccount = new SqlParameter("@UserAccount", info.UserAccount);
                SqlParameter paraPassword = new SqlParameter("@Password", info.Password);

                paras.Add(paraUserAccount);
                paras.Add(paraPassword);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);

                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_Login]", out ds, out strError))
                    {
                        strError = "prc_Login数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("AdminDBProvider调用Login异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        int iResult = Convert.ToInt32(ds.Tables[0].Rows[0][0]);
                        switch (iResult)
                        {
                            case 0:
                                bResult = true;
                                break;
                            case -1:
                                bResult = false;
                                error.Code = ErrorCode.AccountOrPasswordError;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("AdminDBProvider调用Login异常", paramstr, "-9999", transactionid);
                                break;
                            default:
                                bResult = false;
                                error.Code = ErrorCode.Exception;
                                break;
                        }
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("AdminDBProvider调用Login异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }
    }
}
