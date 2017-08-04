$(function () {
    //createCode();
    //createCode1();
})
    function createCode() {

        var code1 = "";
        var codeLength = 4;//验证码的长度  
        var checkCode = document.getElementById("code");
        var random = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数  
        for (var i = 0; i < codeLength; i++) {//循环操作  
            var index = Math.floor(Math.random() * 32);//取得随机数的索引（0~35）  
            code1 += random[index];//根据索引取得随机数加到code上  
        }
        checkCode.value = code1;//把code值赋给验证码  
    }

    function createCode1() {

        var code1 = "";
        var codeLength = 4;//验证码的长度  
        var checkCode = document.getElementById("code1");
        var random = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数  
        for (var i = 0; i < codeLength; i++) {//循环操作  
            var index = Math.floor(Math.random() * 32);//取得随机数的索引（0~35）  
            code1 += random[index];//根据索引取得随机数加到code上  
        }
        checkCode.value = code1;//把code值赋给验证码  
    }
    //校验验证码  
    function validate(objid) {
        var inputCode = document.getElementById("d2yzmcode").value.toUpperCase(); //取得输入的验证码并转化为大写        
        if (inputCode.length <= 0) { //若输入的验证码长度为0  
            //$("#" + objid).html("请输入验证码！"); //则弹出请输入验证码
            $(("#code")).nextAll().remove();
            $("<span style='color: #FF0000; position: absolute;margin-left: 10px;height: 40px; line-height: 40px;width:200px;'>请输入验证码</span>").insertAfter(("#code"));
            return false;
        }
        else if (inputCode != code1) { //若输入的验证码与产生的验证码不一致时  
            //$("#" + objid).html("验证码输入错误！@_@"); //则弹出验证码输入错误 
            $(("#code")).nextAll().remove();
            $("<span style='color: #FF0000; position: absolute;margin-left: 10px;height: 40px; line-height: 40px;width:200px;'>验证码输入错误！</span>").insertAfter(("#code"));

            createCode();//刷新验证码  
            document.getElementById("d2yzmcode").value = "";//清空文本框  
            return false;
        }
        else {
            $("#" + objid).html("");
            $(("#code")).nextAll().remove();
            return true;
        }

    }