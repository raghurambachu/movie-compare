const debounce = (func)=>{
        let timerId;
        return function(){
                if(timerId) clearTimeout(timerId)
                timerId = setTimeout(()=>{
                        func()
                },800)
        }
}