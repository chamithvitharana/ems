# Use OpenJDK 21 base image
FROM amazoncorretto:21
WORKDIR /app
#COPY --from=build-project /app/access-point-service/target/access-point-service-1.0.0.jar /app/service.jar
COPY /target/*.jar /app/service.jar
EXPOSE 8888
CMD ["sh", "-c", "java -jar /app/service.jar"]
