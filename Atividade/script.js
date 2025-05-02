import express, { response } from "express"
import cors from "cors"
import {promises as fs} from "node:fs"

const app = express()
const DATABASE_URL = "./database/participants.json"
const PORT = 3333
app.use(express.json())
app.use(cors({
   origin:"*",
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true 
}))
app.get("/participants", async (req, res) => {
    try{
    const data = await fs.readFile(DATABASE_URL, 'utf-8')
   const listaParticipantte =  JSON.parse(data)
   if(listaParticipantte.lenght === 0){
    response.status(200).json({message:"Não possui participante cadastrado"})
   }
    }catch(error){
      console.log(error)
      response.status(500).json({message:"Internal server error"})
    }
})
app.get("/participants/count", async (req, res) => {
    try {
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const participantes = JSON.parse(data)
        console.log(participantes.length)
        res.status(200).json({QuantidadeParticipantes: participantes.length})
    }catch(error){
        console.log(error)
        response.status(500).json({message:"Erro interno do servidor"})
    }
});
app.get("/participants/count/over18", async (req, res) => {
    try{
        const data =  await fs.readFile(DATABASE_URL, 'utf-8')
        const participantes = JSON.parse(data)

        const participantesMaioresQue18 = participantes.filter((participante) => participante.age >= 18)
        if(participantesMaioresQue18.length  === 0){
            res.status(200).json({message:"Nenhum participante é maior que 18"})
            return
        }
    } catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})
app.get("/participants/city/most", async (req, res) => {})
app.post("/participants", async (req, res) => {
    const {name, email, password, age, city} = req.body

    if(!name){
        res.status(400).json({message:"Nome obrigatório"})

        return
    }
    if(!email){
        res.status(400).json({message:"Email obrigatório"})

        return
    }
    if(!password){
        res.status(400).json({message:"Senha obrigatório"})

        return
    }
    if(!age){
        res.status(400).json({message:"Idade obrigatória"})

        return
    }
    if(!city){
        res.status(400).json({message:"Cidade obrigatório"})

        return
    }
    if(age < 16){
        res.status(400).json({message:"Idade não permitida"})
        return
    }
    try{
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const participantes = JSON.parse(data) 
        
        const verificarEmailExistente = participantes.find((participante) => participante.email === email)
        if(verificarEmailExistente){
            res.status(401).json({message:"Este email já esttá em uso"})
            return      
        }
        const participante ={
            id: Date.now().toString(),
            name,
            email,
            password,
            age, 
            city
        }
        participantes.push(participante);
        await fs.writeFile(DATABASE_URL, JSON.stringify(participantes, null, 2))
        res.status(201).json({message: "Participante Cadastrado"})
   }catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error"})
   }
})
app.get("/participants/:id", async (req, res) => {
    const {id} = req.params;

    try{
        const data = await fs.readFile(DATABASE_URL, "utf-8");
        const participantes = JSON.parse(data);

        const encontrarParticipante = participantes.find(
            (participantes) => participante.id === id
        );
        if(!encontrarParticipante) {
            res.status(404).json({message: "Participante não encontrado"});
            return;
        }
        res.status(200).json({encontrarParticipante});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Erro interno do servidor"});
    }
})
app.put("/participants/:id", async (req, res) => {
    const {id} = req.params

    if(age < 16){
        res.status(401).json({message:"Idade não permitida"})
        return       
    }
    try{
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const participantes = JSON.parse(data)
        //2º
        const indexParticipante = participantes.findIndex((participante) =>participante.id === id)
        if(indexParticipante === -1){
            res.status(404).json({message:"Participante não encontrado"})
            return
        }

        //3º
        const emailParticipante = participantes.find((participante) => participante.email === email && participante.id !== id)
        if(emailParticipante){
            res.status(409).json({mensagem: "Este email já em uso"})
            return
        }

        participantes[indexParticipante]={
            ...participantes[indexParticipante],
            nome,
            email,
            password,
            age,
            city
        }

        await fs.writeFile(DATABASE_URL, JSON.stringify(participantes, null, 2))
        res.status(200).json({message:"Participante Atualizado"})
    } catch(error){
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})
app.delete("/participants/:id", async (req, res) => {})

// app.get("/motorista", (res, req) => {
//     fs.readFile(DATABASE_URL, "utf-8", (err, data) =>{
//         if(err){
//             console.log(err)
//             res.status(500).json({message:"Erro ao ler o artigo"})
//             return;
//         }
//         const motorista = data
//         res.status(200).json({motorista})
//     })
// });
// app.post("/motorista", (res, req) => {
//     const {nome, dataNascimento, numeroCart} = req.body;
//     if(!nome || typeof nome !== "string" || nome.trim() === ""){
//         res.status(400).json({message:"O nome é obrigatório e deve ser em texto!!!"})
//         return;
//     }
//     if(!dataNascimento || typeof dataNascimento !== "string" || dataNascimento.trim() === ""){
//         res.status().json({message:"A data de nascimento é obrigatório e deve ser em texto!!"})
//         return;
//     }
//     if(!numeroCart || typeof numeroCart !== "string" || numeroCart.trim() === ""){
//         res.status().json({message:"O número da carteira de habilitação e deve ser em texto!"})
//         return;
//     }
//     fs.readFile(DATABASE_URL, "utf-8", (err, data) =>{
//         if(err) {
//             console.log(err)
//             res.status(500).json({message:"Erro ao ler o artigo"})
//             return;
//         }
//         const motorista = JSON.parse(data)

//         const novoMotorista = {
//             id: Date.now().toString(),
//             nome,
//         dataNascimento,
//         numeroCart
//         }

//         motorista.push(novoMotorista)
//         fs.writeFile


//     })
// })

app.listen(PORT, ()=>{
    console.log("Servidor iniciado no portal:", PORT)
})