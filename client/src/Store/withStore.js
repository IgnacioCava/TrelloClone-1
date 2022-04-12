import useStore from "./useStore";
import { useContext } from "react";
import { Context } from "./useStore";

export default function withStore(stores, Component){
    return (props) => {
        const {store, Context} = useStore(stores)
        
        return <Component store={store} context={Context} props={props} />
    };

}