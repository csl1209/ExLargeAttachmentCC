using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class AdminInfo
    {
        private int _ID = 0;
        public int ID
        {
            get { return _ID; }
            set { _ID = value; }
        }

        private string _UserAccount = string.Empty;
        public string UserAccount
        {
            get { return _UserAccount; }
            set { _UserAccount = value; }
        }

        private string _Password = string.Empty;
        public string Password
        {
            get { return _Password; }
            set { _Password = value; }
        }

        private UserState _Status = UserState.Enable;
        public UserState Status
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
                    case UserState.Enable:
                        _StatusName = "正常";
                        break;
                }
                return _StatusName;
            }
        }

        private DateTime _CreateTime = DateTime.Now;
        public DateTime CreateTime
        {
            get { return _CreateTime; }
            set { _CreateTime = value; }
        }
    }

    public enum UserState
    {
        Delete = -1,
        Enable = 1
    }
}
