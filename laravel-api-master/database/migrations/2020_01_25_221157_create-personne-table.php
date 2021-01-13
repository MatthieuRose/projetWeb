<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonneTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('personnes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nom', 50)->nullable(false);
            $table->string('prenom', 50)->nullable(false);
            $table->boolean('actif')->default(true)->nullable(false);
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('cv')->nullable(true);
            $table->string('avatar')->nullable(true);
            $table->integer('best_score')->default(0);
            $table->integer('games')->default(0);
            $table->integer('time_played')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('PersonneResource');
    }
}
