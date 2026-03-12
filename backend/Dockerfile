# Build stage
FROM openjdk:21-jdk-slim AS build
WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]