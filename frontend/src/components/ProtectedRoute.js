import { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';

const ProtectedRoute = (props) => {
    let { id } = useParams();
    const { user, setUser } = useContext(UserContext)
    if(sessionStorage.getItem("token")== '' || sessionStorage.getItem("token") == undefined || sessionStorage.getItem("token") == null){

        if(id){
            return <Navigate to={"/inloggen"} replace state={{"next": props.path+"/"+id}} />;

        }else{
            return <Navigate to={"/inloggen"} replace state={{"next": props.path}} />;
        }
    
        
    }
    else if(props.admin == true){
        // console.log(user)
        if (user.admin != true){
            return <Navigate to={"/"} replace state={{"error": "Je hebt geen toegang"}}/>;
        }
        
    }
    return props.children;


   


};

export default ProtectedRoute;
