const express = require("express");
const pino = require("pino");
const prometheus = require("prom-client");
const mongoose = require("mongoose");
const dotnenv = require("dotenv");
const productRoute = require("./routes/product");
const Product = require("./models/Product");
const { Kafka } = require('kafkajs')

const app = express();
const logger = pino();
dotnenv.config();

const port = 8005;
const connectionString = process.env.MONGO_URL


const kafka = new Kafka ({
  clientId: "product-service",
  brokers: ['kafka:9092']
})

const topicName = 'productCreated'

mongoose.connect(connectionString, { useNewUrlParser: true})
.then(() => console.log("Connected to mongod"))
.catch((e) => {
  console.error("Database connection error", e.message);
});

const processConsumer = async () => {
  const productsConsumer = kafka.consumer({groupId: 'products'})
  await productsConsumer.connect();
  await productsConsumer.subscribe({
    topic: topicName,
    fromBeginning: true
  })
  await productsConsumer.run({
    eachMessage: async ({topic, partition, message, headers}) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
        headers: Object.keys(message.headers).reduce((obj, key) => ({ ...obj, [key]: message.headers[key].toString()}), {})
      })
      const newProduct = new Product(JSON.parse(message.value.toString()))
      await newProduct.save()
    }
  })
}

const register = new prometheus.Registry();
register.setDefaultLabels({
  app: "product-service",
});

prometheus.collectDefaultMetrics({ register });
processConsumer().catch(console.error)

app.use(express.json());
app.use("/products", productRoute);

app.get("/readyz", (req, res) => {
  res.status(200).json({ status: "readyz healthcheck ok." });
});

app.get("/livez", (req, res) => {
  res.status(200).json({ status: "livez healthcheck ok." });
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Product service listening port ${port}`);
});
