import useStore from "./useStore";

export default function withStore(Component){
    return (props) => {
        const context = useStore()
        return <Component store={context.store} props={props} />;
    };

}