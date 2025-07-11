# ms-learning: A Comprehensive E-Learning Platform

**ms-learning** is an open-source, feature-rich e-learning platform designed for interactive and secure online education. Built with a modern microservices architecture, it provides a robust and scalable environment for instructors to create content and for learners to engage with it effectively.

-----

## I. Core Features

The platform is built on a foundation of powerful, distinct features designed to create a complete learning ecosystem.

  * **Secure JWT Authentication:** Manages secure user access with role-based permissions (learners, instructors) using JSON Web Tokens. Protects all sensitive routes and data with a robust authentication and authorization system.

  * **Quizzes & Certificate Generation:** Offers an interactive quiz system to assess learner understanding. Upon successful completion, the platform automatically generates and issues digital certificates to validate achievements.

  * **Automatic Audio/Video Transcription:** Enhances accessibility and searchability by automatically transcribing spoken content from audio and video lessons into text format.

  * **Elasticsearch-Powered Search:** Implements a powerful and fast search engine using Elasticsearch, allowing users to instantly find courses and content with keyword-based searching.

  * **Multilingual Support:**

      * **UI Translation:** The user interface is available in both English and French.
      * **Real-time Chat Translation:** Live chat messages can be instantly translated between multiple languages (EN, FR, IT, DE, ES), fostering a global community.
      * **Video Content Translation:** Supports translation for video materials to broaden audience reach.

  * **Instructor Dashboard:** A comprehensive backend interface for instructors to manage their courses, view student progress, handle enrollments, and analyze engagement metrics powered by Elasticsearch data.

  * **Dynamic Instructor Approval System:** A workflow for administrators to review and approve instructor applications, ensuring high-quality content and teaching standards on the platform.

  * **Secure Payment Integration:** Includes a secure payment gateway interface (e.g., Stripe/PayPal) for processing transactions for paid courses, ensuring safe and reliable financial operations.

  * **Comprehensive Testing Infrastructure:** The codebase is thoroughly tested using a combination of unit and integration tests to ensure reliability, stability, and maintainability.

  * **Automated Email Notifications:** Keeps users informed with automated email notifications for key events such as registration, course enrollment, and platform announcements.

  * **API Documentation (Swagger/OpenAPI):** Provides clear and detailed API documentation using Swagger (OpenAPI) to facilitate integrations and assist developers working with the platform's backend services.

  * **Dockerized Environment:** The entire application and its services are containerized using Docker and orchestrated with Docker Compose. This ensures a consistent development environment, simplifies deployment, and allows for easy scalability.

  * **User-Centric UI/UX Design:** Features an intuitive, clean, and responsive user interface designed to provide a seamless and engaging user experience for both learners and instructors.

  * **Integrated Social Platform (`ms-connect`):** Includes a dedicated social module where users can create posts, engage in discussions, comment, and send direct messages, building a collaborative learning community.

-----

## II. Development & DevOps Principles

The project adheres to modern DevOps practices to ensure code quality, security, and a rapid, reliable development lifecycle.

  * **Continuous Code Quality:** We use a suite of static analysis tools within our GitHub Actions workflow to maintain a clean and modern codebase. This includes **ECS** for coding standards, **Linters** for configuration files, **PHPStan** for type checking, and **Rector** for automated code refactoring.

  * **Automated Security Auditing:** A CI job automatically runs **Composer Audit** to scan for known vulnerabilities in project dependencies. The system is configured to flag high-severity issues and report outdated packages to prevent security risks.

  * **CI/CD Pipeline:** Every code change triggers a Continuous Integration/Continuous Deployment (CI/CD) pipeline using GitHub Actions. The pipeline automatically builds the application in an isolated Docker environment, runs the full suite of PHPUnit tests, and validates code integrity before allowing it to be merged, ensuring that the main branch is always stable and deployable.

-----

## III. Monitoring and Observability

To ensure system health and provide deep operational insights, we have implemented a centralized monitoring solution using the ELK Stack.

  * **Elasticsearch:** Acts as the central datastore, indexing all logs and application events for fast and powerful querying.
  * **Logstash:** Processes, transforms, and enriches log data from various sources before sending it to Elasticsearch.
  * **Kibana:** Provides powerful visualization dashboards to monitor application health, track user activity, analyze performance trends, and troubleshoot issues like payment failures in real-time.
  * **Filebeat:** A lightweight agent deployed across the services to collect and forward logs to the ELK stack, ensuring complete data capture.

This stack gives us full visibility into the platform's operations, enabling proactive problem-solving, rapid debugging, and data-driven decision-making.

-----

## IV. Getting Started

Follow these steps to set up the project locally for development or testing.

```bash
# 1. Clone the development branch of the repository
git clone https://github.com/BenRhoumaMaher/ms-learning/tree/develop

# 2. Navigate into the project directory
cd ms-learning

# 3. Create your local environment configuration file
cp .env.example .env

# 4. Open the .env file and configure your database, mail, and other variables

# 5. Build and run the application containers
docker-compose up -d

# 6. Install PHP dependencies
docker-compose exec app composer install

# 7. Run database migrations
docker-compose exec app php bin/console doctrine:migrations:migrate
```

-----

## V. Contributing

Contributions are welcome\! If you would like to help improve **ms-learning**, please feel free to file issues or submit pull requests. We recommend following these general steps:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## VI. License

This project is owned and maintained by **Maher Ben Rhouma**.
