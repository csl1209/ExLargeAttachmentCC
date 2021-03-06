﻿using Common;
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
    public class OperateLogDBProvider
    {
        public bool AddOperateLog(Guid transactionid, LogInfo info, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "OperateType:" + info.OperateType;
            paramstr += "||OperateLog:" + info.OperateLog;
            paramstr += "||Account:" + info.Account;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraOperateType = new SqlParameter("@UserAccount", info.OperateType);
                SqlParameter paraOperateLog = new SqlParameter("@Password", info.OperateLog);
                SqlParameter paraAccount = new SqlParameter("@Password", info.Account);

                paras.Add(paraOperateType);
                paras.Add(paraOperateLog);
                paras.Add(paraAccount);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_AddOperateLog]", out ds, out strError))
                    {
                        strError = "prc_AddOperateLog数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("OperateLogDBProvider调用AddOperateLog异常", paramstr, strError, transactionid);
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
                                Log4netHelper.Error("OperateLogDBProvider调用AddOperateLog异常", paramstr, "-9999", transactionid);
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
                Log4netHelper.Error("OperateLogDBProvider调用AddOperateLog异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetOperateLogCount(Guid transactionid, string lognum, string account, DateTime starttime, DateTime endtime, out int totlecount, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            totlecount = 0;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraLogNum = new SqlParameter("@LogNum", "%" + lognum + "%");
                SqlParameter paraAccount = new SqlParameter("@Account", "%" + account + "%");
                SqlParameter paraStartTime = new SqlParameter("@StartTime", starttime);
                SqlParameter paraEndTime = new SqlParameter("@EndTime", endtime);
                paras.Add(paraLogNum);
                paras.Add(paraAccount);
                paras.Add(paraStartTime);
                paras.Add(paraEndTime);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_GetOperateLogCount]", out ds, out strError))
                    {
                        strError = "prc_GetOperateLogCount数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("OperateLogDBProvider调用GetOperateLogCount异常", "", strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        if (ds.Tables.Count > 1)
                        {
                            totlecount = Convert.ToInt32(ds.Tables[1].Rows[0][0]);
                        }
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("OperateLogDBProvider调用GetOperateLogCount异常", "", ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetOperateLogPager(Guid transactionid, string lognum, string account, DateTime starttime, DateTime endtime, int curpage, int pagesize, out DataSet ds, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            ds = new DataSet();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "curpage:" + curpage;
            paramstr += "pagesize:" + pagesize;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraLogNum = new SqlParameter("@LogNum", "%" + lognum + "%");
                SqlParameter paraAccount = new SqlParameter("@Account", "%" + account + "%");
                SqlParameter paraStartTime = new SqlParameter("@StartTime", starttime);
                SqlParameter paraEndTime = new SqlParameter("@EndTime", endtime);
                SqlParameter paraCurPage = new SqlParameter("@CurPage", curpage);
                SqlParameter paraPageSize = new SqlParameter("@PageSize", pagesize);
                paras.Add(paraLogNum);
                paras.Add(paraAccount);
                paras.Add(paraStartTime);
                paras.Add(paraEndTime);
                paras.Add(paraCurPage);
                paras.Add(paraPageSize);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_GetOperateLogPager]", out ds, out strError))
                    {
                        strError = "prc_GetOperateLogPager数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("OperateLogDBProvider调用GetOperateLogPager异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("OperateLogDBProvider调用GetOperateLogPager异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }
    }
}
