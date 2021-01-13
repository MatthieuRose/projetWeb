<p align="center"><img src="http://www.iut-lens.univ-artois.fr/wp-content/themes/iutlens2016new2/images/screenshot.png" width="100"></p>


## Présentation de ce projet

Version API de l'application taches que nous avons utilisé pendant les séances de TP du module Pweb-1.

## Rappels sur le système d'information utilisé

*   Une tâche est caractérisée par 

    -   Une date d'expiration
    -   Une catégorie
    -   Une description
    -   Un boolean accomplie

*   Une personne est caractérisée par 

    -   Un nom
    -   Un prénom
    -   Une spécialité
    -   Un avatar
    -   Un CV
    -   un booléen qui indique si la personne est active ou non

*   Un suivi d'activité est caractérisé par 

    -   Un titre
    -   Un commentaire

*   Un `User` est la classe proposée par `Laravel` pour mettre en oeuvre l'identification.

* Quelques explications sur les relations entre classes :

    -   Une tâche est accomplie par plusieurs personnes.
    -   Un suivi d'exécution est associé à une tâche et une tâche peut faire l'objet de plusieurs suivis d'exécution
    -   Une personne peut se connecté si un enregistrement dans la table user est associé avec la personne
    -   Un suivi d'exécution est créé par une personne

![Le modèle de données][modele]

### La création du système d'information

Pour créer le système d'information, nous allons utiliser le mécanisme de migration proposé par `Laravel`.

Pour cela nous devons créer :

1.  Les fichiers de migration dans le répertoire `database/migrations`.
1.  Les fichiers de fabrication des enregistrements de chaque table dans le répertoire `database/factories`.
1.  Les fichiers d'insertion des données dans chaque table dans le répertoire `database/seeds`.

Pour faire le lien entre notre application et le système de gestion de base de données, il faut modifier le fichier `.env` 
en indiquant les bonnes valeurs aux variables suivantes :

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nomDeLaBase
DB_USERNAME=NomDeUser
DB_PASSWORD=MDP
```

Il faut ensuite exécuter les commandes suivantes :

```bash
php artisan migrate:fresh
php artisan db:seed   
```

## Modification pour stockage des images 

1.  Création du lien pour accès au répertoire public

    ```bash
    php artisan storage:link
    ```
    
1.  Modification du lieu de stockage par défaut dans le fichier `config/filesystem.php`
    Ici on remplace `local` avec `public` pour pouvoir stocker les avatars.

    ```php
    'default' => env('FILESYSTEM_DRIVER', 'public'),
    ```
        

## Mise en oeuvre de l'authentification

Nous allons utiliser un package supplémentaire : [`tymon/jwt-auth`](https://github.com/tymondesigns/jwt-auth/tree/develop).

Pour configurer notre application Laravel, nous allons suivre le tutoriel [Laravel 6 Rest API using JWT Authentication](https://www.larashout.com/laravel-6-jwt-authentication).

1.  Installation de `tymon/jwt-auth`

    ```bash
    composer require tymon/jwt-auth:dev-develop --prefer-source
    ```
    
1.  Choix du provider

    ```bash
     php artisan vendor:publish
    
     Which provider or tag's files would you like to publish?:
      [0 ] Publish files from all providers and tags listed below
      [1 ] Provider: Facade\Ignition\IgnitionServiceProvider
      [2 ] Provider: Fideloper\Proxy\TrustedProxyServiceProvider
      [3 ] Provider: Illuminate\Foundation\Providers\FoundationServiceProvider
      [4 ] Provider: Illuminate\Mail\MailServiceProvider
      [5 ] Provider: Illuminate\Notifications\NotificationServiceProvider
      [6 ] Provider: Illuminate\Pagination\PaginationServiceProvider
      [7 ] Provider: Laravel\Tinker\TinkerServiceProvider
      [8 ] Provider: Tymon\JWTAuth\Providers\LaravelServiceProvider
      [9 ] Tag: config
      [10] Tag: flare-config
      [11] Tag: ignition-config
      [12] Tag: laravel-errors
      [13] Tag: laravel-mail
      [14] Tag: laravel-notifications
      [15] Tag: laravel-pagination
     > 8
    
    Copied File [/vendor/tymon/jwt-auth/config/config.php] To [/config/jwt.php]
    Publishing complete.
    Publishing complete.
    ```     

1.  Génération du secret

    ```bash
     php artisan jwt:secret
    ```
    
1.  Modification de la classe User pour identification par token.

    ```php
    <?php
    
    namespace App;
    
    use Illuminate\Contracts\Auth\MustVerifyEmail;
    use Illuminate\Foundation\Auth\User as Authenticatable;
    use Illuminate\Notifications\Notifiable;
    use Tymon\JWTAuth\Contracts\JWTSubject;
    
    class User extends Authenticatable implements JWTSubject {
        use Notifiable;
    
        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = [
            'name', 'email', 'password',
        ];
    
        /**
         * The attributes that should be hidden for arrays.
         *
         * @var array
         */
        protected $hidden = [
            'password', 'remember_token',
        ];
    
        /**
         * The attributes that should be cast to native types.
         *
         * @var array
         */
        protected $casts = [
            'email_verified_at' => 'datetime',
        ];
    
        /**
         * Get the identifier that will be stored in the subject claim of the JWT.
         *
         * @return mixed
         */
        public function getJWTIdentifier() {
            return $this->getKey();
        }
    
        /**
         * Return a key value array, containing any custom claims to be added to the JWT.
         *
         * @return array
         */
        public function getJWTCustomClaims() {
            return [];
        }
    }
    ```
    
1.  Mofigication de la méthode d'authentification dans le fichier `config/auth.php`

    ```
    ...
    'defaults' => [
         'guard' => 'api',
         'passwords' => 'users',
    ],
       
    'guards' => [
         'web' => [
             'driver' => 'session',
             'provider' => 'users',
         ],
     
         'api' => [
             'driver' => 'token',
             'provider' => 'users',
         ],
    ],
    ...
    ```

1.  Création d'un contrôleur d'authentification 

    ````bash
    php artisan make:controller Api\\AuthController
    ````
    qui crée un fichier `app/Http/Controllers/Api/authController`. Modifier le code avec le contenu suivant :
    
    ````php
    <?php
    
    namespace App\Http\Controllers\Api;
    
    use JWTAuth;
    use App\Http\Controllers\Controller;
    use Illuminate\Http\Request;
    use Tymon\JWTAuth\Exceptions\JWTException;
    
    class AuthController extends Controller
    {
        /**
         * @var bool
         */
        public $loginAfterSignUp = true;
    
        /**
         * @param Request $request
         * @return \Illuminate\Http\JsonResponse
         */
        public function login(Request $request)
        {
            $input = $request->only('email', 'password');
            $token = null;
    
            if (!$token = JWTAuth::attempt($input)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Email or Password',
                ], 401);
            }
    
            return response()->json([
                'success' => true,
                'token' => $token,
            ]);
        }
    
        /**
         * @param Request $request
         * @return \Illuminate\Http\JsonResponse
         * @throws \Illuminate\Validation\ValidationException
         */
        public function logout(Request $request)
        {
            $this->validate($request, [
                'token' => 'required'
            ]);
    
            try {
                JWTAuth::invalidate($request->token);
    
                return response()->json([
                    'success' => true,
                    'message' => 'User logged out successfully'
                ]);
            } catch (JWTException $exception) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sorry, the user cannot be logged out'
                ], 500);
            }
        }
    
        /**
         * @param RegistrationFormRequest $request
         * @return \Illuminate\Http\JsonResponse
         */
    /*    public function register(RegistrationFormRequest $request)
        {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->save();
    
            if ($this->loginAfterSignUp) {
                return $this->login($request);
            }
    
            return response()->json([
                'success'   =>  true,
                'data'      =>  $user
            ], 200);
        }*/
     
       /**
        * Get the token array structure.
        *
        * @param  string $token
        *
        * @return \Illuminate\Http\JsonResponse
        */
       protected function respondWithToken($token)
       {
           return response()->json([
               'access_token' => $token,
               'token_type' => 'bearer',
               'expires_in' => auth()->factory()->getTTL() * 60
           ]);
       }
    }
    ````
    
1.  Ajouter un contrôleur pour les personnes et les users associés.

    ````bash
    php artisan make:controller Api\\PersonneController
    ````    
    
    qui crée un fichier `app/Http/Controllers/Api/PersonneController`. Modifier le code avec le contenu suivant :
    
     
1.  Modification du fichier `routes/api.php`    

    ````php
    <?php
     
    use Illuminate\Http\Request;
     
    /*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register API routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | is assigned the "api" middleware group. Enjoy building your API!
    |
    */
     
    Route::middleware('auth:api')->get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('login', 'Api\AuthController@login');
    Route::post('register', 'Api\PersonneController@store');
    
    Route::post('personnes', 'Api\PersonneController@store');
    
    Route::group(['middleware' => 'auth.jwt'], function () {
        Route::post('logout', 'Api\AuthController@logout');
        Route::get('me', 'Api\AuthController@me');
        Route::post('refresh', 'Api\AuthController@refresh');
        Route::get('personnes', 'Api\PersonneController@index');
        Route::get('personnes/{id}', 'Api\PersonneController@show');
        Route::put('personnes/{id}', 'Api\PersonneController@update');
        Route::delete('personnes/{id}', 'Api\PersonneController@destroy');
    });
    ````    
### Gestion des permissions et des rôles

Installation d'un paquetage qui gère les permissions et les rôles : [Laravel-permission](https://github.com/spatie/laravel-permission).

Pour l'installation on pourra se référer à la [documentation](https://docs.spatie.be/laravel-permission/v3/introduction/), et à un article de présentation 
    
---
[modele]: docs/images/modele.png  "Figure 1. Le modèle de données" {#modele  .centre height="300px" }

