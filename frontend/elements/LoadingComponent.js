//loading wheel for after frontend initial render and till backend api call returns
const LoadingComponent = () => {
    return (
        <div className="container text-center">
            <h5>Loading</h5>
            <img src="/images/loading.gif" alt="loading..." className="img-responsive logo-forward" />
        </div>
    )
}

export default LoadingComponent;