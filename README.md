# ContactManagerFrontEnd

## Application de Gestion des Contacts - Frontend (React)

### Description

Cette application React permet de gérer une liste de contacts avec les fonctionnalités suivantes :
- Ajouter un nouveau contact
- Afficher tous les contacts dans un tableau triable
- Modifier les détails d'un contact existant
- Éliminer un contact
- Rechercher des contacts de manière dynamique
- Trier les contacts par colonnes

### Prérequis

- Node.js (version >= 16.x)
- npm ou yarn

### Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/adem-sys/ContactManagerFrontEnd.git
    ```

2. Installez les dépendances :
    ```bash
    cd ContactManagerFrontEnd
    npm install
    # ou
    yarn install
    ```

3. Démarrez l'application :
    ```bash
    npm start
    # ou
    yarn start
    ```

4. Accédez à l'application sur [http://localhost:3000](http://localhost:3000).

### Configuration des Routes

Pour que l'application React puisse se connecter à votre backend Symfony, vous devrez peut-être ajuster les routes utilisées pour les appels API. Assurez-vous de modifier les URL dans le fichier `ContactsTable.js` pour correspondre à l'URL de votre backend Symfony, comme suit :

1. Ouvrez `ContactsTable.js` (ou le fichier pertinent où les appels API sont effectués).

2. Modifiez les URL pour correspondre à celles de votre backend Symfony. Par exemple, si votre backend Symfony est accessible à [http://localhost:8000](http://localhost:8000), les appels API devraient utiliser cette base URL :

    ```javascript
    const API_BASE_URL = 'http://localhost:8000';
    ```

### Documentation des Validateurs de Contact

#### validateFirstName

**Description**: Valide le prénom d'un contact. Le prénom doit contenir uniquement des lettres et des espaces.

**Paramètre**: `firstName` (string) - Le prénom à valider.

**Retour**: `boolean` - Retourne `true` si le prénom est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validateFirstName('John'); // true
    const isInvalid = validateFirstName('John123'); // false
    ```

#### validateLastName

**Description**: Valide le nom de famille d'un contact. Le nom doit contenir uniquement des lettres et des espaces.

**Paramètre**: `lastName` (string) - Le nom de famille à valider.

**Retour**: `boolean` - Retourne `true` si le nom de famille est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validateLastName('Doe'); // true
    const isInvalid = validateLastName('Doe123'); // false
    ```

#### validateAge

**Description**: Valide l'âge d'un contact. L'âge doit être un entier positif.

**Paramètre**: `age` (string) - L'âge à valider.

**Retour**: `boolean` - Retourne `true` si l'âge est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validateAge('25'); // true
    const isInvalid = validateAge('-5'); // false
    ```

#### validateCountry

**Description**: Valide le pays d'un contact. Le pays doit contenir uniquement des lettres et des espaces.

**Paramètre**: `country` (string) - Le pays à valider.

**Retour**: `boolean` - Retourne `true` si le pays est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validateCountry('France'); // true
    const isInvalid = validateCountry('France123'); // false
    ```

#### validateEmail

**Description**: Valide l'adresse e-mail d'un contact. L'adresse e-mail doit être dans un format valide.

**Paramètre**: `email` (string) - L'adresse e-mail à valider.

**Retour**: `boolean` - Retourne `true` si l'adresse e-mail est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validateEmail('john.doe@example.com'); // true
    const isInvalid = validateEmail('john.doe@.com'); // false
    ```

#### validatePhone

**Description**: Valide le numéro de téléphone d'un contact. Le numéro de téléphone doit être dans un format valide.

**Paramètre**: `phone` (string) - Le numéro de téléphone à valider.

**Retour**: `boolean` - Retourne `true` si le numéro de téléphone est valide, sinon `false`.

**Exemple**:
    ```bash
    const isValid = validatePhone('+1234567890'); // true
    const isInvalid = validatePhone('12345'); // false
    ```
### Gestion des Notifications

L'application utilise `react-toastify` pour afficher des notifications de manière élégante. 

Les notifications s'afficheront automatiquement en haut à droite de l'écran par défaut, mais vous pouvez personnaliser leur position et leur apparence selon vos besoins.
