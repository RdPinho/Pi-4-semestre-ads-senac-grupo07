# 💈 Barbearia App — Projeto Integrador Senac

Aplicativo desenvolvido como parte do **Projeto Integrador (PI)** do curso de **Análise e Desenvolvimento de Sistemas — Senac**.  
O sistema permite gerenciar agendamentos de horários em uma barbearia, conectando clientes e profissionais em um ambiente simples e intuitivo.

---

## 🚀 Tecnologias utilizadas

### Backend
- [Java 17+](https://adoptium.net/)
- [Spring Boot 3](https://spring.io/projects/spring-boot)
- [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)
- [JWT (JSON Web Token)](https://jwt.io/) para autenticação
- [Maven](https://maven.apache.org/) para gerenciamento de dependências

### Banco de dados
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — cluster gratuito na nuvem

---

## ⚙️ Configuração do ambiente local

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/<nome-do-repositorio>.git
cd <nome-do-repositorio>
```

### 2️⃣ Criar o arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto, com base no modelo `.env.example`.

```bash
cp .env.example .env
```

Preencha com suas credenciais reais (não compartilhe esse arquivo publicamente!):

```bash
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<seu-cluster>.mongodb.net/barbearia
MONGODB_DATABASE=barbearia
JWT_SECRET_KEY=sua-chave-secreta-aqui
```

> ⚠️ **Importante:**  
> O arquivo `.env` **não deve ser commitado no GitHub** — ele contém dados sensíveis.

---

## 🧩 Configuração no Spring Boot

O projeto utiliza variáveis de ambiente configuradas no `application.properties`:

```properties
spring.application.name=app
jwt.secret-key=${JWT_SECRET_KEY}
jwt.expiration-time=86400000
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=${MONGODB_DATABASE}
```

---

## ▶️ Executando o projeto localmente

Com o ambiente configurado e o MongoDB Atlas acessível:

```bash
mvn spring-boot:run
```

O servidor iniciará (por padrão) em:
```
http://localhost:8080
```

---

## 🧠 Estrutura básica do projeto

```
src/
 ├── main/
 │   ├── java/
 │   │   └── com/barbearia/app/
 │   │        ├── config/
 │   │        ├── controllers/
 │   │        ├── exception/
 │   │        ├── models/
 │   │        ├── repositories/
 │   │        ├── services/
 │   │        └── utils/
 │   └── resources/
 │        ├── application.properties
 │        └── static/
 └── test/
```

---

## 🌐 Deploy (opcional)

Para fins de apresentação, o backend pode ser publicado gratuitamente no **Render** e o banco de dados mantido no **MongoDB Atlas**.

### Exemplo de configuração no Render:
- **Environment Variables:**
  - `MONGODB_URI`
  - `MONGODB_DATABASE`
  - `JWT_SECRET_KEY`
- **Build Command:** `mvn clean install`
- **Start Command:** `java -jar target/app-0.0.1-SNAPSHOT.jar`

---

## 🛡️ Boas práticas de segurança

- Nunca exponha credenciais no código-fonte.
- Utilize variáveis de ambiente para JWT e MongoDB.
- Não versione o arquivo `.env`.
- Troque senhas e chaves após apresentações públicas.

---

## 📄 Licença

Este projeto foi desenvolvido apenas para fins **educacionais** e **acadêmicos** no âmbito do Projeto Integrador do Senac.