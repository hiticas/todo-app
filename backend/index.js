require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const todosRoutes = require('./routes/todos')

const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://todos-app.netlify.app",
    "https://*.netlify.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// express app
const app = express()

// middleware
app.use(cors(corsOptions));
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${req.path} ${req.method}`)
  next()
})

app.use('/api/todos', todosRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`connect to db and listenning on http://localhost:${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })
