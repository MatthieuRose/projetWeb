<?php

Route::post('login', 'Api\AuthController@login')->name('login');
Route::post('register', 'Api\PersonneController@store')->name('register');

Route::group(['middleware' => 'api'], function () {
    Route::post('me', 'Api\AuthController@me')->name('me');
    Route::get('personnes', 'Api\PersonneController@index');
    Route::get('personnes/{id}', 'Api\PersonneController@show');

    Route::post('logout', 'Api\AuthController@logout');
    Route::post('refresh', 'Api\AuthController@refresh');

    Route::put('personnes/{id}', 'Api\PersonneController@update');

    Route::delete('personnes/{id}', 'Api\PersonneController@destroy');

    Route::get('personnes/admin/{admin_id}/{user_id}', 'Api\PersonneController@addAdmin');
    Route::get('personnes/score/{user_id}/{score}', 'Api\PersonneController@updateScore');
    Route::post('personnes/games', 'Api\PersonneController@updateGames');
});
