import proxy from "express-http-proxy"


export const proxyHeader = (serviceUrl)=>{
    return proxy(serviceUrl,{
        proxyReqOptDecorator:(proxyReqOpts,srcReq)=>{

            if(srcReq.user){   
                proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
            }
        }
    });
}