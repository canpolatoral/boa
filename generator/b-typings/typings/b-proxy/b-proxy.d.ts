declare namespace BProxy {
    class IProxy {
    }

    class ServiceProxy extends IProxy {
        constructor(baseUrl: string, logoutDelegate?: any);
        call(request: Object): any;
        call(requestClass: string, requestBody: Object): any;
        setLogoutDelegate(logoutDelegate: any): any;
        authenticationContext: AuthenticationContext;
    }

    class MockProxy extends IProxy {
        constructor(mockDataDictionary: Object);
        call(request: Object): any;
        call(requestClass: string, requestBody: Object): any;
    }
    class AuthenticationContext {
        access_token: string;
    }
}


declare module "b-proxy" {
    export = BProxy;
}