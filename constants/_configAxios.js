import axios from 'axios'

export default axios.create({
    baseURL: 'https://www.itgenius.co.th/sandbox_api/cpallstockapi/public/api',
    Headers: {
        "Content-Type":"application/json",
        "Access-Control-Arrow-Origin": "*"
    }
})