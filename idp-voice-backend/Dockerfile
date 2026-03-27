FROM maven:3-eclipse-temurin-25-alpine AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM eclipse-temurin:25
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
