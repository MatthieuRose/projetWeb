<?php

/** @var Factory $factory */

use App\Modeles\Personne;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Personne::class, function (Faker $faker) {
    $createAt = $faker->dateTimeInInterval(
        $startDate = '-6 months',
        $interval = '+ 180 days',
        $timezone = date_default_timezone_get()
    );
    return [
        'nom' => 'Cernuta',
        'prenom' => 'Valentin',
        'cv' => $faker->paragraph(),
        'user_id' => 1,
        'created_at' => $createAt,
        'updated_at' => $faker->dateTimeInInterval(
            $startDate = $createAt,
            $interval = $createAt->diff(new DateTime('now'))->format("%R%a days"),
            $timezone = date_default_timezone_get()
        )
    ];
});
