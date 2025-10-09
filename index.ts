import express from 'express'
import cors from 'cors'
import routesProposta from './routes/proposta'
import routesInstrutores from './routes/instrutores'
import routesExercicios from './routes/exercicios'
import routesTreinos from './routes/treinos'
import routesTreinoexercicios from './routes/treinoexercicios'
import routesUsuarios from './routes/usuarios'
import routesLogin from './routes/login'
import routesSeguranca from './routes/seguranca'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

app.use("/instrutores", routesInstrutores)
app.use("/exercicios", routesExercicios)
app.use("/treinos", routesTreinos)
app.use("/treinoexercicios", routesTreinoexercicios) 
app.use("/usuarios", routesUsuarios)
app.use("/login", routesLogin)
app.use("/seguranca", routesSeguranca)
app.use("/proposta", routesProposta)

app.use

app.get('/', (req, res) => {
  res.send('API: Controle treinos de academia')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})