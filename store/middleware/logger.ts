
export const createLoggerMiddleware = (config: any) => (set: any, get: any, api: any) => {
    return config(
        (args: any) => {
            set(args);
        },
        get,
        api
    );
};