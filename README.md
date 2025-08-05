# ms-learning : Une Plateforme E-Learning Complète

**ms-learning** est une plateforme e-learning open-source et riche en fonctionnalités, conçue pour un enseignement en ligne interactif et sécurisé. Construite sur une architecture de microservices moderne, elle offre un environnement robuste et évolutif pour que les formateurs puissent créer du contenu et que les apprenants puissent s'y engager efficacement.

-----

## I. Fonctionnalités Principales

La plateforme est construite sur une base de fonctionnalités puissantes et distinctes, conçues pour créer un écosystème d'apprentissage complet.

  * **Authentification JWT Sécurisée :** Gère l'accès sécurisé des utilisateurs avec des autorisations basées sur les rôles (apprenants, formateurs) en utilisant les JSON Web Tokens. Protège toutes les routes et données sensibles avec un système d'authentification et d'autorisation robuste.

  * **Quiz & Génération de Certificats :** Propose un système de quiz interactif pour évaluer la compréhension des apprenants. Après une réussite, la plateforme génère et délivre automatiquement des certificats numériques pour valider les accomplissements.

  * **Transcription Automatique Audio/Vidéo :** Améliore l'accessibilité et la capacité de recherche en transcrivant automatiquement le contenu parlé des leçons audio et vidéo en format texte.

  * **Recherche Propulsée par Elasticsearch :** Met en œuvre un moteur de recherche puissant et rapide utilisant Elasticsearch, permettant aux utilisateurs de trouver instantanément des cours et du contenu grâce à la recherche par mots-clés.

  * **Support Multilingue :**

      * **Traduction de l'interface utilisateur :** L'interface utilisateur est disponible en anglais et en français.
      * **Traduction du chat en temps réel :** Les messages du chat en direct peuvent être instantanément traduits entre plusieurs langues (EN, FR, IT, DE, ES), favorisant une communauté mondiale.
      * **Traduction du contenu vidéo :** Prend en charge la traduction des supports vidéo pour élargir l'audience.

  * **Tableau de Bord du Formateur :** Une interface backend complète pour les formateurs afin de gérer leurs cours, visualiser les progrès des étudiants, gérer les inscriptions et analyser les métriques d'engagement alimentées par les données d'Elasticsearch.

  * **Système Dynamique d'Approbation des Formateurs :** Un flux de travail pour les administrateurs afin d'examiner et d'approuver les candidatures des formateurs, garantissant un contenu et des normes d'enseignement de haute qualité sur la plateforme.

  * **Intégration de Paiement Sécurisé :** Inclut une interface de passerelle de paiement sécurisée (par exemple, Stripe/PayPal) pour traiter les transactions des cours payants, garantissant des opérations financières sûres et fiables.

  * **Infrastructure de Test Complète :** Le code base est minutieusement testé à l'aide d'une combinaison de tests unitaires et d'intégration pour garantir la fiabilité, la stabilité et la maintenabilité.

  * **Notifications par E-mail Automatisées :** Maintient les utilisateurs informés avec des notifications par e-mail automatisées pour les événements clés tels que l'inscription, l'enrôlement à un cours et les annonces de la plateforme.

  * **Documentation de l'API (Swagger/OpenAPI) :** Fournit une documentation claire et détaillée de l'API en utilisant Swagger (OpenAPI) pour faciliter les intégrations et aider les développeurs travaillant avec les services backend de la plateforme.

  * **Environnement Conteneurisé (Docker) :** L'application entière et ses services sont conteneurisés avec Docker et orchestrés avec Docker Compose. Cela garantit un environnement de développement cohérent, simplifie le déploiement et permet une évolutivité facile.

  * **Conception UI/UX Centrée sur l'Utilisateur :** Propose une interface utilisateur intuitive, épurée et réactive, conçue pour offrir une expérience utilisateur fluide et engageante tant pour les apprenants que pour les formateurs.

  * **Plateforme Sociale Intégrée (`ms-connect`) :** Inclut un module social dédié où les utilisateurs peuvent créer des publications, participer à des discussions, commenter et envoyer des messages directs, construisant ainsi une communauté d'apprentissage collaborative.

-----

## II. Principes de Développement & DevOps

Le projet adhère aux pratiques DevOps modernes pour garantir la qualité du code, la sécurité et un cycle de développement rapide et fiable.

  * **Qualité de Code Continue :** Nous utilisons une suite d'outils d'analyse statique dans notre flux de travail GitHub Actions pour maintenir un code base propre et moderne. Cela inclut **ECS** pour les standards de codage, des **Linters** pour les fichiers de configuration, **PHPStan** pour la vérification des types, et **Rector** pour la refactorisation automatisée du code.

  * **Audit de Sécurité Automatisé :** Une tâche d'intégration continue exécute automatiquement **Composer Audit** pour rechercher les vulnérabilités connues dans les dépendances du projet. Le système est configuré pour signaler les problèmes de haute gravité et les paquets obsolètes afin de prévenir les risques de sécurité.

  * **Pipeline CI/CD :** Chaque modification du code déclenche un pipeline d'Intégration Continue/Déploiement Continu (CI/CD) utilisant GitHub Actions. Le pipeline construit automatiquement l'application dans un environnement Docker isolé, exécute la suite complète des tests PHPUnit et valide l'intégrité du code avant d'autoriser sa fusion, garantissant que la branche principale est toujours stable et déployable.

-----

## III. Surveillance et Observabilité

Pour garantir la santé du système et fournir des informations opérationnelles approfondies, nous avons mis en place une solution de surveillance centralisée utilisant la suite ELK.

  * **Elasticsearch :** Agit comme le magasin de données central, indexant tous les journaux et événements de l'application pour des requêtes rapides et puissantes.
  * **Logstash :** Traite, transforme et enrichit les données de journalisation provenant de diverses sources avant de les envoyer à Elasticsearch.
  * **Kibana :** Fournit de puissants tableaux de bord de visualisation pour surveiller la santé de l'application, suivre l'activité des utilisateurs, analyser les tendances de performance et résoudre les problèmes tels que les échecs de paiement en temps réel.
  * **Filebeat :** Un agent léger déployé sur les services pour collecter et transférer les journaux vers la suite ELK, garantissant une capture complète des données.

Cette pile nous donne une visibilité complète sur les opérations de la plateforme, permettant une résolution proactive des problèmes, un débogage rapide et une prise de décision basée sur les données.

-----

## IV. Démarrage

Suivez ces étapes pour configurer le projet localement pour le développement ou les tests.

```bash
# 1. Clonez la branche de développement du dépôt
git clone https://github.com/BenRhoumaMaher/ms-learning/tree/develop

# 2. Naviguez dans le répertoire du projet
cd ms-learning

# 3. Créez votre fichier de configuration d'environnement local
cp .env.example .env

# 4. Ouvrez le fichier .env et configurez votre base de données, e-mail et autres variables

# 5. Construisez et lancez les conteneurs de l'application
docker-compose up -d

# 6. Installez les dépendances PHP
docker-compose exec app composer install

# 7. Exécutez les migrations de la base de données
docker-compose exec app php bin/console doctrine:migrations:migrate
```

-----

## V. Contribuer

Les contributions sont les bienvenues \! Si vous souhaitez aider à améliorer **ms-learning**, n'hésitez pas à signaler des problèmes ou à soumettre des pull requests. Nous vous recommandons de suivre ces étapes générales :

1.  Forkez le dépôt.
2.  Créez une nouvelle branche de fonctionnalité (`git checkout -b feature/AmazingFeature`).
3.  Faites un commit de vos modifications (`git commit -m 'Add some AmazingFeature'`).
4.  Poussez vos modifications vers la branche (`git push origin feature/AmazingFeature`).
5.  Ouvrez une Pull Request.

-----

## VI. Licence

Ce projet est la propriété de et est maintenu par **Maher Ben Rhouma**.
