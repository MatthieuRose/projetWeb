<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class  AuthController extends Controller {

    /**
     * @var bool
     */
    public $loginAfterSignUp = true;

    /**
     * AuthController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request)
    {
        $input = $request->only('email', 'password');

        if ($token = $this->guard()->attempt($input)) {
            $user = DB::table('users')->where('email', $request->email)->first();
            return $this->respondWithToken($token, $user);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * @return JsonResponse
     */
    public function logout()
    {
        $this->guard()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request)
    {
        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->save();

        if($this->loginAfterSignUp) return $this->login($request);

        return response()->json([
           'success' => true,
           'data' => $user
        ], 200);
    }

    /**
     * Get the authenticated User.
     * @return JsonResponse
     */
    public function me()
    {
        return response()->json($this->guard()->user());
    }

    /**
     * Refresh a token.
     * @return JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Get the token array structure.
     * @param string $token
     * @param null $user
     * @return JsonResponse
     */
    protected function respondWithToken($token, $user = null)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
            'user' => $user
        ]);
    }

    /**
     * @return mixed
     */
    private function guard()
    {
        return Auth::guard();
    }

}
