<?php

namespace App\Modeles;

use App\User;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Personne extends Authenticatable implements JWTSubject {

    function user() {
        return $this->belongsTo(User::class);
    }

    /**
     * @inheritDoc
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }

    /**
     * @inheritDoc
     */
    public function getJWTCustomClaims() {
        return [];
    }

}
