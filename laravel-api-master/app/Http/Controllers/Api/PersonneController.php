<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonneResource;
use App\Modeles\Personne;
use App\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PersonneController extends Controller
{

    protected $data = [];

    public function __construct()
    {
        $this->data = [
            'status' => false,
            'code' => 401,
            'data' => null,
            'err' => [
                'code' => 1,
                'message' => 'Unauthorized'
            ]
        ];
    }


    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $personnes = Personne::orderBy('best_score', 'desc')->get();
        $this->data['status'] = true;
        $this->data['code'] = 200;
        $this->data['data'] = PersonneResource::collection($personnes);
        $this->data['err'] = null;

        return response()->json($this->data, $this->data['code']);
    }


    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $user = factory(User::class)->create([
                    'name' => $request->prenom . ' ' . $request->nom,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                ]);

                $personne = factory(Personne::class)->create([
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'actif' => $request->get('actif', true),
                    'cv' => $request->get('cv', 'to complete'),
                    'avatar' => 'avatars/anonymous.png',
                    'user_id' => $user->id,
                ]);

                $path = null;
                if ($request->hasFile('avatar')) {
                    $path = $request->file('avatar')->storeAs('avatars', 'avatar_de_' . $personne->id . '.' . $request->file('avatar')->extension(), 'public');
                    $personne->avatar = $path;
                    $personne->save();
                }
            });
        } catch (Exception $e) {
            $this->data['status'] = false;
            $this->data['code'] = 422;
            $this->data['data'] = null;
            $this->data['err'] = [
                'code' => 1,
                'message' => $e->getMessage(),
            ];

            return response()->json($this->data, $this->data['code']);
        }

        $personne = Personne::select(['personnes.*', 'users.id', 'users.email'])->join('users', 'users.id', '=', 'personnes.user_id')->where('users.email', $request->email)->first();

        $this->data['status'] = true;
        $this->data['code'] = 200;
        $this->data['data'] = new PersonneResource($personne);
        $this->data['err'] = null;

        return response()->json($this->data, $this->data['code']);
    }


    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $personne = Personne::find($id);
        if (!$personne) {
            $this->data['status'] = false;
            $this->data['code'] = 422;
            $this->data['data'] = null;
            $this->data['err'] = [
                'code' => 1,
                'message' => sprintf('La personne avec l\'id : %d n\'est pas dans la base', $id),
            ];

            return response()->json($this->data, $this->data['code']);
        }

        $user = $personne->user;

        if ($request->has('email') && $personne->user->email != $request->email) {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'email' => ['required', 'email', Rule::unique('users')->ignore($user)],
            ]);
            if ($validator->fails()) {
                $this->data['code'] = 422;
                $this->data['err'] = [
                    'code' => 1,
                    'message' => $validator->errors(),
                ];

                return response()->json($this->data, $this->data['code']);
            }
        }

        $path = $personne->avatar;
        if ($request->hasFile('avatar')) {
            Storage::disk('public')->delete($personne->avatar);
            $path = $request->file('avatar')->storeAs('avatars', 'avatar_de_' . $personne->id . '.' . $request->file('avatar')->extension(), 'public');
        }

        $personne->nom = $request->get('nom');
        $personne->prenom = $request->get('prenom');
        $user->name = $request->prenom . ' ' . $request->nom;
        $user->email = $request->get('email');

        if ($request->has('password')) $user->password = bcrypt($request->get('password'));
        if ($request->has('cv')) $personne->cv = $request->get('cv');
        if ($request->has('actif')) {
            if ($request->get('actif')) $personne->actif = 1;
            else $personne->actif = 0;
        }

        $personne->avatar = $path;
        $personne->save();
        $user->save();

        $this->data['status'] = true;
        $this->data['code'] = 200;
        $this->data['data'] = new PersonneResource($personne);
        $this->data['err'] = null;

        return response()->json($this->data, $this->data['code']);
    }


    /**
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id)
    {
        $personne = Personne::find($id);
        if (!$personne) {
            $this->data['status'] = false;
            $this->data['code'] = 422;
            $this->data['data'] = null;
            $this->data['err'] = [
                'code' => 1,
                'message' => sprintf('La personne avec l\'id : %d n\'est pas dans la base', $id),
            ];
        } else {
            $this->data['status'] = true;
            $this->data['code'] = 200;
            $this->data['data'] = new PersonneResource($personne);
            $this->data['err'] = null;
        }

        return response()->json($this->data, $this->data['code']);
    }


    /**
     * @param $id
     * @return JsonResponse
     */
    public function destroy(int $id)
    {
        $personne = Personne::find($id);
        if (!$personne) {
            $this->data['status'] = false;
            $this->data['code'] = 422;
            $this->data['data'] = null;
            $this->data['err'] = [
                'code' => 1,
                'message' => sprintf('La personne avec l\'id : %d n\'est pas dans la base', $id),
            ];

            return response()->json($this->data, $this->data['code']);
        }

        Log::info('path de l\'avatar à supprimer : ' . $personne->avatar);
        Storage::disk('public')->delete($personne->avatar);

        $user = $personne->user;
        if ($user->delete()) {
            return response()->json([
                'success' => true
            ], 204);
        } else {
            $this->data['status'] = false;
            $this->data['code'] = 422;
            $this->data['data'] = null;
            $this->data['err'] = [
                'code' => 1,
                'message' => sprintf('La personne avec l\'id : %d ne peut pas être supprimée', $id),
            ];

            return response()->json($this->data, $this->data['code']);
        }
    }

    public function addAdmin(int $admin_id, int $user_id)
    {
        $admin = User::find($admin_id);
        if (!$admin->is_admin) {
            return $this->returnError(sprintf('La personne avec l\'id : %d n\'est pas un administrateur', $admin_id));
        }

        $user = User::find($user_id);
        if (!$user) {
            return $this->returnError(sprintf('La personne avec l\'id : %d n\'existe pas.', $user_id));
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        $personne = Personne::find($user_id);
        return $this->returnSuccess(new PersonneResource($personne));
    }

    public function updateScore(int $user_id, int $score)
    {
        $personne = Personne::find($user_id);
        if ($personne) {
            if ($score > $personne->best_score) {
                $personne->best_score = $score;
                $personne->save();
            }
            return $this->returnSuccess(new PersonneResource($personne));
        } else {
            return $this->returnError(sprintf('La personne avec l\'id %d n\'existe pas.', $user_id));
        }
    }

    public function updateGames(Request $request)
    {
        if ($request->has('user_id') && $request->has('time_played')) {
            $user_id = $request->user_id;
            $personne = Personne::find($user_id);
            if ($personne) {
                $personne->games += 1;
                $personne->time_played += $request->time_played;
                $personne->save();
                return $this->returnSuccess(new PersonneResource($personne));
            } else {
                return $this->returnError(sprintf('La personne avec l\'id %d n\'existe pas.', $user_id));
            }
        } else {
            return $this->returnError('user_id ou time_played non trouvé');
        }
    }

    private function returnError(string $message)
    {
        $this->data['status'] = false;
        $this->data['code'] = 422;
        $this->data['data'] = null;
        $this->data['err'] = [
            'code' => 1,
            'message' => $message,
        ];

        return response()->json($this->data, $this->data['code']);
    }

    private function returnSuccess($data)
    {
        $this->data['status'] = true;
        $this->data['code'] = 200;
        $this->data['data'] = $data;
        $this->data['err'] = null;

        return response()->json($this->data, $this->data['code']);
    }

}
