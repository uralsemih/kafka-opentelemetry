const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const opentelemetry = require("@opentelemetry/sdk-node");
const api = require('@opentelemetry/api');
const { CompositePropagator } = require('@opentelemetry/core');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { B3Propagator, B3InjectEncoding } = require('@opentelemetry/propagator-b3');
const {ConsoleSpanExporter} = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');

const serviceName = 'product-service'
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://otel-collector:4317/'
});

api.propagation.setGlobalPropagator(
    new CompositePropagator({
      propagators: [
        new B3Propagator({ injectEncoding: B3InjectEncoding.MULTI_HEADER }),
      ],
    })
);

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  }),
  // traceExporter: new ConsoleSpanExporter(),
  traceExporter: traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation(),
      new KafkaJsInstrumentation()
    ],
});

sdk
  .start()
  .then(() => {
    console.log('Tracing initialized for product-service')
  })
  .catch((error) => {
    console.log('Error initializing tracing for product-service', error)
  })

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => {
      console.log('Tracing terminated for product-service')
    })
    .catch((error) => {
      console.log('Error terminating tracing for product-service', error)
    })
    .finally(() => {
      process.exit(0)
    })
})