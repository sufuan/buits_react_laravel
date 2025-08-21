<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PreviousCommitteeMember>
 */
class PreviousCommitteeMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $designations = [
            'President', 'Vice President', 'General Secretary', 'Joint Secretary',
            'Treasurer', 'Assistant Treasurer', 'Organizing Secretary',
            'Cultural Secretary', 'Sports Secretary', 'Social Welfare Secretary',
            'Publication Secretary', 'Research Secretary', 'Executive Member',
            'Senior Executive Member', 'Committee Member', 'Advisory Member',
            'Senior Member', 'Associate Member', 'Special Member', 'Honorary Member'
        ];

        return [
            'name' => $this->faker->name(),
            'designation' => $this->faker->randomElement($designations),
            'photo' => $this->faker->imageUrl(400, 400, 'people', true, 'member'),
            'committee_number' => $this->faker->numberBetween(1, 6),
            'member_order' => $this->faker->numberBetween(1, 20),
        ];
    }

    /**
     * Indicate that the member is a president.
     */
    public function president(): static
    {
        return $this->state(fn (array $attributes) => [
            'designation' => 'President',
            'member_order' => 1,
        ]);
    }

    /**
     * Indicate that the member belongs to a specific committee.
     */
    public function committee(int $committeeNumber): static
    {
        return $this->state(fn (array $attributes) => [
            'committee_number' => $committeeNumber,
        ]);
    }
}
