import api from "../utils/axios";


const getCurrentUser = async()=>{
    try {
      const res = await api.get("/api/me");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
}


export default getCurrentUser;
    