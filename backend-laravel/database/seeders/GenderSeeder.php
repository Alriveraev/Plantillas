<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gender;

class GenderSeeder extends Seeder
{
    public function run(): void
    {
        $genders = [
            ['key' => 'male', 'name' => 'Masculino'],
            ['key' => 'female', 'name' => 'Femenino'],
            ['key' => 'other', 'name' => 'Otro'],
            ['key' => 'prefer_not_say', 'name' => 'Prefiero no decirlo'],
        ];

        foreach ($genders as $gender) {
            Gender::create($gender);
        }
    }
}
