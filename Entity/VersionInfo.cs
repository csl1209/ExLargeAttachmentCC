using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class VersionInfo
    {
        private Guid _ID = Guid.Empty;
        public Guid ID
        {
            get { return _ID; }
            set { _ID = value; }
        }

        private string _VersionNum = string.Empty;
        public string VersionNum
        {
            get { return _VersionNum; }
            set { _VersionNum = value; }
        }

        private string _FileName = string.Empty;
        public string FileName
        {
            get { return _FileName; }
            set { _FileName = value; }
        }

        private string _FilePath = string.Empty;
        public string FilePath
        {
            get { return _FilePath; }
            set { _FilePath = value; }
        }

        private string _Detail = string.Empty;
        public string Detail
        {
            get { return _Detail; }
            set { _Detail = value; }
        }

        private DateTime _CreateTime = DateTime.Now;
        public DateTime CreateTime
        {
            get { return _CreateTime; }
            set { _CreateTime = value; }
        }

        private VersionState _Status = VersionState.Enable;
        public VersionState Status
        {
            get { return _Status; }
            set { _Status = value; }
        }

        private string _StatusName = string.Empty;
        public string StatusName
        {
            get
            {
                switch (_Status)
                {
                    case VersionState.Enable:
                        _StatusName = "启用";
                        break;
                    case VersionState.Disable:
                        _StatusName = "禁用";
                        break;
                }
                return _StatusName;
            }
        }
    }

    public enum VersionState
    {
        Delete = -1,
        Enable = 1,
        Disable = 2
    }
}
