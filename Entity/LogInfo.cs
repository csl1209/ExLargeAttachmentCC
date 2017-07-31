using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class LogInfo
    {
        private int _ID = 0;
        public int ID
        {
            get { return _ID; }
            set { _ID = value; }
        }

        private string _Account = string.Empty;
        public string Account
        {
            get { return _Account; }
            set { _Account = value; }
        }

        private string _LogNum = string.Empty;
        public string LogNum
        {
            get { return _LogNum; }
            set { _LogNum = value; }
        }

        private DateTime _OperateTime = DateTime.Now;
        public DateTime OperateTime
        {
            get { return _OperateTime; }
            set { _OperateTime = value; }
        }

        public string OperateTimeName
        {
            get
            {
                return _OperateTime.ToString("yyyy-MM-dd HH:mm:ss");
            }
        }

        private string _OperateType = string.Empty;
        public string OperateType
        {
            get { return _OperateType; }
            set { _OperateType = value; }
        }

        private string _OperateLog = string.Empty;
        public string OperateLog
        {
            get { return _OperateLog; }
            set { _OperateLog = value; }
        }

        private bool _OperateResult = true;
        public bool OperateResult
        {
            get { return _OperateResult; }
            set { _OperateResult = value; }
        }
    }
}
