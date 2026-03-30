const WhyChooseUs = ({imgPath,title,subtitle}) => {
    return (
        <div className="w-63.5 h-72 content-center">
            <div className="h-30 w-30 m-auto"><img src={imgPath} alt="card1" /></div>
            <div className="mt-3">
                <h1 className="text-20 text-primary font-medium text-center">{title}</h1>
                <p className="text-16 text-primary font-regular text-center">{subtitle}</p>
            </div>
        </div>
    )
};
export default WhyChooseUs;
