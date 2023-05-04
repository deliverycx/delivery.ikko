/* eslint-disable prettier/prettier */
import axios, { AxiosInstance } from "axios";

export abstract class AxiosRequest {
    public _axios: AxiosInstance;

    constructor(
        private readonly baseUrl: string,
    
    ) {
        this.init();
    }

    private init() {
        this._axios = axios.create({
            baseURL: this.baseUrl
        });

        this._axios.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log(error);
                return Promise.reject(error);
            }
        );
    }
}
