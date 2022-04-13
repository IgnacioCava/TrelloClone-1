import { useContext } from "react";
import { AuthContext } from "../contexts/AuthStore";

export default function withStore(Component){

    return (props) => {
        const store = useContext(AuthContext)
        return <Component store={store} props={props} />
        
    };
}