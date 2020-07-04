module.exports = {

    createToken: () => {
        token = '';
        initString = '0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        for (i = 1; i <= 40; i++) {
            position = Math.floor((Math.random() * (initString.length - 1)) + 1);
            token = token + initString.substr(position, 1);
        }
        return token;
    },

    isEqual: (a, b) => {
        // if length is not equal 
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length != b.length)
                return false;
            else {
                // comapring each element of array 
                for (var i = 0; i < a.length; i++)
                    if (a[i] != b[i])
                        return false;
                return true;
            }
        }
        else
        {
            return false
        }
    },

    phraseIsAccepted : (answer, keyAnswer) => {
        // if length is not equal 
        if (typeof answer =="string" || typeof keyAnswer == "string") {
            temp = keyAnswer.split("/").map(item => item.trim());
            if(temp.includes(answer.trim()))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false
        }
    },
}