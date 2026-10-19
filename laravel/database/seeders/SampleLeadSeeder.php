<?php

namespace Database\Seeders;

use App\Models\Lead;
use Illuminate\Database\Seeder;

class SampleLeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Lead::count() === 0) {
            $leads = [
                [
                    'name' => 'Kavinda Jayasuriya',
                    'email' => 'kavinda.j@gmail.com',
                    'phone' => '+94 77 123 4567',
                    'gender' => 'male',
                    'result_code' => 'A',
                    'result_profile' => 'The Keep-It-Cool Investor',
                    'matched_product' => 'First Capital Money Market Fund (FCMMF)*',
                    'status' => 'NEW',
                    'notes' => 'Customer inquired about initial deposit procedure and daily liquidity.',
                    'source' => 'Landing Page Quiz',
                    'answers_json' => [
                        ['questionId' => 1, 'question' => 'Extra money first thought?', 'selected' => 'A', 'text' => 'Keep it somewhere safe with instant access'],
                        ['questionId' => 2, 'question' => 'Comfortable investment duration?', 'selected' => 'A', 'text' => '1 - 6 months'],
                        ['questionId' => 3, 'question' => 'Interest rates fluctuation reaction?', 'selected' => 'A', 'text' => 'Prefer stable liquidity'],
                    ],
                ],
                [
                    'name' => 'Dilini Samaraweera',
                    'email' => 'dilini.sam@yahoo.com',
                    'phone' => '+94 71 987 6543',
                    'gender' => 'female',
                    'result_code' => 'B',
                    'result_profile' => 'The Smooth Operator',
                    'matched_product' => 'First Capital Fixed Income Fund (FCFIF)*',
                    'status' => 'CONTACTED',
                    'notes' => 'Spoke on phone; interested in quarterly payout options.',
                    'source' => 'Design Option 2 Quiz',
                    'answers_json' => [
                        ['questionId' => 1, 'question' => 'Extra money first thought?', 'selected' => 'B', 'text' => 'Leave for a few months for higher yield'],
                        ['questionId' => 2, 'question' => 'Comfortable investment duration?', 'selected' => 'B', 'text' => '6 months - 1 year'],
                    ],
                ],
                [
                    'name' => 'Rohan Senanayake',
                    'email' => 'r.senanayake@outlook.com',
                    'phone' => '+94 76 555 1234',
                    'gender' => 'male',
                    'result_code' => 'C',
                    'result_profile' => 'The Patient Player',
                    'matched_product' => 'Treasury Bonds*',
                    'status' => 'QUALIFIED',
                    'notes' => 'High net worth investor looking for 2-5 year government paper.',
                    'source' => 'Main Quiz Flow',
                    'answers_json' => [
                        ['questionId' => 1, 'question' => 'Investment priority?', 'selected' => 'C', 'text' => 'Milestone in next few years'],
                        ['questionId' => 2, 'question' => 'Investment pattern?', 'selected' => 'C', 'text' => 'Lump-sum long term allocation'],
                    ],
                ],
                [
                    'name' => 'Ananya Mendis',
                    'email' => 'ananya.mendis@gmail.com',
                    'phone' => '+94 70 888 9900',
                    'gender' => 'female',
                    'result_code' => 'D',
                    'result_profile' => 'The Opportunity Hunter',
                    'matched_product' => 'Equities*',
                    'status' => 'CONVERTED',
                    'notes' => 'Account opened and initial equities portfolio funded.',
                    'source' => 'Landing Page Quiz',
                    'answers_json' => [
                        ['questionId' => 1, 'question' => 'Extra money first thought?', 'selected' => 'D', 'text' => 'Higher long-term growth potential'],
                        ['questionId' => 2, 'question' => 'Market fluctuation reaction?', 'selected' => 'D', 'text' => 'Comfortable with volatility for high return'],
                    ],
                ],
            ];

            foreach ($leads as $data) {
                Lead::create($data);
            }
        }
    }
}
