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
    public class VersionDBProvider
    {
        public bool AddVersion(Guid transactionid, ref VersionInfo info, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "VersionNum:" + info.VersionNum;
            paramstr += "||FileName:" + info.FileName;
            paramstr += "||FilePath:" + info.FilePath;
            paramstr += "||Detail:" + info.Detail;
           
            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraVersionNum = new SqlParameter("@VersionNum", info.VersionNum);
                SqlParameter paraFileName = new SqlParameter("@FileName", info.FileName);
                SqlParameter paraFilePath = new SqlParameter("@FilePath", info.FilePath);
                SqlParameter paraDetail = new SqlParameter("@Detail", info.Detail);
                SqlParameter paraStatus = new SqlParameter("@Status", VersionState.Disable);

                paras.Add(paraVersionNum);
                paras.Add(paraFileName);
                paras.Add(paraFilePath);
                paras.Add(paraDetail);
                paras.Add(paraStatus);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_AddVersion]", out ds, out strError))
                    {
                        strError = "prc_AddVersion数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用AddVersion异常", paramstr, strError, transactionid);
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
                                error.Code = ErrorCode.VesionNumIsExist;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("VersionDBProvider调用AddVersion异常", paramstr, "-9999", transactionid);
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
                Log4netHelper.Error("VersionDBProvider调用AddVersion异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool EnableVersion(Guid transactionid, Guid versionID, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "VersionID:" + versionID;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraVersionID = new SqlParameter("@VersionID", versionID);
                SqlParameter paraStatus = new SqlParameter("@Status", VersionState.Enable);

                paras.Add(paraVersionID);
                paras.Add(paraStatus);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_EnableVersion]", out ds, out strError))
                    {
                        strError = "prc_EnableVersion数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用EnableVersion异常", paramstr, strError, transactionid);
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
                                error.Code = ErrorCode.VesionNumIsExist;
                                break;
                            case -2:
                                bResult = false;
                                error.Code = ErrorCode.EnableVersionIsExist;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("VersionDBProvider调用EnableVersion异常", paramstr, "-9999", transactionid);
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
                Log4netHelper.Error("VersionDBProvider调用EnableVersion异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool DisableVersion(Guid transactionid, Guid versionID, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "VersionID:" + versionID;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraVersionID = new SqlParameter("@VersionID", versionID);
                SqlParameter paraStatus = new SqlParameter("@Status", VersionState.Disable);

                paras.Add(paraVersionID);
                paras.Add(paraStatus);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_DisableVersion]", out ds, out strError))
                    {
                        strError = "prc_DisableVersion数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用DisableVersion异常", paramstr, strError, transactionid);
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
                                error.Code = ErrorCode.VesionNumIsExist;
                                break;
                            case -9999:
                                bResult = false;
                                error.Code = ErrorCode.SQLException;
                                Log4netHelper.Error("VersionDBProvider调用DisableVersion异常", paramstr, "-9999", transactionid);
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
                Log4netHelper.Error("VersionDBProvider调用DisableVersion异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool DeleteVersion(Guid transactionid, Guid versionID, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            string strError = string.Empty;
            string paramstr = string.Empty;
            paramstr += "VersionID:" + versionID;

            try
            {
                CParameters paras = new CParameters();
                SqlParameter paraVersionID = new SqlParameter("@VersionID", versionID);
                SqlParameter paraStatus = new SqlParameter("@Status", VersionState.Delete);

                paras.Add(paraVersionID);
                paras.Add(paraStatus);

                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_DeleteVersion]", out ds, out strError))
                    {
                        strError = "prc_DeleteVersion数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用DeleteVersion异常", paramstr, strError, transactionid);
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
                                Log4netHelper.Error("VersionDBProvider调用DeleteVersion异常", paramstr, "-9999", transactionid);
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
                Log4netHelper.Error("VersionDBProvider调用DeleteVersion异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetVesionCount(Guid transactionid, out int totlecount, out ErrorCodeInfo error)
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
                    if (!_db.ExcuteByTransaction("dbo.[prc_GetVesionCount]", out ds, out strError))
                    {
                        strError = "prc_GetVersionPager数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用GetVesionCount异常", "", strError, transactionid);
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
                Log4netHelper.Error("VersionDBProvider调用DisableVersion异常", "", ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool GetVersionPager(Guid transactionid,int curpage, int pagesize, out List<VersionInfo> infoList , out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            infoList = new List<VersionInfo>();
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
                    if (!_db.ExcuteByTransaction(paras, "dbo.[prc_GetVersionPager]", out ds, out strError))
                    {
                        strError = "prc_GetVersionPager数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用GetVersionPager异常", paramstr, strError, transactionid);
                        error.Code = ErrorCode.SQLException;
                        bResult = false;
                        break;
                    }
                    else
                    {
                        if (ds.Tables.Count > 0)
                        {
                            foreach(DataRow dr in ds.Tables[0].Rows)
                            {
                                VersionInfo info = new VersionInfo();
                                info.ID = Guid.Parse(Convert.ToString(dr["ID"]));
                                info.VersionNum = Convert.ToString(dr["VersionNum"]);
                                info.FileName = Convert.ToString(dr["FileName"]);
                                info.FilePath = Convert.ToString(dr["FilePath"]);
                                info.CreateTime = Convert.ToDateTime(dr["CreateTime"]);
                                info.Detail = Convert.ToString(dr["Detail"]);
                                info.Status = (VersionState)Convert.ToInt32(dr["Status"]);
                                infoList.Add(info);
                            }
                        }
                      

                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("VersionDBProvider调用GetVersionPager异常", paramstr, ex.ToString(), transactionid);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }

        public bool CheckCurrentVersion(out VersionInfo info, out ErrorCodeInfo error)
        {
            bool bResult = true;
            error = new ErrorCodeInfo();
            info = new VersionInfo();
            string strError = string.Empty;
            
            try
            {
                CBaseDB _db = new CBaseDB(Conntection.strConnection);
                do
                {
                    //int iResult = 0;
                    DataSet ds = new DataSet();
                    if (!_db.ExcuteByTransaction("dbo.[prc_CheckVersion]", out ds, out strError))
                    {
                        strError = "prc_CheckVersion数据库执行失败,Error:" + strError;
                        Log4netHelper.Error("VersionDBProvider调用CheckVersion异常", "", strError,Guid.Empty);
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
                                info.ID = Guid.Parse(Convert.ToString(dr["ID"]));
                                info.VersionNum = Convert.ToString(dr["VersionNum"]);
                                info.FileName = Convert.ToString(dr["FileName"]);
                                info.FilePath = Convert.ToString(dr["FilePath"]);
                                info.CreateTime = Convert.ToDateTime(dr["CreateTime"]);
                                info.Detail = Convert.ToString(dr["Detail"]);
                                info.Status = (VersionState)Convert.ToInt32(dr["Status"]);
                            }
                        }


                    }
                } while (false);
            }
            catch (Exception ex)
            {
                bResult = false;
                Log4netHelper.Error("VersionDBProvider调用CheckVersion异常", "", ex.ToString(), Guid.Empty);
                error.Code = ErrorCode.Exception;
            }
            return bResult;
        }
    }
}
