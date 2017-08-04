using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class ErrorCodeInfo
    {
        private ErrorCode _Code = ErrorCode.None;
        public ErrorCode Code
        {
            get
            {
                return _Code;
            }
            set
            {
                _Code = value;
            }
        }

        public String Info
        {
            get
            {
                String codeInfo = String.Empty;
                switch (_Code)
                {
                    case ErrorCode.None:
                        break;
                    case ErrorCode.TokenEmpty:
                        codeInfo = "用户身份凭据为空！";
                        break;
                    case ErrorCode.TokenIllegal:
                        codeInfo = "用户身份凭据格式不合法！";
                        break;
                    case ErrorCode.TokenExpire:
                        codeInfo = "用户身份凭据过期！";
                        break;
                    case ErrorCode.JsonRequestEmpty:
                        codeInfo = "请求参数为空！";
                        break;
                    case ErrorCode.JsonRequestIllegal:
                        codeInfo = "请求参数格式不合法！";
                        break;
                    case ErrorCode.SQLException:
                        codeInfo = "系统错误，请联系管理员！";
                        break;
                    case ErrorCode.Exception:
                        codeInfo = "系统错误，请联系管理员！";
                        break;
                    case ErrorCode.VesionNumIsExist:
                        codeInfo = "系统中已存在相同编号的补丁！";
                        break;
                    case ErrorCode.EnableVersionIsExist:
                        codeInfo = "系统中已存在启用的补丁！";
                        break;
                    case ErrorCode.AccountIsExist:
                        codeInfo = "系统中已存在相同账户的管理员！";
                        break;
                    case ErrorCode.AccountOrPasswordError:
                        codeInfo = "账户或密码错误！";
                        break;
                    case ErrorCode.AdminIsNotExist:
                        codeInfo = "管理员不存在或超时！";
                        break;
                    case ErrorCode.DeleteAccountIsLoginAccount:
                        codeInfo = "不能删除当前登录管理员！";
                        break;
                    default:
                        break;
                }
                return codeInfo;
            }
        }
    }

    public enum ErrorCode
    {
        None = 0,
        TokenEmpty = 9001,
        TokenIllegal = 9002,
        TokenExpire = 9003,
        JsonRequestEmpty = 9004,
        JsonRequestIllegal = 9005,
        Exception = 9999,
        SQLException = 9998,
        VesionNumIsExist = 1001,
        EnableVersionIsExist = 1002,
        AccountIsExist = 1003,
        AccountOrPasswordError = 1004,
        AdminIsNotExist = 1005,
        DeleteAccountIsLoginAccount = 1006,
    }
}
