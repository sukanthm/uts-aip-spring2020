const IconElement = (props) => {
    let style = '';
    if(props.iconSrc){
        style = "background-image: url('"+props.iconSrc+"');";
    }
    return(
        <a href="javascript:void(0);" className={'icon-element ' + props.className} title={props.title}>
            <h6 className="title-label">{props.title}</h6>
            <span className="count">{props.count}</span>
        </a>
    )
}

export default IconElement;