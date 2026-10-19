<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'id' => 1,
                'question' => "You have some extra money sitting in your account. What’s your first thought?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "I’d keep it somewhere safe, but I want to be able to access it anytime."],
                    ['key' => 'B', 'label' => 'B', 'text' => "I’m happy to leave it invested for a few months if I can earn a return."],
                    ['key' => 'C', 'label' => 'C', 'text' => "I’m comfortable leaving it invested for longer if it can grow steadily."],
                    ['key' => 'D', 'label' => 'D', 'text' => "I’d rather invest for the potential of higher long-term growth"]
                ]
            ],
            [
                'id' => 2,
                'question' => "How long can you comfortably leave your money invested?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "1 - 6 months"],
                    ['key' => 'B', 'label' => 'B', 'text' => "6 months – 1 year"],
                    ['key' => 'C', 'label' => 'C', 'text' => "1–2 years"],
                    ['key' => 'D', 'label' => 'D', 'text' => "More than 2 years"]
                ]
            ],
            [
                'id' => 3,
                'question' => "Interest rates in the market move up and down frequently. What is your reaction?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "I’d probably want to take my money out."],
                    ['key' => 'B', 'label' => 'B', 'text' => "A little movement is fine, but I prefer stability."],
                    ['key' => 'C', 'label' => 'C', 'text' => "I can handle some ups and downs if I have a longer-term plan."],
                    ['key' => 'D', 'label' => 'D', 'text' => "I’m comfortable with bigger ups and downs for the chance of higher growth."]
                ]
            ],
            [
                'id' => 4,
                'question' => "What is your priority for investing right now?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "A financial safety net"],
                    ['key' => 'B', 'label' => 'B', 'text' => "A goal coming up in the next year or so"],
                    ['key' => 'C', 'label' => 'C', 'text' => "A bigger milestone in the next few years"],
                    ['key' => 'D', 'label' => 'D', 'text' => "Long-term wealth and financial freedom"]
                ]
            ],
            [
                'id' => 5,
                'question' => "What would you say is your pattern for investing?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "Setting aside an amount every month"],
                    ['key' => 'B', 'label' => 'B', 'text' => "Investing when I have some extra money"],
                    ['key' => 'C', 'label' => 'C', 'text' => "Investing a large amount at once and letting it work"],
                    ['key' => 'D', 'label' => 'D', 'text' => "Investing when I spot an opportunity I believe in"]
                ]
            ],
            [
                'id' => 6,
                'question' => "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "Keep it flexible and invest for the short term."],
                    ['key' => 'B', 'label' => 'B', 'text' => "Aim for a relatively stable return while keeping access to my money."],
                    ['key' => 'C', 'label' => 'C', 'text' => "Lock it into a longer-term government investment and earn regular interest."],
                    ['key' => 'D', 'label' => 'D', 'text' => "Invest in shares and stay invested for long-term growth."]
                ]
            ],
            [
                'id' => 7,
                'question' => "Which statement sounds most like you?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "“I like knowing my money is there when I need it.”"],
                    ['key' => 'B', 'label' => 'B', 'text' => "“I want my money to grow, without taking on too much risk.”"],
                    ['key' => 'C', 'label' => 'C', 'text' => "“I’m happy to wait if it means building my money for the potential of long-term growth.”"],
                    ['key' => 'D', 'label' => 'D', 'text' => "“I’m playing the long game when it comes to my wealth.”"]
                ]
            ]
        ];

        $results = [
            'A' => [
                'key' => 'A',
                'number' => '01',
                'name' => 'The Keep-It-Cool Investor',
                'style' => 'Flexible & Agile',
                'product' => 'First Capital Money Market Fund (FCMMF)*',
                'productShort' => 'First Capital Money Market Fund (FCMMF)*',
                'productOptionId' => 'unit-trust',
                'description' => 'You like keeping things simple, flexible and within your comfort zone. You want your money to work, but you also like knowing you can access it when you need it.',
                'vibe' => 'Keep calm. Keep flexible.',
                'productDisclaimer' => '* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC)',
                'procedureGuide' => [
                    'label' => 'FCAM-UT-Procedure-Guide-to-Investors.pdf',
                    'url' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
                ]
            ],
            'B' => [
                'key' => 'B',
                'number' => '02',
                'name' => 'The Smooth Operator',
                'style' => 'Income-Focused & Flexible',
                'product' => 'First Capital Fixed Income Fund (FCFIF)*',
                'productShort' => 'First Capital Fixed Income Fund (FCFIF)*',
                'productOptionId' => 'unit-trust',
                'description' => 'You’re looking for the sweet spot between earning a return and keeping your money accessible. You’re not chasing every opportunity - you prefer a more measured approach.',
                'vibe' => 'Thoughtful choices. Smarter Investing.',
                'productDisclaimer' => '* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC)',
                'procedureGuide' => [
                    'label' => 'FCAM-UT-Procedure-Guide-to-Investors.pdf',
                    'url' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
                ]
            ],
            'C' => [
                'key' => 'C',
                'number' => '03',
                'name' => 'The Patient Player',
                'style' => 'Long-term & income-focused',
                'product' => 'Treasury Bonds*',
                'productShort' => 'Treasury Bonds*',
                'productOptionId' => 'gov-securities',
                'description' => 'You’re comfortable giving your money time to work. You prefer a defined investment period and regular return as you build towards your bigger financial goals.',
                'vibe' => 'Play the long game.',
                'productDisclaimer' => '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures.',
                'procedureGuide' => [
                    'label' => 'Information-Memorandum-FCT.pdf',
                    'url' => 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf'
                ]
            ],
            'D' => [
                'key' => 'D',
                'number' => '04',
                'name' => 'The Opportunity Hunter',
                'style' => 'Growth-focused',
                'product' => 'Equities*',
                'productShort' => 'Equities*',
                'productOptionId' => 'equities',
                'description' => 'You’re thinking beyond the short term. You’re comfortable with market ups and downs and are focused on growing your wealth over the long run.',
                'vibe' => 'Spot the opportunity. Think long term.',
                'productDisclaimer' => '*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures.',
                'procedureGuide' => [
                    'label' => 'FCE-procedure-guide_.pdf',
                    'url' => 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf'
                ]
            ]
        ];

        $testimonials = [
            [
                'id' => 'test-1',
                'quote' => "I wanted to start investing before 25, so I did my research and found First Capital. They make investing accessible and approachable, and it's the only investment partner I actively follow. Being curious opened so many doors for me. You don't need a lot of funds or education to start. You just need to start",
                'name' => 'Amandi Yatawara',
                'role' => 'Public Speaker & Presenter',
                'rating' => 5,
                'status' => 'Active',
                'visible' => true,
                'createdAt' => '2026-10-13T09:45:00+00:00'
            ],
            [
                'id' => 'test-2',
                'quote' => "I started stocks for the first time in Sri Lanka through First Capital because my friends are here and it's very trustworthy. The portal is so easy to use, and it's given me good results in the six or seven months I've been into stocks. I told so many of my friends. Now they also have money market funds at First Capital, and they're surprised.",
                'name' => 'Achira Paranavithana',
                'role' => 'Investor',
                'rating' => 5,
                'status' => 'Active',
                'visible' => true,
                'createdAt' => '2026-10-13T09:45:00+00:00'
            ],
            [
                'id' => 'test-3',
                'quote' => "You cannot expect everyone to have the financial literacy, so they should come through an investment company like First Capital, because they are the experts in that.",
                'name' => 'Tilak Gunasekara',
                'role' => 'Managing Director/CEO at Sathosa Motors PLC',
                'rating' => 5,
                'status' => 'Active',
                'visible' => true,
                'createdAt' => '2026-10-10T09:45:00+00:00'
            ],
            [
                'id' => 'test-4',
                'quote' => 'I started with just LKR 1,000, mostly to see what would happen. A year later, investing is simply part of my monthly routine.',
                'name' => 'Dinuka P.',
                'role' => 'First-time investor',
                'rating' => 5,
                'status' => 'Draft',
                'visible' => false,
                'createdAt' => '2026-10-08T09:45:00+00:00'
            ]
        ];

        $whyReasons = [
            [
                'id' => 'reason-1',
                'icon' => 'Users',
                'title' => 'Professional Management',
                'copy' => "With the premier Unit Trust company in Sri Lanka, there’s no need to pick assets; specialists track the market for you.",
                'visible' => true,
                'order' => 1
            ],
            [
                'id' => 'reason-2',
                'icon' => 'BarChart3',
                'title' => 'Diversification',
                'copy' => "Your risk spreads across multiple investments, not one big bet.",
                'visible' => true,
                'order' => 2
            ],
            [
                'id' => 'reason-3',
                'icon' => 'Sparkles',
                'title' => 'Start Small',
                'copy' => "Begin with only LKR 1,000.",
                'visible' => true,
                'order' => 3
            ],
            [
                'id' => 'reason-4',
                'icon' => 'RefreshCw',
                'title' => 'Easy Entry and Exit',
                'copy' => "Buy or sell units with flexibility, because you deserve the power to control your assets.",
                'visible' => true,
                'order' => 4
            ],
            [
                'id' => 'reason-5',
                'icon' => 'Landmark',
                'title' => '40+ Years of Investment Expertise',
                'copy' => "Over four decades of experience in Sri Lanka’s capital markets.",
                'visible' => true,
                'order' => 5
            ],
            [
                'id' => 'reason-6',
                'icon' => 'CircleDollarSign',
                'title' => 'Investment Options for Different Goals',
                'copy' => "Investments in different asset classes to suit different goals and time horizons.",
                'visible' => true,
                'order' => 6
            ],
            [
                'id' => 'reason-7',
                'icon' => 'Building2',
                'title' => 'Backed by Janashakthi Group',
                'copy' => "Part of one of Sri Lanka’s established financial conglomerates.",
                'visible' => true,
                'order' => 7
            ],
            [
                'id' => 'reason-8',
                'icon' => 'BookOpen',
                'title' => 'Gain Research Insights and Education',
                'copy' => "Access market insights, research and educational content to invest with confidence.",
                'visible' => true,
                'order' => 8
            ]
        ];

        $investmentProducts = [
            [
                'id' => 'unit-trust',
                'number' => '01',
                'title' => 'Unit Trust Funds',
                'shortCopy' => 'A Unit Trust Fund pools money from multiple investors into a single fund. This money is professionally managed and invested in a range of investments based on the fund’s investment objective. When you invest, you receive units in the fund based on the amount you invest. You can choose from three Unit Trust Funds.',
                'tags' => ['3 Fund Choices', 'From LKR 1,000', 'High Liquidity'],
                'video' => [
                    'title' => 'Learn more about Unit Trust Funds',
                    'url' => 'https://www.tiktok.com/@first.capital/video/7593165117668265223',
                    'platform' => 'TikTok',
                ],
                'disclaimer' => '*Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC)',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
                'guideLabel' => 'FCAM-UT-Procedure-Guide-to-Investors.pdf',
            ],
            [
                'id' => 'gov-securities',
                'number' => '02',
                'title' => 'Government Securities',
                'shortCopy' => 'Government securities are instrument issued by the Government of Sri Lanka to raise money. When you invest, you lend your money to the government for a defined period. In return, you receive interest periodically, with the original investment paid back at maturity.',
                'tags' => ['Government-issued', 'Regular interest', 'Defined maturity', 'Risk-free instrument'],
                'video' => [
                    'title' => 'Government Securities explained',
                    'url' => 'https://www.youtube.com/watch?v=LZoAwRqGr9M&t=20s',
                    'platform' => 'YouTube',
                ],
                'disclaimer' => '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions.',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf',
                'guideLabel' => 'Information-Memorandum-FCT.pdf',
            ],
            [
                'id' => 'equities',
                'number' => '03',
                'title' => 'Equities',
                'shortCopy' => 'It simply means investing in shares of listed companies. When you buy shares, you own a % of the company. The value of your investment can rise or fall based on the company’s performance and market conditions.',
                'tags' => ['Long-term growth potential', 'Own listed shares', 'Market participation'],
                'video' => [
                    'title' => 'How do equities work?',
                    'url' => 'https://www.youtube.com/shorts/HGL82Tv1wJE',
                    'platform' => 'YouTube',
                ],
                'disclaimer' => '*Disclaimer: Equity investments are subject to market risk | Please refer to the Procedure Guide related to Equities to understand our internal procedures related to products and transactions.',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf',
                'guideLabel' => 'FCE-procedure-guide_.pdf',
            ],
        ];

        AppSetting::setValue('quiz_questions', $questions);
        AppSetting::setValue('quiz_results', $results);
        AppSetting::setValue('testimonials', $testimonials);
        AppSetting::setValue('why_first_capital', $whyReasons);
        AppSetting::setValue('investment_products', $investmentProducts);
    }
}

