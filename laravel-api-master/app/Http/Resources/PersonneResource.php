<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PersonneResource extends JsonResource {

    /**
     * Transform the resource into an array.
     * @param Request $request
     * @return array
     */
    public function toArray($request) {
        if ($this->avatar == null)
            $path = 'avatars/anonymous.png';
        else
            $path = $this->avatar;
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'score' => $this->best_score,
            'actif' => $this->actif,
            'cv' => $this->cv,
            'avatar'  => url(Storage::url($path)),
            'user' => $this->user,
            'games' => $this->games,
            'timePlayed' => $this->time_played
        ];
    }

}
