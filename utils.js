function waitOnPage(selector, {interval= 500, timeout= 5000} = {}) {
    const start = new Date();
    return new Promise((res, rej)=>{
        const I = setInterval(async () => {
            if(new Date() - start > timeout){
                clearInterval(I);
                return rej("TIMEOUT")
            }
            const check = await this.evaluate(function(s){
                return $(s).is(':visible');
            }, selector)
            if(check){
                clearInterval(I);
                return res(check);
            }
        }, interval);
    });
}

async function getBrowserVersion(){
    return await this.evaluate(function(){
        return (function(){
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
})
}