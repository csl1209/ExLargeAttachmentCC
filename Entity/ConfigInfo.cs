using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class ConfigInfo
    {
        private int _ID = 0;
        public int ID
        {
            get { return _ID; }
            set { _ID = value; }
        }

        private string _Name = string.Empty;
        public string Name
        {
            get { return _Name; }
            set { _Name = value; }
        }

        private string _Value = string.Empty;
        public string Value
        {
            get { return _Value; }
            set { _Value = value; }
        }

        private string _Description = string.Empty;
        public string Description
        {
            get { return _Description; }
            set { _Description = value; }
        }

        private string _ExValue = string.Empty;
        public string ExValue
        {
            get { return _ExValue; }
            set { _ExValue = value; }
        }
    }
}
