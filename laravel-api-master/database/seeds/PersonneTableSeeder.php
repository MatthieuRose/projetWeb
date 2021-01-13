<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PersonneTableSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     * @throws Exception
     */
    public function run() {
        DB::table('users')->insert([
            'name' => 'Valentin Cernuta',
            'email' => 'vcernuta3@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('coucou'), // password
            'is_admin' => true,
            'remember_token' => Str::random(10)
        ]);

        DB::table('personnes')->insert([
            'nom' => 'Cernuta',
            'prenom' => 'Valentin',
            'cv' => 'mon super cv trop cool',
            'user_id' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
