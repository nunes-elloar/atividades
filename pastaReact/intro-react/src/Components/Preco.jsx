import  icon from "../assets/icon-music.svg"

const Preco = () =>{
    return (
    <div className="preco">
        <img className="imagem2" src={icon} alt="" />
        <div className="junto">
            <p className="text1"> <strong>Annual Plan</strong></p>
            <p className="text2">$59.99/year</p>
        </div>
        <a href="#">change</a>
    </div>
    )
}
export default Preco