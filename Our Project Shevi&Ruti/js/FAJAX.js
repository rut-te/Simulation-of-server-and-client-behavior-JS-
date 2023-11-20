class FXMLHttpRequest{
    constructor(){
        this.status;
        this.responseText;
        this.type;
        this.url;
        this.async=true;
        this.responseHeaders=[];
    }
    
    open(mytType,myUrl,myAsync=true){
        this.type=mytType;
        this.url=myUrl;
        if(myAsync===false)
            this.async=myAsync;
    }
    onload(){}
    send(details){
        let arr = this.url.split('/');
        if (arr[0] === "https:" && arr[1] === "" && arr[2] === "my-task.co.il") {
            sendTheRequest(details,this.type,this.url,this.async,this,arr);
        }
        else {
           this.status=100;
           this.onload();
        }
    }
}

