import axios from "axios";
export const AxiosRequest = axios.create({
    baseURL: "http://192.168.1.12:3000"
});


