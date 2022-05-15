import mongoose from 'mongoose'
import app from './app.js'

const { MONGO_URI, PORT } = process.env
const port = PORT || 4001

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected MongoDB 📦'))
  .catch(err => console.error('Error connecting to MongoDB 💥', err))

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`)
})
