FROM registry-dub.tools.3stripes.net/eft-wm-images-public/maven:3.6.3-openjdk-11-slim AS builder
WORKDIR /var/app
COPY ./pom.xml ./pom.xml
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B
COPY ./src ./src
RUN --mount=type=cache,target=/root/.m2 mvn package
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.16.0/opentelemetry-javaagent.jar /var/app/opentelemetry-javaagent.jar

FROM registry-dub.tools.3stripes.net/eft-wm-images-public/maven:3.6.3-openjdk-11-slim
WORKDIR /var/app
COPY --from=builder /var/app/target/*.jar /var/app/app.jar
COPY --from=builder /var/app/opentelemetry-javaagent.jar /var/app/opentelemetry-javaagent.jar
EXPOSE 8004
ENTRYPOINT ["sh","-c","java -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=production -jar -javaagent:opentelemetry-javaagent.jar /var/app/app.jar"]