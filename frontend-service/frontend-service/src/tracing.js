const { WebTracerProvider } = require("@opentelemetry/sdk-trace-web");
const {
  getWebAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-web");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} = require("@opentelemetry/sdk-trace-base");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { ZoneContextManager } = require("@opentelemetry/context-zone");
const { B3Propagator } = require("@opentelemetry/propagator-b3");
const { Resource } = require("@opentelemetry/resources");

const serviceName = "frontend-service";
const collectorOptions = {
  url: "http://localhost:4318/v1/traces",
};

const exporter = new OTLPTraceExporter(collectorOptions);

const provider = new WebTracerProvider({
  resource: new Resource({
    "service.name": serviceName,
  }),
});

//provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new B3Propagator(),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      // load custom configuration for xml-http-request instrumentation
      "@opentelemetry/instrumentation-xml-http-request": {
        propagateTraceHeaderCorsUrls: [/.+/g],
      },
      // load custom configuration for fetch instrumentation
      "@opentelemetry/instrumentation-fetch": {
        propagateTraceHeaderCorsUrls: [/.+/g],
      },
      "@opentelemetry/instrumentation-document-load": { enabled: false },
      "@opentelemetry/instrumentation-user-interaction": { enabled: false }
    }),
  ],
});


