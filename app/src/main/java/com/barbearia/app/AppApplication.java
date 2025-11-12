package com.barbearia.app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@SpringBootApplication
@EnableReactiveMongoRepositories(basePackages = "com.barbearia.app.repository")
public class AppApplication {

  public static void main(String[] args) {
    Dotenv dotenv = Dotenv.load();
    System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
    System.setProperty("MONGODB_DATABASE", dotenv.get("MONGODB_DATABASE"));
    System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
    SpringApplication.run(AppApplication.class, args);
  }
}
